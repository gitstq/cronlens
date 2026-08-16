/**
 * CronLens — cron-parser.js
 * Zero-dependency cron expression parser.
 *
 * Supports:
 *  - 5-field  : minute hour day-of-month month day-of-week
 *  - 6-field  : second minute hour day-of-month month day-of-week
 *  - shortcuts: @yearly @annually @monthly @weekly @daily @midnight @hourly @reboot
 *  - syntax   : * , - / ? L W # and names (JAN-DEC, SUN-SAT)
 *
 * Works in both browser (window.CronParser) and Node (module.exports).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CronParser = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MONTHS = {
    JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
    JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12
  };

  var DAYS = {
    SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6
  };

  var SHORTCUTS = {
    '@yearly': '0 0 1 1 *',
    '@annually': '0 0 1 1 *',
    '@monthly': '0 0 1 * *',
    '@weekly': '0 0 * * 0',
    '@daily': '0 0 * * *',
    '@midnight': '0 0 * * *',
    '@hourly': '0 * * * *'
  };

  var SHORTCUT_KEYS = Object.keys(SHORTCUTS);

  /**
   * Expand a single cron field into a matcher descriptor.
   * @param {string} field raw field text
   * @param {number} min minimum value
   * @param {number} max maximum value
   * @param {Object} names name->value map (optional)
   * @returns {Object} { values:Set, isStar, last, nearestWeekday, nth, error }
   */
  function expandField(field, min, max, names) {
    var out = {
      values: new Set(),
      isStar: false,
      last: false,
      nearestWeekday: false,
      nth: null,
      error: null
    };

    field = String(field).trim();
    if (!field) {
      out.error = 'EMPTY_FIELD';
      return out;
    }

    // '?' is equivalent to '*' in dom/dow
    if (field === '?') {
      out.isStar = true;
      for (var i = min; i <= max; i++) out.values.add(i);
      return out;
    }

    // L (last) — dom: last day of month; dow: Saturday
    if (field === 'L') {
      out.last = true;
      if (max === 6) {
        out.values.add(6);
      }
      return out;
    }

    // NL in dow — last weekday of month, e.g. 5L = last Friday
    var lastWeekdayMatch = field.match(/^(\d{1})L$/);
    if (lastWeekdayMatch && max === 6) {
      var lw = parseInt(lastWeekdayMatch[1], 10);
      if (lw < 0 || lw > 6) {
        out.error = 'OUT_OF_RANGE';
        return out;
      }
      out.last = true;
      out.lastWeekday = lw;
      out.values.add(lw);
      return out;
    }

    // W (nearest weekday) — dom only
    if (/^\d{1,2}W$/i.test(field)) {
      var wDay = parseInt(field, 10);
      if (wDay < min || wDay > max) {
        out.error = 'OUT_OF_RANGE';
        return out;
      }
      out.nearestWeekday = true;
      out.values.add(wDay);
      return out;
    }

    // # (nth weekday) — dow only, e.g. 3#2 (second Tuesday)
    var nthMatch = field.match(/^(\d{1})#(\d{1})$/);
    if (nthMatch) {
      var weekday = parseInt(nthMatch[1], 10);
      var nth = parseInt(nthMatch[2], 10);
      if (weekday < 0 || weekday > 6 || nth < 1 || nth > 5) {
        out.error = 'INVALID_NTH';
        return out;
      }
      out.nth = { weekday: weekday, n: nth };
      out.values.add(weekday);
      return out;
    }

    // List of items separated by commas
    var items = field.split(',');
    var anyStar = false;
    for (var k = 0; k < items.length; k++) {
      var item = items[k].trim();
      if (!item) {
        out.error = 'EMPTY_ITEM';
        return out;
      }
      if (item === '*') {
        anyStar = true;
        continue;
      }
      var step = 1;
      var rangePart = item;
      var slashIdx = item.indexOf('/');
      if (slashIdx !== -1) {
        rangePart = item.slice(0, slashIdx);
        var stepStr = item.slice(slashIdx + 1);
        if (!/^\d+$/.test(stepStr)) {
          out.error = 'INVALID_STEP';
          return out;
        }
        step = parseInt(stepStr, 10);
        if (step <= 0) {
          out.error = 'INVALID_STEP';
          return out;
        }
      }

      var lo, hi;
      if (rangePart === '*') {
        lo = min;
        hi = max;
      } else {
        var dashIdx = rangePart.indexOf('-');
        if (dashIdx !== -1) {
          var loStr = rangePart.slice(0, dashIdx);
          var hiStr = rangePart.slice(dashIdx + 1);
          lo = resolveValue(loStr, min, max, names);
          hi = resolveValue(hiStr, min, max, names);
          if (lo === null || hi === null) {
            out.error = 'INVALID_RANGE';
            return out;
          }
          if (lo > hi) {
            // wrap-around ranges like FRI-MON are allowed in some cron impls
            // we treat them as lo..max plus min..hi
            for (var w = lo; w <= max; w += step) out.values.add(w);
            for (var w2 = min; w2 <= hi; w2 += step) out.values.add(w2);
            continue;
          }
        } else {
          lo = resolveValue(rangePart, min, max, names);
          if (lo === null) {
            out.error = 'INVALID_VALUE';
            return out;
          }
          hi = lo;
        }
      }

      for (var v = lo; v <= hi; v += step) {
        out.values.add(v);
      }
    }

    if (anyStar) {
      out.isStar = true;
      for (var i2 = min; i2 <= max; i2++) out.values.add(i2);
    }

    return out;
  }

  /**
   * Resolve a single token (number or name) to an integer value.
   */
  function resolveValue(token, min, max, names) {
    token = token.trim();
    if (/^\d+$/.test(token)) {
      var n = parseInt(token, 10);
      if (n < min || n > max) return null;
      return n;
    }
    if (names) {
      var upper = token.toUpperCase();
      if (Object.prototype.hasOwnProperty.call(names, upper)) {
        var named = names[upper];
        if (named < min || named > max) return null;
        return named;
      }
    }
    return null;
  }

  /**
   * Parse a full cron expression.
   * @param {string} expr
   * @returns {Object} parsed descriptor or { error }
   */
  function parseCron(expr) {
    if (typeof expr !== 'string') {
      return { error: 'NOT_STRING' };
    }
    expr = expr.trim();
    if (!expr) {
      return { error: 'EMPTY' };
    }

    // Shortcuts
    var lower = expr.toLowerCase();
    if (lower.charAt(0) === '@') {
      if (lower === '@reboot') {
        return {
          isShortcut: true,
          shortcut: '@reboot',
          raw: expr,
          error: null
        };
      }
      if (Object.prototype.hasOwnProperty.call(SHORTCUTS, lower)) {
        expr = SHORTCUTS[lower];
      } else {
        return { error: 'UNKNOWN_SHORTCUT', raw: expr };
      }
    }

    var parts = expr.split(/\s+/);
    if (parts.length !== 5 && parts.length !== 6) {
      return { error: 'FIELD_COUNT', raw: expr };
    }

    var hasSeconds = parts.length === 6;
    var second = null;
    var minute, hour, dom, month, dow;
    if (hasSeconds) {
      second = parts[0];
      minute = parts[1];
      hour = parts[2];
      dom = parts[3];
      month = parts[4];
      dow = parts[5];
    } else {
      minute = parts[0];
      hour = parts[1];
      dom = parts[2];
      month = parts[3];
      dow = parts[4];
    }

    var pSecond = hasSeconds ? expandField(second, 0, 59, null) : null;
    var pMinute = expandField(minute, 0, 59, null);
    var pHour = expandField(hour, 0, 23, null);
    var pDom = expandField(dom, 1, 31, null);
    var pMonth = expandField(month, 1, 12, MONTHS);
    var pDow = expandField(dow, 0, 6, DAYS);

    var fieldErrors = [
      hasSeconds ? pSecond : null,
      pMinute, pHour, pDom, pMonth, pDow
    ].filter(Boolean);

    for (var i = 0; i < fieldErrors.length; i++) {
      if (fieldErrors[i].error) {
        return {
          error: fieldErrors[i].error,
          fieldIndex: hasSeconds ? i : i + 1,
          raw: expr
        };
      }
    }

    return {
      hasSeconds: hasSeconds,
      second: pSecond,
      minute: pMinute,
      hour: pHour,
      dom: pDom,
      month: pMonth,
      dow: pDow,
      raw: expr,
      error: null
    };
  }

  /**
   * Last day of the month for a given Date.
   */
  function lastDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  /**
   * Effective date for a "nearest weekday" (W) day-of-month.
   */
  function effectiveWeekdayDate(year, month, day) {
    var d = new Date(year, month - 1, day);
    var dow = d.getDay();
    if (dow === 6) { // Saturday -> Friday
      return day - 1 >= 1 ? day - 1 : day + 2;
    }
    if (dow === 0) { // Sunday -> Monday
      var last = new Date(year, month, 0).getDate();
      return day + 1 <= last ? day + 1 : day - 2;
    }
    return day;
  }

  /**
   * Check whether a Date matches the day-of-month / day-of-week constraints.
   * Standard Vixie-cron OR semantics when both are restricted.
   */
  function matchesDay(date, parsed) {
    var dom = parsed.dom;
    var dow = parsed.dow;
    var domMatch = false;
    var dowMatch = false;

    if (dom.isStar) {
      domMatch = true;
    } else if (dom.last) {
      domMatch = date.getDate() === lastDayOfMonth(date);
    } else if (dom.nearestWeekday) {
      var dayNum = date.getDate();
      var eff = effectiveWeekdayDate(date.getFullYear(), date.getMonth() + 1, dayNum);
      domMatch = dayNum === eff && dom.values.has(dayNum);
    } else {
      domMatch = dom.values.has(date.getDate());
    }

    if (dow.isStar) {
      dowMatch = true;
    } else if (dow.last) {
      var last = lastDayOfMonth(date);
      var lastWd = dow.lastWeekday !== undefined ? dow.lastWeekday : 6;
      dowMatch = date.getDay() === lastWd && date.getDate() > last - 7;
    } else if (dow.nth) {
      var wd = dow.nth.weekday;
      var n = dow.nth.n;
      dowMatch = date.getDay() === wd && Math.ceil(date.getDate() / 7) === n;
    } else {
      dowMatch = dow.values.has(date.getDay());
    }

    if (dom.isStar && dow.isStar) return true;
    if (dom.isStar) return dowMatch;
    if (dow.isStar) return domMatch;
    return domMatch || dowMatch;
  }

  /**
   * Check whether a Date matches minute/hour/month/day constraints (no seconds).
   */
  function matchesMinute(date, parsed) {
    if (!parsed.minute.values.has(date.getMinutes())) return false;
    if (!parsed.hour.values.has(date.getHours())) return false;
    if (!parsed.month.values.has(date.getMonth() + 1)) return false;
    return matchesDay(date, parsed);
  }

  /**
   * Full match including seconds.
   */
  function matches(date, parsed) {
    if (parsed.hasSeconds && !parsed.second.values.has(date.getSeconds())) return false;
    return matchesMinute(date, parsed);
  }

  /**
   * Compute the next N run times after fromDate.
   * @param {Object} parsed parsed cron descriptor
   * @param {Date} fromDate reference time
   * @param {number} count number of runs to find
   * @param {number} maxLookaheadMs optional cap (default 5 years)
   * @returns {Date[]}
   */
  function getNextRuns(parsed, fromDate, count, maxLookaheadMs) {
    count = count || 10;
    if (parsed.error) return [];
    if (parsed.isShortcut && parsed.shortcut === '@reboot') return [];

    var runs = [];
    var maxTime = fromDate.getTime() + (maxLookaheadMs || 5 * 365 * 24 * 3600 * 1000);
    var guard = 0;

    if (parsed.hasSeconds) {
      // start at the next second
      var cur = new Date(fromDate.getTime());
      cur.setMilliseconds(0);
      cur.setSeconds(cur.getSeconds() + 1);
      while (runs.length < count && cur.getTime() <= maxTime && guard < 5000000) {
        if (matchesMinute(cur, parsed)) {
          var secs = Array.from(parsed.second.values).sort(function (a, b) { return a - b; });
          for (var s = 0; s < secs.length; s++) {
            var sec = secs[s];
            if (sec < cur.getSeconds()) continue; // skip seconds already passed in this minute
            var run = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate(), cur.getHours(), cur.getMinutes(), sec, 0);
            if (run.getTime() <= fromDate.getTime()) continue;
            runs.push(run);
            if (runs.length >= count) break;
          }
        }
        // advance to the next minute
        cur = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate(), cur.getHours(), cur.getMinutes() + 1, 0, 0);
        guard++;
      }
    } else {
      var cur2 = new Date(fromDate.getTime());
      cur2.setMilliseconds(0);
      cur2.setSeconds(0, 0);
      cur2.setMinutes(cur2.getMinutes() + 1);
      while (runs.length < count && cur2.getTime() <= maxTime && guard < 5000000) {
        if (matchesMinute(cur2, parsed)) {
          runs.push(new Date(cur2.getTime()));
        }
        cur2 = new Date(cur2.getTime() + 60000);
        guard++;
      }
    }

    return runs;
  }

  /**
   * Build a 7x24 weekly heatmap. Returns array of 7 rows (Mon..Sun),
   * each row is an array of 24 booleans indicating whether the cron
   * fires during that hour on that weekday.
   * @param {Object} parsed parsed cron descriptor
   * @param {Date} refDate reference date (used to pick representative weekdays)
   * @returns {boolean[][]}
   */
  function buildWeeklyHeatmap(parsed, refDate) {
    var grid = [];
    if (parsed.error || (parsed.isShortcut && parsed.shortcut === '@reboot')) {
      for (var r = 0; r < 7; r++) {
        grid.push(new Array(24).fill(false));
      }
      return grid;
    }

    var base = refDate || new Date();
    // For each weekday 0..6 (grid rows Mon..Sun), find a representative date in the next 8 days
    for (var w = 0; w < 7; w++) {
      var row = [];
      // grid row w=0 is Monday (JS weekday 1), w=6 is Sunday (JS weekday 0)
      var jsDow = (w + 1) % 7;
      var probe = new Date(base.getFullYear(), base.getMonth(), base.getDate());
      var daysAhead = (jsDow - probe.getDay() + 7) % 7;
      probe.setDate(probe.getDate() + daysAhead);
      for (var h = 0; h < 24; h++) {
        var fires = false;
        for (var m = 0; m < 60; m++) {
          var d = new Date(probe.getFullYear(), probe.getMonth(), probe.getDate(), h, m, 0);
          if (matches(d, parsed)) {
            fires = true;
            break;
          }
        }
        row.push(fires);
      }
      grid.push(row);
    }
    return grid;
  }

  /**
   * Build a monthly calendar matrix for a given month.
   * Returns array of weeks; each week is array of 7 cells (null or Date).
   */
  function buildMonthlyCalendar(parsed, year, month) {
    var first = new Date(year, month - 1, 1);
    var startDow = first.getDay();
    var last = new Date(year, month, 0).getDate();
    var weeks = [];
    var week = new Array(7).fill(null);
    for (var d = 1; d <= last; d++) {
      var cell = new Date(year, month - 1, d);
      var idx = (startDow + d - 1) % 7;
      week[idx] = cell;
      if (idx === 6) {
        weeks.push(week);
        week = new Array(7).fill(null);
      }
    }
    if (week.some(function (c) { return c !== null; })) {
      weeks.push(week);
    }
    return weeks;
  }

  return {
    parseCron: parseCron,
    getNextRuns: getNextRuns,
    matches: matches,
    matchesMinute: matchesMinute,
    matchesDay: matchesDay,
    buildWeeklyHeatmap: buildWeeklyHeatmap,
    buildMonthlyCalendar: buildMonthlyCalendar,
    expandField: expandField,
    SHORTCUTS: SHORTCUTS,
    SHORTCUT_KEYS: SHORTCUT_KEYS,
    MONTHS: MONTHS,
    DAYS: DAYS
  };
});

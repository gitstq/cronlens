/**
 * CronLens — app.js
 * Browser UI logic: live parsing, next runs, weekly heatmap,
 * monthly calendar, presets, i18n, theme, share.
 */
(function () {
  'use strict';

  var Parser = window.CronParser;
  var I18n = window.CronI18n;
  var Presets = window.CronPresets;

  var state = {
    lang: 'en',
    theme: 'dark',
    expr: '0 9 * * 1-5',
    parsed: null,
    calYear: null,
    calMonth: null
  };

  var els = {};

  /* ---------- helpers ---------- */

  function $(sel) {
    return document.querySelector(sel);
  }

  function $$(sel) {
    return Array.prototype.slice.call(document.querySelectorAll(sel));
  }

  function esc(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function t(key) {
    return I18n.t(state.lang, key);
  }

  function pad2(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function fmtDateTime(d) {
    var y = d.getFullYear();
    var mo = pad2(d.getMonth() + 1);
    var da = pad2(d.getDate());
    var h = pad2(d.getHours());
    var mi = pad2(d.getMinutes());
    var s = pad2(d.getSeconds());
    return y + '-' + mo + '-' + da + ' ' + h + ':' + mi + ':' + s;
  }

  function fmtTime(d) {
    return pad2(d.getHours()) + ':' + pad2(d.getMinutes());
  }

  function relTime(d, now) {
    var diff = d.getTime() - now.getTime();
    var mins = Math.round(diff / 60000);
    if (mins < 60) return mins + 'm';
    var hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + 'h ' + (mins % 60) + 'm';
    var days = Math.floor(hrs / 24);
    return days + 'd ' + (hrs % 24) + 'h';
  }

  /* ---------- i18n ---------- */

  function applyLang(lang) {
    state.lang = lang;
    localStorage.setItem('cronlens-lang', lang);
    $$('.lang-switch button').forEach(function (b) {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
    document.documentElement.lang = lang;
    renderAll();
  }

  /* ---------- theme ---------- */

  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cronlens-theme', theme);
    els.themeIcon.innerHTML = theme === 'dark'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
  }

  /* ---------- rendering ---------- */

  function renderAll() {
    renderStaticTexts();
    renderFields();
    renderPresets();
    renderExpression();
  }

  function renderStaticTexts() {
    els.input.placeholder = t('inputPlaceholder');
    els.copyBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>' + esc(t('copy'));
    els.shareBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>' + esc(t('share'));
    els.resetBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>' + esc(t('reset'));
    els.descLabel.textContent = t('description');
    els.nextTitle.textContent = t('nextRuns');
    els.heatTitle.textContent = t('weeklyHeatmap');
    els.calTitle.textContent = t('monthlyCalendar');
    els.presetsLabel.textContent = t('presets');
    els.footerNote.textContent = t('footerNote');
    els.footerNote2.textContent = t('shareHint');
    els.fieldLabels.forEach(function (el, i) {
      var keys = ['second', 'minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'];
      el.textContent = t(keys[i]);
    });
    // calendar weekday headers
    var dows = I18n.UI[state.lang].weekdaysShort;
    els.calDows.forEach(function (el, i) {
      el.textContent = dows[i];
    });
  }

  function renderFields() {
    var parsed = state.parsed;
    var values = ['', '', '', '', '', ''];
    if (parsed && !parsed.error && !parsed.isShortcut) {
      var rawParts = parsed.raw.split(/\s+/);
      if (parsed.hasSeconds) {
        values = rawParts;
      } else {
        // 5-field: [minute, hour, dom, month, dow] -> 6 boxes with empty second
        values = [''].concat(rawParts);
      }
    }
    els.fieldValues.forEach(function (el, i) {
      el.textContent = values[i] || '*';
    });
  }

  function renderPresets() {
    var chips = els.presetChips;
    chips.innerHTML = '';
    Presets.PRESETS.forEach(function (p) {
      var chip = document.createElement('button');
      chip.className = 'preset-chip';
      chip.type = 'button';
      chip.textContent = p.expr + ' · ' + Presets.getLabel(p, state.lang);
      chip.addEventListener('click', function () {
        setExpression(p.expr);
      });
      chips.appendChild(chip);
    });
  }

  /* ---------- expression ---------- */

  function setExpression(expr) {
    els.input.value = expr;
    renderExpression();
    els.input.focus();
  }

  function renderExpression() {
    var expr = els.input.value.trim();
    state.expr = expr;
    var parsed = Parser.parseCron(expr);
    state.parsed = parsed;

    // update URL hash for sharing
    try {
      if (expr) {
        history.replaceState(null, '', '#expr=' + encodeURIComponent(expr));
      } else {
        history.replaceState(null, '', window.location.pathname);
      }
    } catch (e) { /* ignore */ }

    // status
    els.input.classList.remove('ok', 'err');
    els.statusBadge.classList.remove('ok', 'err');
    els.statusLine.innerHTML = '';
    if (!expr) {
      els.statusLine.innerHTML = '<span class="err-text">' + esc(t('errorEmpty')) + '</span>';
      els.input.classList.add('err');
      els.statusBadge.classList.add('err');
    } else if (parsed.error) {
      var msg = t('error' + parsed.error.replace(/(^|_)([a-z])/g, function (m, p1, p2) {
        return p2.toUpperCase();
      })) || parsed.error;
      els.statusLine.innerHTML = '<span class="err-text">' + esc(msg) + '</span>';
      els.input.classList.add('err');
      els.statusBadge.classList.add('err');
    } else {
      els.statusLine.innerHTML = '<span class="ok-text">' + esc(t('parseOk')) + '</span>';
      els.input.classList.add('ok');
      els.statusBadge.classList.add('ok');
    }

    renderFields();
    renderDescription();
    renderNextRuns();
    renderHeatmap();
    renderCalendar();
  }

  function renderDescription() {
    var parsed = state.parsed;
    if (!parsed || parsed.error) {
      els.descText.textContent = '—';
      return;
    }
    els.descText.textContent = I18n.describe(parsed, state.lang);
  }

  function renderNextRuns() {
    var parsed = state.parsed;
    var container = els.nextRuns;
    container.innerHTML = '';

    if (!parsed || parsed.error) {
      container.innerHTML = '<div class="run-row"><span class="run-date" style="color:var(--text-dim)">—</span></div>';
      return;
    }

    if (parsed.isShortcut && parsed.shortcut === '@reboot') {
      container.innerHTML = '<div class="reboot-note">' + esc(t('rebootNote')) + '</div>';
      return;
    }

    var now = new Date();
    var runs = Parser.getNextRuns(parsed, now, 10);
    if (!runs.length) {
      container.innerHTML = '<div class="run-row"><span class="run-date" style="color:var(--text-dim)">—</span></div>';
      return;
    }

    runs.forEach(function (r, i) {
      var row = document.createElement('div');
      row.className = 'run-row';
      row.style.animationDelay = (i * 0.03) + 's';
      var tag = i === 0 ? '<span class="run-tag">next</span>' : '';
      row.innerHTML =
        '<span class="run-date">' + esc(fmtDateTime(r)) + '</span>' +
        '<span class="run-rel">' + esc(relTime(r, now)) + '</span>' +
        tag;
      container.appendChild(row);
    });
  }

  function renderHeatmap() {
    var parsed = state.parsed;
    var grid = Parser.buildWeeklyHeatmap(parsed, new Date());
    var html = '<div class="hm-label"></div>';
    for (var h = 0; h < 24; h++) {
      html += '<div class="hm-hour">' + h + '</div>';
    }
    var dows = I18n.UI[state.lang].weekdaysShort;
    for (var w = 0; w < 7; w++) {
      html += '<div class="hm-label">' + esc(dows[w]) + '</div>';
      for (var h2 = 0; h2 < 24; h2++) {
        var on = grid[w][h2];
        html += '<div class="hm-cell ' + (on ? 'on' : 'off') + '" title="' +
          esc(dows[w]) + ' ' + pad2(h2) + ':00"></div>';
      }
    }
    els.heatmap.innerHTML = html;
  }

  function renderCalendar() {
    var parsed = state.parsed;
    var now = new Date();
    if (!state.calYear || !state.calMonth) {
      state.calYear = now.getFullYear();
      state.calMonth = now.getMonth() + 1;
    }
    var y = state.calYear;
    var m = state.calMonth;
    var monthsShort = I18n.UI[state.lang].monthsShort;
    els.calTitleText.textContent = y + ' ' + (monthsShort[m - 1] || m);

    var weeks = Parser.buildMonthlyCalendar(parsed, y, m);
    var html = '';
    for (var w = 0; w < weeks.length; w++) {
      for (var d = 0; d < 7; d++) {
        var cell = weeks[w][d];
        if (!cell) {
          html += '<div class="cal-day empty"></div>';
          continue;
        }
        var on = false;
        if (parsed && !parsed.error && !(parsed.isShortcut && parsed.shortcut === '@reboot')) {
          on = Parser.matches(cell, parsed);
        }
        var isToday = cell.getFullYear() === now.getFullYear() &&
          cell.getMonth() === now.getMonth() &&
          cell.getDate() === now.getDate();
        html += '<div class="cal-day ' + (on ? 'on' : '') + (isToday ? ' today' : '') + '">' + cell.getDate() + '</div>';
      }
    }
    els.calendar.innerHTML = html;
  }

  /* ---------- events ---------- */

  function bindEvents() {
    els.input.addEventListener('input', function () {
      renderExpression();
    });

    els.input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        els.input.blur();
      }
    });

    els.copyBtn.addEventListener('click', function () {
      var text = state.expr || els.input.value;
      if (!text) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(flashCopied, flashCopied);
      } else {
        els.input.select();
        document.execCommand('copy');
        flashCopied();
      }
    });

    els.shareBtn.addEventListener('click', function () {
      var url = window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          flashShare();
        }, flashShare);
      } else {
        flashShare();
      }
    });

    els.resetBtn.addEventListener('click', function () {
      setExpression('0 9 * * 1-5');
    });

    els.themeBtn.addEventListener('click', function () {
      applyTheme(state.theme === 'dark' ? 'light' : 'dark');
    });

    $$('.lang-switch button').forEach(function (b) {
      b.addEventListener('click', function () {
        applyLang(b.dataset.lang);
      });
    });

    // field breakdown: click focuses corresponding part of the input
    els.fieldBoxes.forEach(function (box, i) {
      box.addEventListener('click', function () {
        var parsed = state.parsed;
        if (!parsed || parsed.error || parsed.isShortcut) return;
        var parts = parsed.raw.split(/\s+/);
        var idx = parsed.hasSeconds ? i : i - 2;
        if (idx < 0 || idx >= parts.length) return;
        var pos = 0;
        for (var k = 0; k < idx; k++) {
          pos += parts[k].length + 1;
        }
        els.input.focus();
        els.input.setSelectionRange(pos, pos + parts[idx].length);
        els.fieldBoxes.forEach(function (b) { b.classList.remove('focused'); });
        box.classList.add('focused');
      });
    });

    els.input.addEventListener('blur', function () {
      els.fieldBoxes.forEach(function (b) { b.classList.remove('focused'); });
    });

    els.calPrev.addEventListener('click', function () {
      state.calMonth--;
      if (state.calMonth < 1) { state.calMonth = 12; state.calYear--; }
      renderCalendar();
    });

    els.calNext.addEventListener('click', function () {
      state.calMonth++;
      if (state.calMonth > 12) { state.calMonth = 1; state.calYear++; }
      renderCalendar();
    });
  }

  function flashCopied() {
    var old = els.copyBtn.innerHTML;
    els.copyBtn.innerHTML = esc(t('copied'));
    setTimeout(function () { els.copyBtn.innerHTML = old; }, 1400);
  }

  function flashShare() {
    var old = els.shareBtn.innerHTML;
    els.shareBtn.innerHTML = esc(t('shareHint'));
    setTimeout(function () { els.shareBtn.innerHTML = old; }, 1400);
  }

  /* ---------- init ---------- */

  function init() {
    els.input = $('#expr-input');
    els.statusBadge = $('#status-badge');
    els.statusLine = $('#status-line');
    els.copyBtn = $('#btn-copy');
    els.shareBtn = $('#btn-share');
    els.resetBtn = $('#btn-reset');
    els.themeBtn = $('#btn-theme');
    els.themeIcon = $('#theme-icon');
    els.descLabel = $('#desc-label');
    els.descText = $('#desc-text');
    els.nextTitle = $('#next-title');
    els.nextRuns = $('#next-runs');
    els.heatTitle = $('#heat-title');
    els.heatmap = $('#heatmap');
    els.calTitle = $('#cal-title');
    els.calTitleText = $('#cal-title-text');
    els.calendar = $('#calendar');
    els.calPrev = $('#cal-prev');
    els.calNext = $('#cal-next');
    els.calDows = $$('.cal-dow');
    els.presetsLabel = $('#presets-label');
    els.presetChips = $('#preset-chips');
    els.footerNote = $('#footer-note');
    els.footerNote2 = $('#footer-note-2');
    els.fieldBoxes = $$('.field-breakdown .field');
    els.fieldLabels = $$('.field-breakdown .field-label');
    els.fieldValues = $$('.field-breakdown .field-value');

    // restore preferences
    var savedLang = localStorage.getItem('cronlens-lang');
    var savedTheme = localStorage.getItem('cronlens-theme');
    state.lang = I18n.SUPPORTED.indexOf(savedLang) !== -1 ? savedLang : 'en';
    state.theme = savedTheme === 'light' ? 'light' : 'dark';

    // read expression from URL hash
    var m = window.location.hash.match(/expr=([^&]+)/);
    if (m) {
      try {
        els.input.value = decodeURIComponent(m[1]);
      } catch (e) { /* ignore */ }
    }

    bindEvents();
    applyTheme(state.theme);
    applyLang(state.lang);
    renderAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

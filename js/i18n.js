/**
 * CronLens — i18n.js
 * Multi-language UI strings + human-readable cron description generator.
 * Languages: en (English), zh-CN (简体中文), zh-TW (繁體中文)
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CronI18n = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var SUPPORTED = ['en', 'zh-CN', 'zh-TW'];

  var UI = {
    'en': {
      appName: 'CronLens',
      tagline: 'Cron expression visualizer & debugger',
      inputPlaceholder: 'e.g. 0 9 * * 1-5  or  @daily',
      parseOk: 'Valid expression',
      parseError: 'Invalid expression',
      errorEmpty: 'Expression is empty',
      errorFieldCount: 'Expected 5 or 6 fields',
      errorUnknownShortcut: 'Unknown shortcut',
      errorOutOfRange: 'Value out of range',
      errorInvalidStep: 'Invalid step value',
      errorInvalidRange: 'Invalid range',
      errorInvalidValue: 'Invalid value',
      errorInvalidNth: 'Invalid # (nth weekday) syntax',
      errorEmptyField: 'Empty field',
      errorEmptyItem: 'Empty list item',
      errorNotString: 'Expression must be a string',
      description: 'Description',
      nextRuns: 'Next run times',
      weeklyHeatmap: 'Weekly schedule',
      monthlyCalendar: 'Monthly calendar',
      presets: 'Presets',
      fields: 'Fields',
      copy: 'Copy',
      copied: 'Copied!',
      share: 'Share',
      shareHint: 'Link is in the address bar',
      theme: 'Toggle theme',
      language: 'Language',
      minute: 'Minute',
      hour: 'Hour',
      dayOfMonth: 'Day of month',
      month: 'Month',
      dayOfWeek: 'Day of week',
      second: 'Second',
      reset: 'Reset',
      rebootNote: '@reboot runs when the daemon starts. No fixed schedule.',
      footerNote: 'Runs fully in your browser. No data leaves your device.',
      weekdaysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      weekdaysFull: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      // description building blocks
      everyMinute: 'Every minute',
      everyMinuteDuring: 'Every minute during hours',
      everyXMinutes: 'Every {n} minutes',
      topOfHour: 'At the top of every hour',
      atMinutePastHour: 'At minute {m} past every hour',
      atTime: 'At {time}',
      everyDay: 'every day',
      everyWeekday: 'every weekday',
      weekdaysRange: 'Monday through Friday',
      everyWeekdayName: 'every {weekday}',
      onDayOfMonth: 'on day {d} of the month',
      inMonth: 'in {month}',
      duringHours: 'during hours {range}',
      lastDayOfMonth: 'on the last day of the month',
      nearestWeekday: 'on the nearest weekday to day {d}',
      nthWeekday: 'on the {ordinal} {weekday} of the month',
      lastWeekdayOfMonth: 'on the last {weekday} of the month',
      ordinals: ['first', 'second', 'third', 'fourth', 'fifth'],
      and: 'and',
      at: 'At'
    },
    'zh-CN': {
      appName: 'CronLens',
      tagline: 'Cron 表达式可视化调试器',
      inputPlaceholder: '例如：0 9 * * 1-5  或  @daily',
      parseOk: '表达式有效',
      parseError: '表达式无效',
      errorEmpty: '表达式为空',
      errorFieldCount: '应为 5 或 6 个字段',
      errorUnknownShortcut: '未知的快捷指令',
      errorOutOfRange: '数值超出范围',
      errorInvalidStep: '步长无效',
      errorInvalidRange: '范围无效',
      errorInvalidValue: '数值无效',
      errorInvalidNth: '#（第 N 个星期几）语法无效',
      errorEmptyField: '字段为空',
      errorEmptyItem: '列表项为空',
      errorNotString: '表达式必须是字符串',
      description: '自然语言描述',
      nextRuns: '接下来运行时间',
      weeklyHeatmap: '每周计划',
      monthlyCalendar: '每月日历',
      presets: '常用预设',
      fields: '字段',
      copy: '复制',
      copied: '已复制！',
      share: '分享',
      shareHint: '链接已写入地址栏',
      theme: '切换主题',
      language: '语言',
      minute: '分钟',
      hour: '小时',
      dayOfMonth: '日',
      month: '月',
      dayOfWeek: '星期',
      second: '秒',
      reset: '重置',
      rebootNote: '@reboot 在守护进程启动时运行，无固定时间表。',
      footerNote: '完全在浏览器本地运行，数据不会离开你的设备。',
      weekdaysShort: ['一', '二', '三', '四', '五', '六', '日'],
      weekdaysFull: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
      monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      everyMinute: '每分钟',
      everyMinuteDuring: '每小时的第 0 分钟',
      everyXMinutes: '每 {n} 分钟',
      topOfHour: '每小时整点',
      atMinutePastHour: '每小时的第 {m} 分钟',
      atTime: '{time}',
      everyDay: '每天',
      everyWeekday: '每个工作日',
      weekdaysRange: '周一至周五',
      everyWeekdayName: '每周{weekday}',
      onDayOfMonth: '每月 {d} 日',
      inMonth: '{month}',
      duringHours: '{range} 时段',
      lastDayOfMonth: '每月最后一天',
      nearestWeekday: '每月最接近 {d} 日的工作日',
      nthWeekday: '每月第{ordinal}{weekday}',
      lastWeekdayOfMonth: '每月最后一个{weekday}',
      ordinals: ['第一个', '第二个', '第三个', '第四个', '第五个'],
      and: '和',
      at: '在'
    },
    'zh-TW': {
      appName: 'CronLens',
      tagline: 'Cron 表達式視覺化除錯器',
      inputPlaceholder: '例如：0 9 * * 1-5  或  @daily',
      parseOk: '表達式有效',
      parseError: '表達式無效',
      errorEmpty: '表達式為空',
      errorFieldCount: '應為 5 或 6 個欄位',
      errorUnknownShortcut: '未知的快捷指令',
      errorOutOfRange: '數值超出範圍',
      errorInvalidStep: '步長無效',
      errorInvalidRange: '範圍無效',
      errorInvalidValue: '數值無效',
      errorInvalidNth: '#（第 N 個星期幾）語法無效',
      errorEmptyField: '欄位為空',
      errorEmptyItem: '清單項目為空',
      errorNotString: '表達式必須是字串',
      description: '自然語言描述',
      nextRuns: '接下來執行時間',
      weeklyHeatmap: '每週計畫',
      monthlyCalendar: '每月月曆',
      presets: '常用預設',
      fields: '欄位',
      copy: '複製',
      copied: '已複製！',
      share: '分享',
      shareHint: '連結已寫入網址列',
      theme: '切換主題',
      language: '語言',
      minute: '分鐘',
      hour: '小時',
      dayOfMonth: '日',
      month: '月',
      dayOfWeek: '星期',
      second: '秒',
      reset: '重設',
      rebootNote: '@reboot 在守護程序啟動時執行，無固定時間表。',
      footerNote: '完全在瀏覽器本機執行，資料不會離開你的裝置。',
      weekdaysShort: ['一', '二', '三', '四', '五', '六', '日'],
      weekdaysFull: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
      monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      everyMinute: '每分鐘',
      everyMinuteDuring: '每小時的第 0 分鐘',
      everyXMinutes: '每 {n} 分鐘',
      topOfHour: '每小時整點',
      atMinutePastHour: '每小時的第 {m} 分鐘',
      atTime: '{time}',
      everyDay: '每天',
      everyWeekday: '每個工作日',
      weekdaysRange: '週一至週五',
      everyWeekdayName: '每週{weekday}',
      onDayOfMonth: '每月 {d} 日',
      inMonth: '{month}',
      duringHours: '{range} 時段',
      lastDayOfMonth: '每月最後一天',
      nearestWeekday: '每月最接近 {d} 日的工作日',
      nthWeekday: '每月第{ordinal}{weekday}',
      lastWeekdayOfMonth: '每月最後一個{weekday}',
      ordinals: ['第一個', '第二個', '第三個', '第四個', '第五個'],
      and: '和',
      at: '在'
    }
  };

  function fill(template, vars) {
    return String(template).replace(/\{(\w+)\}/g, function (m, key) {
      return vars[key] !== undefined ? vars[key] : m;
    });
  }

  /**
   * Format a Set of values into a compact "1,3-5" style string.
   */
  function formatSet(values, isStar) {
    if (isStar) return '*';
    var arr = Array.from(values).sort(function (a, b) { return a - b; });
    var parts = [];
    var i = 0;
    while (i < arr.length) {
      var start = arr[i];
      var end = start;
      while (i + 1 < arr.length && arr[i + 1] === end + 1) {
        end = arr[i + 1];
        i++;
      }
      if (end === start) parts.push(String(start));
      else parts.push(start + '-' + end);
      i++;
    }
    return parts.join(',');
  }

  function firstValue(field) {
    return Array.from(field.values).sort(function (a, b) { return a - b; })[0];
  }

  function isSingle(field) {
    return !field.isStar && field.values.size === 1;
  }

  function detectStep(values, min) {
    var sorted = Array.from(values).sort(function (a, b) { return a - b; });
    if (sorted.length < 2) return 1;
    var diff = sorted[1] - sorted[0];
    if (diff < 1) return 1;
    for (var i = 2; i < sorted.length; i++) {
      if (sorted[i] - sorted[i - 1] !== diff) return 1;
    }
    if ((sorted[0] - min) % diff !== 0) return 1;
    return diff;
  }

  function pad2(n) {
    return n < 10 ? '0' + n : String(n);
  }

  /**
   * Describe the time part (seconds + minute + hour).
   */
  function describeTime(parsed, t) {
    var parts = [];
    var hasSeconds = parsed.hasSeconds;
    var second = parsed.second;
    var minute = parsed.minute;
    var hour = parsed.hour;

    // seconds
    if (hasSeconds && !second.isStar) {
      var secStr = formatSet(second.values, false);
      parts.push(secStr + ' ' + t.second);
    }

    var mStar = minute.isStar;
    var hStar = hour.isStar;
    var mSingle = isSingle(minute);
    var hSingle = isSingle(hour);
    var mStep = !mStar && !mSingle ? detectStep(minute.values, 0) : 1;
    var hStep = !hStar && !hSingle ? detectStep(hour.values, 0) : 1;

    if (mStar && hStar) {
      parts.push(t.everyMinute);
      return parts.join(' ');
    }

    if (mStar && !hStar) {
      // every minute during hours X-Y
      parts.push(t.everyMinute + ' ' + t.duringHours.replace('{range}', hourRangeText(hour, t)));
      return parts.join(' ');
    }

    if (!mStar && hStar) {
      if (mSingle && firstValue(minute) === 0) {
        parts.push(t.topOfHour);
      } else if (mStep > 1) {
        parts.push(fill(t.everyXMinutes, { n: mStep }));
      } else {
        parts.push(fill(t.atMinutePastHour, { m: formatSet(minute.values, false) }));
      }
      return parts.join(' ');
    }

    // both minute and hour specified
    if (mSingle && hSingle) {
      parts.push(fill(t.atTime, { time: pad2(firstValue(hour)) + ':' + pad2(firstValue(minute)) }));
      return parts.join(' ');
    }

    if (mStep > 1) {
      var base = fill(t.everyXMinutes, { n: mStep });
      if (!hStar) {
        base += ' ' + t.duringHours.replace('{range}', hourRangeText(hour, t));
      }
      parts.push(base);
      return parts.join(' ');
    }

    // minute list + hour
    var mDesc = formatSet(minute.values, false);
    if (hSingle) {
      parts.push(fill(t.atTime, { time: pad2(firstValue(hour)) + ':' + mDesc }));
    } else {
      parts.push(fill(t.atMinutePastHour, { m: mDesc }) + ' ' + t.duringHours.replace('{range}', hourRangeText(hour, t)));
    }
    return parts.join(' ');
  }

  function hourRangeText(hour, t) {
    var values = Array.from(hour.values).sort(function (a, b) { return a - b; });
    var step = detectStep(values, 0);
    if (step > 1 && values[0] === 0) {
      return '*/' + step;
    }
    if (values.length === 1) return pad2(values[0]);
    return formatSet(values, false);
  }

  /**
   * Describe the day part (day-of-month / day-of-week).
   */
  function describeDay(parsed, t) {
    var dom = parsed.dom;
    var dow = parsed.dow;
    var lang = currentLang;
    var wdFull = UI[lang].weekdaysFull;

    if (dom.isStar && dow.isStar) {
      return t.everyDay;
    }
    if (dom.isStar && !dow.isStar) {
      return describeDow(dow, t, wdFull);
    }
    if (!dom.isStar && dow.isStar) {
      if (dom.last) return t.lastDayOfMonth;
      if (dom.nearestWeekday) return fill(t.nearestWeekday, { d: formatSet(dom.values, false) });
      return fill(t.onDayOfMonth, { d: formatSet(dom.values, false) });
    }
    // both restricted — OR semantics
    var domDesc;
    if (dom.last) domDesc = t.lastDayOfMonth;
    else if (dom.nearestWeekday) domDesc = fill(t.nearestWeekday, { d: formatSet(dom.values, false) });
    else domDesc = fill(t.onDayOfMonth, { d: formatSet(dom.values, false) });
    return domDesc + ' ' + t.and + ' ' + describeDow(dow, t, wdFull);
  }

  function describeDow(dow, t, wdFull) {
    // cron dow: 0=Sunday..6=Saturday; display array: 0=Monday..6=Sunday
    function disp(v) {
      return wdFull[(v + 6) % 7];
    }
    if (dow.last) {
      var lastWd = dow.lastWeekday !== undefined ? dow.lastWeekday : 6;
      return fill(t.lastWeekdayOfMonth, { weekday: disp(lastWd) });
    }
    if (dow.nth) {
      return fill(t.nthWeekday, {
        ordinal: t.ordinals[dow.nth.n - 1] || (dow.nth.n + 'th'),
        weekday: disp(dow.nth.weekday)
      });
    }
    var values = Array.from(dow.values).sort(function (a, b) { return a - b; });
    if (values.length === 5 && values.join(',') === '1,2,3,4,5') {
      return t.everyWeekday;
    }
    if (values.length === 7) return t.everyDay;
    if (values.length === 1) {
      return fill(t.everyWeekdayName, { weekday: disp(values[0]) });
    }
    // range of weekdays
    var names = values.map(disp);
    return names.join(', ');
  }

  /**
   * Describe the month part.
   */
  function describeMonth(month, t) {
    var lang = currentLang;
    var values = Array.from(month.values).sort(function (a, b) { return a - b; });
    var names = values.map(function (v) { return UI[lang].monthsShort[v - 1]; });
    return fill(t.inMonth, { month: names.join(', ') });
  }

  var currentLang = 'en';

  /**
   * Generate a human-readable description of a parsed cron expression.
   * @param {Object} parsed parsed descriptor
   * @param {string} lang language code
   * @returns {string}
   */
  function describe(parsed, lang) {
    var t = UI[lang] || UI.en;
    currentLang = lang;
    if (!parsed) return '';
    if (parsed.error) return '';
    if (parsed.isShortcut) {
      if (parsed.shortcut === '@reboot') return '@reboot — ' + t.rebootNote;
      return '@' + parsed.shortcut.replace('@', '');
    }

    var parts = [];
    var timeDesc = describeTime(parsed, t);
    if (timeDesc) parts.push(timeDesc);
    var dayDesc = describeDay(parsed, t);
    if (dayDesc && dayDesc !== t.everyDay) parts.push(dayDesc);
    if (!parsed.month.isStar) {
      parts.push(describeMonth(parsed.month, t));
    }
    return parts.join(' ');
  }

  function t(lang, key) {
    var table = UI[lang] || UI.en;
    return table[key] !== undefined ? table[key] : UI.en[key];
  }

  return {
    SUPPORTED: SUPPORTED,
    UI: UI,
    describe: describe,
    formatSet: formatSet,
    t: t
  };
});

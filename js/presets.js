/**
 * CronLens — presets.js
 * A curated library of common cron expressions.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CronPresets = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var PRESETS = [
    { expr: '* * * * *', label: { 'en': 'Every minute', 'zh-CN': '每分钟', 'zh-TW': '每分鐘' } },
    { expr: '*/5 * * * *', label: { 'en': 'Every 5 minutes', 'zh-CN': '每 5 分钟', 'zh-TW': '每 5 分鐘' } },
    { expr: '*/10 * * * *', label: { 'en': 'Every 10 minutes', 'zh-CN': '每 10 分钟', 'zh-TW': '每 10 分鐘' } },
    { expr: '*/15 * * * *', label: { 'en': 'Every 15 minutes', 'zh-CN': '每 15 分钟', 'zh-TW': '每 15 分鐘' } },
    { expr: '*/30 * * * *', label: { 'en': 'Every 30 minutes', 'zh-CN': '每 30 分钟', 'zh-TW': '每 30 分鐘' } },
    { expr: '0 * * * *', label: { 'en': 'Every hour', 'zh-CN': '每小时', 'zh-TW': '每小時' } },
    { expr: '0 */2 * * *', label: { 'en': 'Every 2 hours', 'zh-CN': '每 2 小时', 'zh-TW': '每 2 小時' } },
    { expr: '0 0 * * *', label: { 'en': 'Daily at midnight', 'zh-CN': '每天午夜', 'zh-TW': '每天午夜' } },
    { expr: '0 9 * * *', label: { 'en': 'Daily at 09:00', 'zh-CN': '每天 09:00', 'zh-TW': '每天 09:00' } },
    { expr: '0 9 * * 1-5', label: { 'en': 'Weekdays at 09:00', 'zh-CN': '工作日 09:00', 'zh-TW': '工作日 09:00' } },
    { expr: '0 9 * * 1', label: { 'en': 'Every Monday at 09:00', 'zh-CN': '每周一 09:00', 'zh-TW': '每週一 09:00' } },
    { expr: '0 9 1 * *', label: { 'en': '1st of month at 09:00', 'zh-CN': '每月 1 日 09:00', 'zh-TW': '每月 1 日 09:00' } },
    { expr: '0 9 1 1 *', label: { 'en': 'Jan 1st at 09:00', 'zh-CN': '每年 1 月 1 日 09:00', 'zh-TW': '每年 1 月 1 日 09:00' } },
    { expr: '0 0 L * *', label: { 'en': 'Last day of month at midnight', 'zh-CN': '每月最后一天午夜', 'zh-TW': '每月最後一天午夜' } },
    { expr: '0 9 * * 1-5', label: { 'en': 'Every weekday at 09:00', 'zh-CN': '每个工作日 09:00', 'zh-TW': '每個工作日 09:00' } },
    { expr: '30 8 * * 1-5', label: { 'en': 'Weekdays at 08:30', 'zh-CN': '工作日 08:30', 'zh-TW': '工作日 08:30' } },
    { expr: '0 0 */2 * *', label: { 'en': 'Every 2 days at midnight', 'zh-CN': '每 2 天午夜', 'zh-TW': '每 2 天午夜' } },
    { expr: '0 22 * * 5', label: { 'en': 'Every Friday at 22:00', 'zh-CN': '每周五 22:00', 'zh-TW': '每週五 22:00' } },
    { expr: '0 0 1 */3 *', label: { 'en': 'Quarterly on the 1st', 'zh-CN': '每季度第 1 天', 'zh-TW': '每季第 1 天' } },
    { expr: '0 0 1 1 *', label: { 'en': 'Yearly on Jan 1st', 'zh-CN': '每年 1 月 1 日', 'zh-TW': '每年 1 月 1 日' } },
    { expr: '*/20 8-18 * * *', label: { 'en': 'Every 20 min, 08:00-18:00', 'zh-CN': '08:00-18:00 每 20 分钟', 'zh-TW': '08:00-18:00 每 20 分鐘' } },
    { expr: '0 9,12,15 * * *', label: { 'en': 'At 09:00, 12:00, 15:00', 'zh-CN': '09:00、12:00、15:00', 'zh-TW': '09:00、12:00、15:00' } },
    { expr: '0 0 * * 0', label: { 'en': 'Every Sunday at midnight', 'zh-CN': '每周日午夜', 'zh-TW': '每週日午夜' } },
    { expr: '0 2 * * 7', label: { 'en': 'Every Sunday at 02:00', 'zh-CN': '每周日 02:00', 'zh-TW': '每週日 02:00' } },
    { expr: '0 0 15 * *', label: { 'en': '15th of month at midnight', 'zh-CN': '每月 15 日午夜', 'zh-TW': '每月 15 日午夜' } },
    { expr: '0 0 0 1 1 *', label: { 'en': 'Every second of Jan 1st', 'zh-CN': '1 月 1 日每秒', 'zh-TW': '1 月 1 日每秒' } },
    { expr: '*/30 * * * * *', label: { 'en': 'Every 30 seconds', 'zh-CN': '每 30 秒', 'zh-TW': '每 30 秒' } },
    { expr: '0 0 0 * * *', label: { 'en': 'Every hour on the hour', 'zh-CN': '每小时整点', 'zh-TW': '每小時整點' } },
    { expr: '@reboot', label: { 'en': 'On daemon start (reboot)', 'zh-CN': '守护进程启动时（重启）', 'zh-TW': '守護程序啟動時（重啟）' } },
    { expr: '@daily', label: { 'en': 'Daily (shortcut)', 'zh-CN': '每天（快捷）', 'zh-TW': '每天（快捷）' } },
    { expr: '@weekly', label: { 'en': 'Weekly (shortcut)', 'zh-CN': '每周（快捷）', 'zh-TW': '每週（快捷）' } },
    { expr: '@monthly', label: { 'en': 'Monthly (shortcut)', 'zh-CN': '每月（快捷）', 'zh-TW': '每月（快捷）' } },
    { expr: '@yearly', label: { 'en': 'Yearly (shortcut)', 'zh-CN': '每年（快捷）', 'zh-TW': '每年（快捷）' } }
  ];

  function getLabel(preset, lang) {
    if (preset.label && preset.label[lang]) return preset.label[lang];
    if (preset.label && preset.label['en']) return preset.label['en'];
    return preset.expr;
  }

  return {
    PRESETS: PRESETS,
    getLabel: getLabel
  };
});

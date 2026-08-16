/**
 * CronLens — run-tests.js
 * Zero-dependency test runner for the cron parser & engine.
 * Run with: node tests/run-tests.js
 */
'use strict';

const path = require('path');
const Parser = require(path.join(__dirname, '..', 'js', 'cron-parser.js'));
const I18n = require(path.join(__dirname, '..', 'js', 'i18n.js'));

let passed = 0;
let failed = 0;
const failures = [];

function assert(cond, name, detail) {
  if (cond) {
    passed++;
  } else {
    failed++;
    failures.push({ name, detail });
    console.error('  ✗ ' + name + (detail ? ' — ' + detail : ''));
  }
}

function assertEq(actual, expected, name) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  assert(a === e, name, 'expected ' + e + ' got ' + a);
}

function section(title) {
  console.log('\n' + title);
}

/* ---------------- Parser ---------------- */

section('Parser: field counts');
assert(Parser.parseCron('* * * * *').error === null, '5-field valid');
assert(Parser.parseCron('* * * * * *').error === null, '6-field valid');
assert(Parser.parseCron('* * *').error === 'FIELD_COUNT', '3-field invalid');
assert(Parser.parseCron('* * * * * * *').error === 'FIELD_COUNT', '7-field invalid');
assert(Parser.parseCron('').error === 'EMPTY', 'empty invalid');
assert(Parser.parseCron('   ').error === 'EMPTY', 'whitespace invalid');

section('Parser: shortcuts');
assert(Parser.parseCron('@daily').error === null, '@daily valid');
assert(Parser.parseCron('@hourly').error === null, '@hourly valid');
assert(Parser.parseCron('@yearly').error === null, '@yearly valid');
assert(Parser.parseCron('@reboot').isShortcut === true, '@reboot is shortcut');
assert(Parser.parseCron('@bogus').error === 'UNKNOWN_SHORTCUT', '@bogus invalid');

section('Parser: ranges, steps, lists');
const p1 = Parser.parseCron('*/5 * * * *');
assert(p1.minute.values.has(0) && p1.minute.values.has(5) && p1.minute.values.has(55), '*/5 expands');
assert(!p1.minute.values.has(3), '*/5 excludes 3');

const p2 = Parser.parseCron('0 9-17 * * *');
assert(p2.hour.values.has(9) && p2.hour.values.has(17) && p2.hour.values.has(12), '9-17 range');
assert(!p2.hour.values.has(8) && !p2.hour.values.has(18), '9-17 excludes edges');

const p3 = Parser.parseCron('0 0,12,18 * * *');
assert(p3.hour.values.has(0) && p3.hour.values.has(12) && p3.hour.values.has(18), 'list');
assert(p3.hour.values.size === 3, 'list size 3');

const p4 = Parser.parseCron('0 9 * * MON-FRI');
assert(p4.dow.values.has(1) && p4.dow.values.has(5), 'MON-FRI names');
assert(!p4.dow.values.has(0) && !p4.dow.values.has(6), 'MON-FRI excludes weekend');

const p5 = Parser.parseCron('0 9 * JAN,MAR *');
assert(p5.month.values.has(1) && p5.month.values.has(3), 'month names');
assert(p5.month.values.size === 2, 'month size 2');

section('Parser: special chars');
const p6 = Parser.parseCron('0 0 L * *');
assert(p6.dom.last === true, 'L = last day of month');

const p7 = Parser.parseCron('0 9 * * 5L');
assert(p7.dow.last === true, '5L = last Friday');

const p8 = Parser.parseCron('0 9 15W * *');
assert(p8.dom.nearestWeekday === true, '15W = nearest weekday');

const p9 = Parser.parseCron('0 9 * * 3#2');
assert(p9.dow.nth !== null && p9.dow.nth.weekday === 3 && p9.dow.nth.n === 2, '3#2 = 2nd Tuesday');

const p10 = Parser.parseCron('0 9 * * ?');
assert(p10.dow.isStar === true, '? = *');

section('Parser: errors');
assert(Parser.parseCron('60 * * * *').error === 'INVALID_VALUE', 'minute 60 invalid');
assert(Parser.parseCron('* 24 * * *').error === 'INVALID_VALUE', 'hour 24 invalid');
assert(Parser.parseCron('* * 32 * *').error === 'INVALID_VALUE', 'dom 32 invalid');
assert(Parser.parseCron('* * * 13 *').error === 'INVALID_VALUE', 'month 13 invalid');
assert(Parser.parseCron('* * * * 8').error === 'INVALID_VALUE', 'dow 8 invalid');
assert(Parser.parseCron('*/0 * * * *').error === 'INVALID_STEP', 'step 0 invalid');
assert(Parser.parseCron('* * * * 3#6').error === 'INVALID_NTH', 'nth 6 invalid');

/* ---------------- Matching / next runs ---------------- */

section('Engine: next runs');
function runs(expr, from, n) {
  const parsed = Parser.parseCron(expr);
  return Parser.getNextRuns(parsed, from, n || 5).map(d => d.getTime());
}

const base = new Date(2026, 0, 1, 0, 0, 0); // 2026-01-01 00:00:00

// every minute
let r = runs('* * * * *', base, 3);
assertEq(r, [
  base.getTime() + 60000,
  base.getTime() + 120000,
  base.getTime() + 180000
], 'every minute next 3');

// every 5 minutes
r = runs('*/5 * * * *', base, 3);
assertEq(r, [
  base.getTime() + 300000,
  base.getTime() + 600000,
  base.getTime() + 900000
], 'every 5 minutes');

// daily at 09:00
r = runs('0 9 * * *', base, 2);
const d1 = new Date(2026, 0, 1, 9, 0, 0);
const d2 = new Date(2026, 0, 2, 9, 0, 0);
assertEq(r, [d1.getTime(), d2.getTime()], 'daily 09:00');

// weekdays at 09:00 (2026-01-01 is Thursday)
r = runs('0 9 * * 1-5', base, 2);
const wd1 = new Date(2026, 0, 1, 9, 0, 0);
const wd2 = new Date(2026, 0, 2, 9, 0, 0);
assertEq(r, [wd1.getTime(), wd2.getTime()], 'weekdays 09:00');

// every Monday at 09:00 — next Monday after 2026-01-01 is 2026-01-05
r = runs('0 9 * * 1', base, 1);
const mon1 = new Date(2026, 0, 5, 9, 0, 0);
assertEq(r, [mon1.getTime()], 'every Monday 09:00');

// 1st of month at 09:00 — base is Jan 1 00:00, so next is Jan 1 09:00
r = runs('0 9 1 * *', base, 1);
const dom1 = new Date(2026, 0, 1, 9, 0, 0);
assertEq(r, [dom1.getTime()], '1st of month 09:00');

// Jan 1 at 09:00 — base is Jan 1 00:00, so next is Jan 1 09:00
r = runs('0 9 1 1 *', base, 1);
const y1 = new Date(2026, 0, 1, 9, 0, 0);
assertEq(r, [y1.getTime()], 'yearly Jan 1');

// seconds: every 30 seconds
r = runs('*/30 * * * * *', base, 3);
assertEq(r, [
  base.getTime() + 30000,
  base.getTime() + 60000,
  base.getTime() + 90000
], 'every 30 seconds');

// seconds: at second 5 of every minute
r = runs('5 * * * * *', base, 2);
assertEq(r, [
  base.getTime() + 5000,
  base.getTime() + 65000
], 'at second 5 every minute');

// @reboot has no runs
const rb = Parser.parseCron('@reboot');
assertEq(Parser.getNextRuns(rb, base, 5), [], '@reboot no runs');

// last day of month at midnight: 2026-01-31
r = runs('0 0 L * *', base, 1);
const lastJan = new Date(2026, 0, 31, 0, 0, 0);
assertEq(r, [lastJan.getTime()], 'last day of month');

// OR semantics: dom and dow both restricted
// 0 9 1 * 1 => runs on 1st of month OR Mondays
r = runs('0 9 1 * 1', base, 3);
const or1 = new Date(2026, 0, 1, 9, 0, 0); // Jan 1 (Thursday, also 1st)
const or2 = new Date(2026, 0, 5, 9, 0, 0); // Jan 5 (Monday)
const or3 = new Date(2026, 0, 12, 9, 0, 0); // Jan 12 (Monday)
assertEq(r, [or1.getTime(), or2.getTime(), or3.getTime()], 'OR semantics dom|dow');

/* ---------------- i18n descriptions ---------------- */

section('i18n: descriptions');
function desc(expr, lang) {
  return I18n.describe(Parser.parseCron(expr), lang);
}
assert(desc('* * * * *', 'en').length > 0, 'en every minute');
assert(desc('* * * * *', 'zh-CN').length > 0, 'zh every minute');
assert(desc('0 9 * * 1-5', 'en').length > 0, 'en weekdays');
assert(desc('0 9 * * 1-5', 'zh-CN').length > 0, 'zh weekdays');
assert(desc('0 9 * * 1-5', 'zh-TW').length > 0, 'zh-TW weekdays');
assert(desc('@reboot', 'en').length > 0, 'en reboot');
assert(desc('@daily', 'en').length > 0, 'en daily shortcut');

// natural language quality
assert(desc('0 9 * * 1-5', 'en').indexOf('09:00') !== -1, 'en weekday time HH:MM');
assert(desc('0 9 * * 1-5', 'zh-CN').indexOf('09:00') !== -1, 'zh weekday time HH:MM');
assert(desc('0 9 * * 1-5', 'zh-CN').indexOf('工作日') !== -1, 'zh uses 工作日');
assert(desc('*/5 * * * *', 'en').indexOf('5') !== -1, 'en every 5 min');
assert(desc('*/5 * * * *', 'zh-CN').indexOf('5') !== -1, 'zh every 5 min');
assert(desc('0 * * * *', 'en').indexOf('hour') !== -1, 'en top of hour');
assert(desc('0 * * * *', 'zh-CN').indexOf('整点') !== -1, 'zh top of hour');
assert(desc('0 9 1 * *', 'en').indexOf('day 1') !== -1, 'en day of month');
assert(desc('0 9 1 * *', 'zh-CN').indexOf('1 日') !== -1, 'zh day of month');
assert(desc('0 9 * * 1', 'en').indexOf('Monday') !== -1, 'en every Monday');
assert(desc('0 9 * * 1', 'zh-CN').indexOf('星期一') !== -1, 'zh every Monday');

/* ---------------- Heatmap ---------------- */

section('Engine: weekly heatmap');
const hm = Parser.buildWeeklyHeatmap(Parser.parseCron('0 9 * * 1-5'), new Date(2026, 0, 1));
assert(hm.length === 7, 'heatmap has 7 rows');
assert(hm.every(row => row.length === 24), 'each row has 24 hours');
// weekdays 1-5 (Mon-Fri) should fire at hour 9
assert(hm[0][9] === true, 'Monday 09:00 fires');
assert(hm[4][9] === true, 'Friday 09:00 fires');
assert(hm[5][9] === false, 'Saturday 09:00 does not fire');
assert(hm[6][9] === false, 'Sunday 09:00 does not fire');
assert(hm[0][8] === false, 'Monday 08:00 does not fire');

/* ---------------- Summary ---------------- */

console.log('\n========================================');
console.log('Passed: ' + passed + '   Failed: ' + failed);
console.log('========================================');
if (failed > 0) {
  process.exit(1);
}
process.exit(0);

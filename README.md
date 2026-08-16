<div align="center">

# CronLens

**See your cron at a glance.**

Zero-dependency, offline browser cron expression visualizer & debugger. Type a cron expression and watch it come alive: a human-readable description, the next run times, a weekly heatmap and a monthly calendar. Everything runs in your browser.

[简体中文](./README.zh-CN.md) · [繁體中文](./README.zh-TW.md)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)
![Offline](https://img.shields.io/badge/offline-ready-orange.svg)
![Platform](https://img.shields.io/badge/platform-browser-lightgrey.svg)

</div>

---

## Features

- **Real-time parsing** — 5-field and 6-field (with seconds) cron expressions, plus `@` shortcuts (`@daily`, `@hourly`, `@reboot`, ...).
- **Human-readable description** — auto-generated natural language summary in English, Simplified Chinese and Traditional Chinese.
- **Next run prediction** — the next N run times computed precisely in your local timezone.
- **Weekly heatmap** — a 7×24 grid showing exactly when your job fires across the week.
- **Monthly calendar** — browse any month and see every matching day highlighted.
- **Field breakdown** — each field of the expression is parsed and annotated individually.
- **Preset library** — 30+ curated common cron expressions, one click to load.
- **Share & copy** — copy the expression or share the current view via a URL link.
- **Dark / light themes** — toggle to match your environment.
- **Local-first & private** — 100% client-side, zero network calls, zero data leaves your device.

## Supported Syntax

| Feature | Example | Meaning |
| --- | --- | --- |
| Wildcard | `*` | Every value |
| List | `1,15,30` | Multiple values |
| Range | `9-17` | Range of values |
| Step | `*/5` or `10-40/5` | Every N values |
| Last day | `L` | Last day of month (dom) |
| Last weekday | `5L` | Last Friday of month (dow) |
| Nearest weekday | `15W` | Weekday nearest to the 15th (dom) |
| Nth weekday | `3#2` | Second Tuesday (dow) |
| Names | `JAN-DEC`, `SUN-SAT` | Month / weekday names |
| Shortcuts | `@daily`, `@hourly`, `@reboot` | Common presets |

> Day-of-month / day-of-week follow standard Vixie-cron OR semantics when both are restricted.

## Quick Start

CronLens is a static web app. No build step, no install, no dependencies.

```bash
# Option 1: open index.html directly in any modern browser
open index.html

# Option 2: serve it locally
python3 -m http.server 8080
# then visit http://localhost:8080
```

Or use it right now on GitHub Pages: <https://gitstq.github.io/cronlens/>

## Usage

1. Type a cron expression into the input box (try `0 9 * * 1-5`).
2. Watch the description, next run times, weekly heatmap and monthly calendar update instantly.
3. Click any preset chip to load a common schedule.
4. Use `Copy` to copy the expression, or `Share` to get a link to the current view.
5. Switch language (EN / 简 / 繁) and theme from the header.

## Examples

| Expression | Meaning |
| --- | --- |
| `*/5 * * * *` | Every 5 minutes |
| `0 9 * * 1-5` | Weekdays at 09:00 |
| `0 0 1 * *` | 1st of month at midnight |
| `0 0 L * *` | Last day of month at midnight |
| `0 9 * * 1` | Every Monday at 09:00 |
| `0 22 * * 5` | Every Friday at 22:00 |
| `0 0 1 1 *` | Yearly on Jan 1st |
| `30 8 * * 1-5` | Weekdays at 08:30 |
| `0 9,12,15 * * *` | At 09:00, 12:00 and 15:00 |
| `*/30 * * * * *` | Every 30 seconds (6-field) |

## Project Structure

```
cronlens/
├── index.html            # Single-page entry
├── css/
│   └── style.css         # Styling (dark/light themes, responsive)
├── js/
│   ├── cron-parser.js    # Zero-dependency cron parser & engine
│   ├── i18n.js           # Multi-language descriptions (en/zh-CN/zh-TW)
│   ├── presets.js        # Curated preset library
│   └── app.js            # UI logic & rendering
├── tests/
│   └── run-tests.cjs     # Unit tests (Node, no deps)
└── package.json
```

## Development

```bash
# Run the test suite (Node >= 14, no dependencies)
npm test
```

## License

[MIT](./LICENSE) © gitstq

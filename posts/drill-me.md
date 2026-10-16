---
title: "drill-me: a Claude Code tutor that quizzes you"
date: 2026-09-23
summary: A plugin that turns Claude into a tutor with spaced repetition and a memory of what you got wrong. Version 1.0.1 is out.
image: /images/drill-session.png
imageAlt: "A session: Claude asks before it explains, then checks how confident you are"
links:
  - label: "Release v1.0.1"
    url: "https://github.com/timini/drill-me/releases/tag/v1.0.1"
  - label: "Repository"
    url: "https://github.com/timini/drill-me"
---

Chat assistants usually explain things at length. That is a poor way to learn. drill-me makes Claude do the opposite: it asks before it explains, one question at a time, and remembers what you struggled with across sessions.

```text
/drill:me rust lifetimes
/drill:me this repo's auth flow
/drill:me ~/papers/attention-is-all-you-need.pdf
```

## How it teaches

Each rule comes from learning research:

- **Test, don't tell.** Retrieval practice beats re-reading.
- **Guess first.** Trying to answer before being taught improves retention, even when the guess is wrong.
- **Space reviews.** Cards are scheduled with FSRS, the algorithm Anki uses.
- **Keep it hard enough.** It aims for roughly a 15% error rate.
- **Keep it short.** No more than 150 words at a time.
- **Ask for confidence before revealing the answer.** Errors you were confident about are the easiest to correct.

It can drill you on general topics, on a document or URL, or on your own codebase. For code, it reads the repo first and anchors every question to real file and line references, which helps when onboarding to an unfamiliar service.

Progress is stored as plain Markdown in `~/.drill-me/`, so you can read and edit it. The next session starts with whatever is due, weakest cards first.

## Install

```text
/plugin marketplace add timini/drill-me
/plugin install drill@drill-me
```

Or as standalone skills for Claude Code, Codex, Cursor and other hosts:

```sh
npx skills add timini/drill-me
```

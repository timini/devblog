---
title: "drill-me: a Claude Code tutor that quizzes you"
date: 2026-09-23
kind: "Claude Code plugin"
status: "Released"
summary: Turns Claude into a spaced-repetition tutor that quizzes you before explaining and remembers what you missed across sessions.
image: /images/drill-session.png
imageAlt: "A session: Claude asks before it explains, then checks how confident you are"
links:
  - label: "Release v1.0.1"
    url: "https://github.com/timini/drill-me/releases/tag/v1.0.1"
  - label: "Repository"
    url: "https://github.com/timini/drill-me"
---

Chat assistants default to explaining things at length, which is a forgettable way to learn. `drill-me` flips the script: Claude asks before it explains, one question at a time, and keeps track of what tripped you up across sessions.

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

It can quiz you on a general subject, a local file or URL, or your own repository. On a codebase, it reads the source first and ties every question to concrete file and line references, which makes it handy when getting up to speed on an unfamiliar service.

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

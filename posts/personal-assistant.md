---
title: "Personal Assistant: a toolkit that turns a coding agent into a PA"
date: 2026-11-15
kind: "Agent toolkit"
status: "Released"
summary: Small CLI tools for Notion, Gmail, Calendar, Drive and Garmin, paired with daily-routine skills so Claude Code or Codex can manage tasks, mail and schedule from the terminal.
image: /images/pa-layers.svg
imageAlt: "Skills in Claude Code or Codex call small command-line tools, which talk to Notion, Google and Garmin. Personal context stays in ignored files."
links:
  - label: "Release v0.1.0"
    url: "https://github.com/timini/personal-assistant/releases/tag/v0.1.0"
  - label: "Repository"
    url: "https://github.com/timini/personal-assistant"
---

Coding agents already know how to read command output, chain tools together and stick with a job until it's finished, which is most of what a personal assistant has to do. What they lack is access to where your tasks, inbox and calendar live, plus any memory of yesterday. Personal Assistant supplies both.

## Tools, not servers

Each integration is a plain Python command-line tool in a uv workspace. The agent calls it through the shell like any other command and reads the result:

```text
uv run pa-core checkin
uv run pa-notion tasks list --status "To Do"
uv run pa-google emails --unread --limit 5
uv run pa-google calendar --days 7
uv run pa-health day
```

There are no background MCP daemons to babysit. Each integration is a standalone package with a CLI entry point, so adding a service means dropping another package into the workspace, and every command takes a JSON flag when the agent wants structured data. The exact same commands work under Claude Code and Codex.

## Memory and routines

Every session opens with `pa-core memory brief`. Memory lives in plain text files covering preferences, lessons, people, facts, active projects and open follow-ups; the brief surfaces what's due, what changed recently and what to watch out for. Because it's just files behind a CLI, both agent harnesses share one brain.

On top of the tools sit skills that describe the routines:

- **Daily check-in**: plan the morning, review the evening.
- **Email triage**: take the inbox to empty, first thing every day.
- **Task hygiene**: a weekly clean-up of the Notion task list, finding duplicates and stale items.
- **Research doc**: research a question, save it as a Google Doc and link it from the task.
- **Personal trainer**: keep the training log, synced from a Garmin watch, and plan the next session.
- **Visual report**: turn a plan or a set of options into an HTML and PDF report.

## Public tools, private life

An assistant like this is only useful if it knows plenty about your life, yet the code repository is public. The rule is that every tracked file must read as if it belonged to a stranger: tools, skills and prompts use generic examples, while everything personal (contacts, household notes, tokens and the memory files themselves) lives in gitignored paths (`.env`, `user.yaml`, `user-instructions.md` and `private/`) backed up separately to Google Drive.

That boundary paid off early: initial local commits still had personal details mixed in, so the public repository starts from a scrubbed snapshot.

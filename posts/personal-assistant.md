---
title: "Personal Assistant: a toolkit that turns a coding agent into a PA"
date: 2026-11-15
kind: "Agent toolkit"
status: "Released"
summary: Small command-line tools for Notion, Gmail, Calendar, Drive and Garmin, plus skills for the daily routine, so Claude Code or Codex can run my tasks, inbox and diary from the terminal.
image: /images/pa-layers.svg
imageAlt: "Skills in Claude Code or Codex call small command-line tools, which talk to Notion, Google and Garmin. Personal context stays in ignored files."
links:
  - label: "Release v0.1.0"
    url: "https://github.com/timini/personal-assistant/releases/tag/v0.1.0"
  - label: "Repository"
    url: "https://github.com/timini/personal-assistant"
---

Coding agents are already good at reading output, running commands and keeping at a task until it is done. That is most of what a personal assistant does. What they lack is access to the places my life is kept, and a memory of what happened yesterday. This toolkit gives them both.

## Tools, not servers

Each integration is a plain Python command-line tool in a uv workspace. The agent calls it through the shell like any other command and reads the result:

```text
uv run pa-core checkin
uv run pa-notion tasks list --status "To Do"
uv run pa-google emails --unread --limit 5
uv run pa-google calendar --days 7
uv run pa-health day
```

There are no MCP servers to run or keep connected. A tool is a package with a command, so adding one means dropping in a new package, and every command can print JSON when the agent wants structured output. The same tools work in Claude Code and Codex.

## Memory and routines

Every session starts with `pa-core memory brief`. The memory is a set of plain files holding preferences, lessons, people, facts, projects and open follow-ups, and the brief shows what is due, what was learned and what happened recently. Because it is files and a command, both harnesses share it.

On top of the tools sit skills that describe the routines:

- **Daily check-in**: plan the morning, review the evening.
- **Email triage**: take the inbox to empty, first thing every day.
- **Task hygiene**: a weekly clean-up of the Notion task list, finding duplicates and stale items.
- **Research doc**: research a question, save it as a Google Doc and link it from the task.
- **Personal trainer**: keep the training log, synced from a Garmin watch, and plan the next session.
- **Visual report**: turn a plan or a set of options into an HTML and PDF report.

## Public tools, private life

An assistant like this is only useful if it knows a lot about you, and the repository is public. The rule is that every tracked file must read as if it could be anyone's. Tools, skills and instructions describe general behaviour with made-up examples. Everything personal, from contacts and household rules to credentials and the memory itself, lives in ignored files that are never committed: `.env`, `user.yaml`, `user-instructions.md` and the `private/` folder. Personal files are backed up to Google Drive instead.

The rule paid for itself early. The repository's earlier history had personal details in it, so the public version starts from a clean snapshot.

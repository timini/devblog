---
title: "Harness Retro: a retrospective for Claude Code"
date: 2026-11-03
summary: A Claude Code plugin that reads your past sessions, finds where Claude kept getting it wrong, and proposes changes to CLAUDE.md, memory, hooks and skills so it stops.
image: /images/hr-loop.svg
imageAlt: "Transcripts are mined locally into a short ranked summary. Claude groups the hits into patterns, checks the existing setup, and proposes fixes for you to approve."
links:
  - label: "Repository"
    url: "https://github.com/timini/harness-retro"
---

When Claude Code gets something wrong, I correct it and move on. A week later it makes the same mistake in a new session, because nothing in its setup changed. The correction stayed in one conversation.

Those corrections are not lost, though. Claude Code saves every session as a transcript under `~/.claude/projects`. Each "no, I said...", each interrupted turn and each retry of the same failing command is in there. Harness Retro reads them and turns the repeated ones into changes to the harness: the CLAUDE.md files, memory, hooks, settings and skills that shape what Claude does.

## What it does

A small Python script mines the transcripts for one project. It uses only the standard library, makes no network calls and needs no model. It flags seven kinds of friction:

- you pushing back on an answer
- you interrupting a turn
- a run of failed tool calls
- the same file edited over and over
- an edit that undoes an earlier one
- a command you blocked
- Claude admitting a mistake

For each hit it keeps a short excerpt: what you asked, Claude's last few actions, and how you reacted. It redacts API keys and ranks the hits. The summary stays under about 40 KB, even when the transcripts run to hundreds of megabytes.

Then the skill hands that summary to Claude. Claude throws out the false positives and groups the rest into patterns, each with one root cause. Then it reads your existing setup before proposing anything. If a pattern comes from a rule that already exists and was ignored, writing the rule a second time won't help. The fix has to be something stronger, such as a hook that checks it or a skill step that verifies it.

For each pattern it picks the lightest fix that will work:

- a memory entry for a fact Claude didn't know
- a CLAUDE.md line for a standing rule
- a hook for a rule a script can check
- a skill for a workflow that keeps going wrong

You see the evidence and the exact change, and nothing is written until you approve it.

## What I learned building it

The first run on my own projects picked up the complaints I had already turned into memory entries by hand, such as Claude generating new images instead of using an approved asset library. That was the check I wanted: the script finds what I had to notice for myself. It also found patterns I hadn't written down yet.

It also showed a limit I didn't know about. Most of my history had gone. Claude Code deletes transcripts after 30 days by default, so only a handful of main sessions were left, and most of the disk space was subagent logs. If you want retros over a longer period, raise `cleanupPeriodDays` in your settings now.

Two smaller lessons. A naive filter counts messages from other Claude sessions in an agent team as you correcting Claude, so the script now skips them. And the regexes are deliberately loose. Recall matters more in the script, because Claude does the precision step with the context in front of it.

## Install

In Claude Code:

```text
/plugin marketplace add timini/harness-retro
/plugin install harness-retro@harness-retro
```

Then, in the project you want to review, run `/harness-retro:harness-retro`, or ask "where has Claude been struggling in this repo?".

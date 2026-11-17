---
title: "Harness Retro: a retrospective for Claude Code"
date: 2026-11-03
kind: "Claude Code plugin"
status: "Released"
summary: A Claude Code plugin that mines your session transcripts for repeated friction and proposes targeted fixes to CLAUDE.md, memory, hooks and skills.
image: /images/hr-loop.svg
imageAlt: "Transcripts are mined locally into a short ranked summary. Claude groups the hits into patterns, checks the existing setup, and proposes fixes for you to approve."
links:
  - label: "Release v0.1.0"
    url: "https://github.com/timini/harness-retro/releases/tag/v0.1.0"
  - label: "Repository"
    url: "https://github.com/timini/harness-retro"
---

When Claude Code gets something wrong, I usually correct it in chat and move on. A week later it makes the exact same mistake in a fresh session because nothing in its setup changed.

Those corrections are still on disk, though. Claude Code logs every session under `~/.claude/projects`, complete with every "no, I said...", every interrupted turn and every loop of failing commands. Harness Retro mines those transcripts and turns recurring trouble into concrete changes to your harness: the `CLAUDE.md` rules, memory files, hooks, settings and skills that govern how Claude behaves.

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

The skill then hands that digest to Claude, which drops false positives, groups what remains by root cause, and reads your current configuration before suggesting anything. If a mistake happened despite an existing `CLAUDE.md` rule, repeating the rule in bolder type won't help; it escalates to a deterministic hook or an explicit verification step in a skill.

For each pattern it picks the lightest fix that will work:

- a memory entry for a fact Claude didn't know
- a CLAUDE.md line for a standing rule
- a hook for a rule a script can check
- a skill for a workflow that keeps going wrong

You see the evidence and the exact change, and nothing is written until you approve it.

## What I learned building it

Running it on my own repos immediately surfaced the annoyances I had already written into memory by hand, such as Claude generating placeholder images instead of pulling from an approved asset folder. That confirmed the detector was catching real friction, and it turned up a few habits I hadn't noticed yet.

Building it also exposed a catch: most of my history was already gone. Claude Code purges transcripts after 30 days by default, leaving only recent main sessions alongside a pile of subagent logs. If you want longer retrospectives, raise `cleanupPeriodDays` in your settings early.

Two smaller implementation details mattered. Messages from peer Claude instances in an agent team look a lot like user pushback to a naive parser, so the script filters those out. And the regexes stay deliberately loose: high recall in the Python pass is fine because Claude handles precision with the surrounding turns in front of it.

## Install

In Claude Code:

```text
/plugin marketplace add timini/harness-retro
/plugin install harness-retro@harness-retro
```

Then, in the project you want to review, run `/harness-retro:harness-retro`, or ask "where has Claude been struggling in this repo?".

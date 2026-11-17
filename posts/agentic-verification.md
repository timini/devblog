---
title: "Agentic Verification: checking whether tests would catch a bug"
date: 2026-10-16
kind: "Claude Code plugin"
status: "Released"
summary: A Claude Code plugin that audits a pytest suite for untested behaviour, flaky tests and misleading coverage, with a pre-registered study behind it.
image: /images/av-h1-scatter.png
imageAlt: "Tests that run nearly the same lines (blue, coverage Jaccard 0.9 or more) still often catch different mutants"
links:
  - label: "Release v0.3.0"
    url: "https://github.com/timini/agentic-verification/releases/tag/v0.3.0"
  - label: "Paper (PDF)"
    url: "https://github.com/timini/agentic-verification/blob/main/study/paper/agentic-verification-study.pdf"
  - label: "Repository"
    url: "https://github.com/timini/agentic-verification"
---

As coding agents write more of the code, the test suite has to do more of the checking. Agentic Verification is a Claude Code plugin that audits a Python/pytest suite and reports, with evidence, which behaviour no test would catch if it broke.

## What it does

It runs mutants one at a time in a disposable copy of the project. First it replaces whole function bodies and deletes single call statements, then fills the remaining budget with a seeded sample of classical mutants. An activation check confirms each mutated line actually ran, so mocked-out code isn't misreported as untested.

It also reruns the suite in file order and random order to find order-dependent tests, times the slowest and most setup-heavy tests, and reports per-test coverage. Every finding is labelled as measured, inferred, unverified or not assessed. It never edits, skips or deletes tests.

## Does it hold up?

Before writing the rules into the plugin, I tested six pre-registered hypotheses on eight open-source projects (attrs, click, marshmallow and others; 8,879 tests in total). Four held. One did not: I expected deletion mutants to find untested code more cheaply than classical mutants, but they turned up only 0.38 times as many survivors per CPU-minute. The sixth, on flaky tests, found only two intermittent tests in 480 runs, and both depended on test order.

Two results surprised me. Tests that execute almost the same lines are often not redundant: 35% of those pairs each caught a mutant the other missed. And tests that looked safe to remove individually could not be removed together in any of the 16 files checked.

I then compared an agent using the plugin against the same agent without it. Precision was similar, but the plugin found 71 verified gaps in code the tests already execute, versus 23 without it: the sort of blind spot line coverage can't show. The trade-off is runtime, at a median of 12.6 minutes per run against 5.9.

## Install

In Claude Code:

```text
/plugin marketplace add timini/agentic-verification
/plugin install agentic-verification@agentic-verification
```

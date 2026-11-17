---
title: "ChatEvolve: breeding text instead of prompting for it"
date: 2026-11-15
kind: "Web app"
status: "Prototype"
summary: An interface for evolving text by clicking sentences to keep or cut across three drafts rather than writing revision prompts. The UI is built; the model-calling step isn't wired up yet.
image: /images/ce-workbench.jpg
imageAlt: "The workbench: three variants, with kept sentences in green and cut sentences in red, and the gene pools on the right"
links:
  - label: "Live prototype"
    url: "https://chat-evolve-c0a104.web.app"
  - label: "Repository"
    url: "https://github.com/timini/chat-evolve"
---

Getting a paragraph I like out of a language model usually goes the same way: ask, read one draft, then write instructions about what to change (keep the second sentence, lose the jargon, make the ending less stiff). The model rewrites the whole piece, including the parts that already worked, so I write another prompt.

Describing what you want is slow; recognising it is fast. ChatEvolve is built around that gap. Instead of writing revision notes, you point at what to keep.

## How it's meant to work

The loop borrows from selective breeding:

1. The model writes three versions of the same piece. Each has a role and a temperature: an **anchor** that stays conservative, a **stylist** that changes the voice, and a **mutant** that takes risks.
2. You click sentences to mark them **dominant** (keep) or **purged** (cut). Clicking again cycles through keep, cut and unmarked.
3. You set a **mutation rate**, which controls how far the next round may move away from what you kept.
4. **Breed** writes the next three, built around the kept sentences and avoiding the cut ones.

After a few rounds you should have a version assembled from the best parts of each draft, chosen by selection rather than explanation.

The app is static, with no backend server. You paste an API key for Anthropic, OpenAI, Google or DeepSeek; it's verified against the provider's `/models` endpoint, stored only in the browser, and sent nowhere else.

## What works and what doesn't

I built the interface over two days in May and stopped right before the part that matters. Key verification, the workbench, sentence marking, the gene pools and the mutation slider all work, backed by 108 tests. Right now, though, the three drafts are fixture data (a cover-letter opener for an invented job) and clicking Breed only plays the transition animation without calling a model.

So it's a working shell for an untested hypothesis. The [roadmap](https://github.com/timini/chat-evolve/blob/main/docs/roadmap.md) sets out what remains: real model calls per variant, a prompt box, generation history, and then the actual test, comparing selection against simply telling a model "keep these sentences and rewrite the rest". If selection doesn't beat that on real editing tasks, the rest isn't worth finishing.

## Building it

The codebase is a pnpm monorepo. Components were built and tested in isolation first with Vitest and Storybook interaction tests, then assembled into a Next.js app around a single Zustand store. Terraform provisions the Google Cloud project and Firebase Hosting site, and `just ship` builds and deploys the static export on the free tier.

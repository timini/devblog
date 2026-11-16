---
title: "ChatEvolve: breeding text instead of prompting for it"
date: 2026-11-15
kind: "Web app"
status: "Prototype"
summary: An interface where you pick sentences to keep or cut across three drafts and breed the next round, instead of writing instructions. The interface works; the breeding step does not call a model yet.
image: /images/ce-workbench.jpg
imageAlt: "The workbench: three variants, with kept sentences in green and cut sentences in red, and the gene pools on the right"
links:
  - label: "Live prototype"
    url: "https://chat-evolve-c0a104.web.app"
  - label: "Repository"
    url: "https://github.com/timini/chat-evolve"
---

Getting a paragraph I like out of a language model usually goes the same way. I ask, read one answer, then write an instruction about what to change: keep the second sentence, lose the jargon, make the ending less stiff. The model rewrites the whole thing, including the parts I liked, and I write another instruction.

Describing what I want is the slow part. Recognising it is fast. ChatEvolve is an interface built on that difference. You never write an instruction. You point.

## How it is meant to work

The loop borrows from selective breeding:

1. The model writes three versions of the same piece. Each has a role and a temperature: an **anchor** that stays conservative, a **stylist** that changes the voice, and a **mutant** that takes risks.
2. You click sentences to mark them **dominant** (keep) or **purged** (cut). Clicking again cycles through keep, cut and unmarked.
3. You set a **mutation rate**, which controls how far the next round may move away from what you kept.
4. **Breed** writes the next three, built around the kept sentences and avoiding the cut ones.

After a few rounds you should have a version assembled from the best parts of each draft, chosen by selection rather than explanation.

The app is static and has no server. You paste your own key for Anthropic, OpenAI, Google or DeepSeek. The key is checked against the provider's `/models` endpoint, stored only in the browser, and only ever sent to that provider.

## What works and what does not

I built it over two days in May and stopped before the important part. The setup screen, key verification, the workbench, sentence marking, the gene pools and the mutation slider all work, with 108 tests behind them. The three drafts are sample data, a cover letter opener for a made-up job, and Breed only plays an animation. No model is called and no new generation appears.

So it is a working interface for an idea that has not been tested. The [roadmap](https://github.com/timini/chat-evolve/blob/main/docs/roadmap.md) lists what is needed: a real breeding call per variant, a prompt box, generation history, and then the step that matters most, comparing it with simply asking the model to "keep these sentences and rewrite the rest". If selection does not beat that on real tasks, the idea is not worth finishing.

## Building it

It is a pnpm monorepo. The components were built first in a separate library, tested with Vitest and Storybook interaction tests, and only then assembled into a Next.js app with a single Zustand store. Terraform creates the Google Cloud project and the Firebase Hosting site, and one `just ship` command builds and deploys the static export on the free plan.

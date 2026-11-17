---
title: "Neuromem: long-term memory for AI agents, modelled on sleep"
date: 2026-04-16
kind: "Library"
status: "Working"
summary: A Python library that captures what an agent hears, consolidates it into a concept tree in background "dream" cycles, and lets the agent search it without any extra model calls.
image: /images/neuromem-loop.svg
imageAlt: "Turns are captured as they happen, consolidated in the background, and retrieved without model calls"
links:
  - label: "Repository"
    url: "https://github.com/timini/neuromem"
---

An agent that talks to you for weeks needs to remember that you mentioned your degree in the third conversation. Stuffing the whole history into the prompt stops working quickly, and plain vector search over raw turns finds text that looks similar, not the fact you need.

Neuromem borrows its structure from how the brain is thought to consolidate memory. New experiences are held briefly in the hippocampus and moved into long-term storage in the neocortex during sleep. Memories that are never recalled fade, and recalling one makes it stronger.

## How it works

**Capture.** Each conversation turn is queued as it happens. This is cheap and makes no model calls.

**Dream.** In the background, a consolidation cycle summarises each session, extracts tags and embeddings, and clusters everything with HDBSCAN into a concept tree with a short summary at each junction. Cluster names are generated lazily, only when something needs to display them.

**Prune and strengthen.** Each cycle decays a weight on every memory and archives those that fall below a threshold. Any memory the agent actually retrieves has its weight reset to full, so things that keep coming up survive.

**Retrieve.** The agent gets three tools: `search_memory` to find relevant parts of the tree, `expand_node` to drill into a branch, and `retrieve_memories` to read the original memories. Retrieval makes no model calls at all. A CI gate fails the build if it ever does, or if building the context takes longer than its time limit.

The core package depends only on NumPy, pandas and HDBSCAN, with zero LLM SDK imports. Model integrations live in separate adapter packages for Gemini, OpenAI, Claude and local Gemma via Ollama, and you can mix providers freely (for instance, Claude for synthesis and OpenAI for embeddings). A one-line wrapper plugs straight into Google ADK agents.

## Benchmarks

I evaluate it against [LongMemEval](https://arxiv.org/abs/2410.10813), which tests recall of specific facts buried across long multi-session chats. On an initial 100-question draw with Gemini 3 Flash it scored 0.87 under an LLM judge, though that sample turned out to cover just two of the benchmark's six question categories. Across a stratified run of ten questions per category it scored 0.75: strongest on stated facts and user preferences (0.9 each), weakest on knowledge updates and things the assistant itself had said earlier (0.6 each).

The real value of the benchmark was debugging individual regressions. When a question about the user's degree started failing after a refactor, tracing it stage by stage exposed two separate culprits: the session summariser was dropping passing personal remarks in favour of the main topic, and the relevant tag sat just outside the top-5 retrieval cut-off. Explicitly penalising lost personal facts in the summariser prompt and widening initial tag retrieval to 20 fixed it five runs out of five; neither change worked on its own.

The same round of work cut the time per benchmark instance from about 28 minutes to about 100 seconds, by summarising per session instead of per turn, ingesting sessions in parallel and naming clusters only when needed.

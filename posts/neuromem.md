---
title: "Neuromem: long-term memory for AI agents, modelled on sleep"
date: 2026-04-16
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

The core library depends only on numpy, pandas and HDBSCAN and imports no LLM SDK. Providers are separate packages for Gemini, OpenAI, Claude and local Gemma through Ollama, and you can mix them, for example Claude for answers and OpenAI for embeddings. There is also a one-line wrapper for Google ADK agents.

## Benchmarks

I test it on [LongMemEval](https://arxiv.org/abs/2410.10813), which asks questions about facts buried in long chat histories. On 100 instances with Gemini 3 Flash it scores 0.87, judged by a model. That sample happened to contain only two of the six question types, though. A stratified run with ten of each type scores 0.75. It does best on preferences and facts the user stated, at 0.9 each, and worst on knowledge updates and things the assistant itself said, at 0.6 each.

The most useful benchmark work was finding out why individual questions failed. One question about the user's degree went from passing to failing after a refactor. Tracing it stage by stage showed two separate faults. The session summariser kept the main topic and dropped facts mentioned in passing, so the prompt now says explicitly that losing a personal fact is a failure. The relevant tag also ranked just outside the top 5 search results, so the agent now seeds its search with 20. With both fixes the question passed five times out of five; either fix alone was not enough.

The same round of work cut the time per benchmark instance from about 28 minutes to about 100 seconds, by summarising per session instead of per turn, ingesting sessions in parallel and naming clusters only when needed.

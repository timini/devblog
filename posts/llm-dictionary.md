---
title: "LLM Dictionary: definitions and the paths between words"
date: 2026-10-07
kind: "Web app"
status: "Live"
summary: A dictionary written by a language model, plus a map of how any two words connect, built from 100 sampled association paths and embedding neighbours.
image: /images/ld-graph.jpg
imageAlt: "The connection map from ocean to music: 241 words and 900 connections, with music and ocean as the two large nodes"
links:
  - label: "Live app"
    url: "https://llm-dictionary.tim-5f9.workers.dev"
  - label: "Repository"
    url: "https://github.com/timini/llm-dictionary"
---

LLM Dictionary is a small two-part experiment in how a language model defines words and navigates the space between them.

## Dictionary

Type a word or short phrase and get an entry: senses, pronunciation, examples, origin and related words. Entries are written by a model, so they are interpretations rather than an authoritative dictionary, and the app says so.

## Word connections

The second half is the more interesting one. Give it two words, such as *ocean* and *music*, and it asks the model to step between them one association at a time across 10 separate calls of 10 paths each. Building the graph from 100 sampled walks rather than a single prompt lets recurring bridges stand out where paths overlap.

Every word is then embedded and linked to its three nearest cosine neighbours, rendered as an interactive force-directed graph. *Ocean* to *music* lands at 241 words and 900 edges, bridged through *sound*, *rhythm*, *wave* and *shanty*.

The layout is a force simulation, not a projection of the embeddings. Each edge pulls towards a length set by how similar its two words are, so similar words end up near each other, but positions are not coordinates.

## How it's built

The site runs Next.js on Cloudflare Workers via OpenNext, backed by Gemini for text and embeddings and D1 for storage. Because assembling a full graph takes dozens of model calls, every completed chunk (definitions, path batches, embeddings and the final graph) is persisted immediately: interrupted runs pick up where they left off, and cached pairs load straight from D1.

The API key stays on the server, and uncached requests are rate limited per visitor. Every app file must have 100% test coverage, and a CI gate runs the production build and a smoke test against the live site.

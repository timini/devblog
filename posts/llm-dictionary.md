---
title: "LLM Dictionary: definitions, and the paths between any two words"
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

A small experiment in what a language model knows about words. It has two parts.

## Dictionary

Type a word or short phrase and get an entry: senses, pronunciation, examples, origin and related words. Entries are written by a model, so they are interpretations rather than an authoritative dictionary, and the app says so.

## Word connections

The more interesting part. Give it two words, such as ocean and music, and it asks the model for paths between them, one association at a time. It makes 10 separate calls for 10 paths each, so the map is built from 100 sampled paths rather than one answer. Paths overlap, and the overlaps show which routes the model takes most often.

Every word is then embedded, and each one is linked to its three nearest neighbours by cosine similarity. The result is drawn as a force graph you can zoom, drag and explore. Ocean to music comes out at 241 words and 900 connections, with words like sound, rhythm, wave and shanty in between.

The layout is a force simulation, not a projection of the embeddings. Each edge pulls towards a length set by how similar its two words are, so similar words end up near each other, but positions are not coordinates.

## How it is built

It is a Next.js app on Cloudflare Workers through OpenNext, with Gemini for generation and embeddings and D1 for storage. Generating a full connection map takes many model calls, so each step is saved as soon as it finishes: definitions, every batch of paths, every embedding and the finished graph. An interrupted search resumes where it stopped, and a saved result comes back instantly without calling the model.

The API key stays on the server, and uncached requests are rate limited per visitor. Every app file must have 100% test coverage, and a CI gate runs the production build and a smoke test against the live site.

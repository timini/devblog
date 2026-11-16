---
title: "PaperPath: learning exactly enough to read a landmark paper"
date: 2026-09-27
kind: "Web app"
status: "Live"
summary: Each journey maps the ideas a famous paper depends on, teaches each one only as far as the paper needs, and makes you pass a quiz before moving on. Ten journeys are live and free, from Hubble to AlphaFold.
image: /images/pp-graph.jpg
imageAlt: "The map for Attention Is All You Need: words as vectors and reading in order lead to attention, then to the encoder-decoder stack, then to the paper"
links:
  - label: "Live app"
    url: "https://paperpath-learn.web.app"
  - label: "Repository"
    url: "https://github.com/timini/paperpath"
---

Reading a landmark paper usually fails in the same way. The paper assumes five things you do not know, each of those assumes three more, and a textbook teaches all of them in full when the paper only needs a slice of each. PaperPath works backwards from the paper instead.

## How it works

Each journey is a map of the ideas one paper depends on. For *Attention Is All You Need* the map starts at words as vectors and reading text in order, climbs through scaled dot-product attention, many-headed self-attention and word order, then the encoder-decoder stack, and ends at the paper itself.

Every step is short, teaches the idea only as far as the paper needs it, and has a visual: either an animated step-through diagram or something to play with, such as a payoff matrix for finding a Nash equilibrium. Each step ends with a quiz. Passing it unlocks the steps that build on it, so you cannot reach the paper with a gap in the middle.

![The catalogue: ten landmark papers from 1929 to 2021, each with its field, length and time](/images/pp-home.jpg)

## What is live

Ten journeys, all free and with no account needed:

- Hubble on the expanding universe (1929)
- Turing on computability (1936)
- Shannon on information (1948)
- Nash on equilibria (1950)
- Watson and Crick on DNA (1953)
- Lorenz on chaos (1963)
- Diffie and Hellman on public-key cryptography (1976)
- Backpropagation (1986)
- The Transformer (2017)
- AlphaFold (2021)

Together that is 83 steps and 269 quiz questions. There are 57 animated diagrams and 26 interactives built from a library of 18 widgets. Progress is kept in the browser, and signing in with Google keeps it across devices.

## How it is built

It is a React and TypeScript app on Firebase. Journeys are data, not code: each one follows a schema, and a validator checks the graph, every quiz and every widget's parameters before a build can pass. Numeric quiz answers are recomputed independently in the tests, so a wrong answer key fails the build. Interactives come from a fixed library of components, and a journey can only choose one and pass it parameters.

That design is deliberate. The plan is to generate journeys for any paper with an agent built on the Claude Agent SDK, and generated content needs the same checks a hand-written journey gets.

## What is next

Generating a journey for your own paper is priced at £5. Requests are recorded now, but generation and payments are not built yet. Those are the next two pieces of work.

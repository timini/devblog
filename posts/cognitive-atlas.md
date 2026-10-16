---
title: "Cognitive Atlas: the map inside a language model's distance estimates"
date: 2026-09-09
summary: I asked a model for the distance between every pair of 100 capitals, in three languages, and rebuilt the world map its answers imply.
image: /images/atlas-site.jpg
imageAlt: "The live atlas: capitals placed where the model's distance estimates put them"
links:
  - label: "Explore the atlas"
    url: "https://timini.github.io/cognitive-atlas/"
  - label: "Paper (PDF)"
    url: "https://github.com/timini/cognitive-atlas/blob/main/paper/cognitive-atlas-paper.pdf"
  - label: "Repository"
    url: "https://github.com/timini/cognitive-atlas"
---

If you ask a language model how far apart two cities are, it gives a plausible number. Ask it for every pair among 100 capitals and you can check whether those numbers describe a consistent world. Cognitive Atlas does that and draws the result.

## The study

Gemini 3.5 Flash estimated the distance for every pair of 100 capitals, ten times each, with instructions in English, Arabic and Chinese. That is 148,500 answers.

The individual answers are good. The median estimate for each pair is off by about 216 to 234 km on average, and the ranking of distances is almost perfect (Spearman correlation above 0.998).

The world they describe is not consistent, though. Between 10.7% and 13.3% of city triples break the triangle inequality, meaning the model says A to C is longer than going via B.

## The maps

![Fitted capitals against their real positions for English, Arabic and Chinese instructions](/images/atlas-reconstructed-worlds.png)

Fitting the answers to a sphere puts capitals about 150 to 158 km from their real positions on average. The maps from different instruction languages differ by 81 to 88 km per capital. I expected the model to be more accurate about Arab capitals when asked in Arabic, or about Beijing when asked in Chinese, and found no sign of either.

The atlas lets you explore this directly: warped coastlines, displacement arrows, error layers and a tool for inspecting any pair. The paper sets out the limits, including that it covers one model, one translation per language and one collection period.

---
title: "Ensemble: asking several models and checking where they agree"
date: 2026-03-25
summary: A web app that sends one prompt to models from OpenAI, Anthropic, Google and xAI, measures how much their answers agree, and combines them, plus an experiment on whether ensembles beat the best single model.
image: /images/ens-review.png
imageAlt: "The review step in the design: a combined answer, agreement between models, and each model's response below"
links:
  - label: "Repository"
    url: "https://github.com/timini/ensemble"
---

When an answer matters, I often ask two or three models the same question and compare. Ensemble makes that one step. You pick the models, write one prompt, and get every response side by side with an agreement score and a combined answer. A low agreement score is itself useful: it tells you the question is one where you should not trust any single answer.

## The app

The workflow has four steps: choose a mode and enter API keys, pick the models, write the prompt, review. In Free mode your own keys call OpenAI, Anthropic, Google and xAI directly. Agreement is measured by embedding each response and comparing every pair.

There are several ways to combine the answers, each in its own package:

- **Standard**: one model reads all the responses and writes a single answer.
- **Majority**: a model-assisted majority vote.
- **ELO**: responses are compared in pairs and ranked.
- **Council**: each model critiques every other model's answer, responds to the critiques of its own, then votes on the result.

It is a Next.js monorepo with a component library of 39 components in Storybook, and the design was built and tested from wireframes before any backend work.

## Do ensembles actually help?

I wanted to know whether picking models carefully produces an ensemble that beats the best model in it. The experiment had four phases. I tested 20 models on 20 questions each from three datasets, grouped them by accuracy, measured how often each pair got different questions wrong, then benchmarked five ensembles on 40 questions per dataset with each combining method.

![Accuracy of each combining method for five ensembles on GSM8K and TruthfulQA](/images/ens-strategies.png)

On TruthfulQA every ensemble beat its best member, by 2.5 to 7.5 points. The cross-provider ensemble, one model each from OpenAI, Anthropic, Google and xAI, reached 92.5%, which was every question that at least one member got right.

On GSM8K maths problems every ensemble lost. That was not a lack of signal: at least one member had the right answer on 97.5 to 100% of questions. The combining step threw it away. Asking a model to write one combined answer produced prose that the numeric answer checker could not parse, and accuracy fell to between 7.5% and 20%. Majority voting was the most reliable method, and counting answers in code with no model involved did as well as model-assisted voting on TruthfulQA.

## Caveats

With 40 questions per dataset the confidence intervals are wider than 14 points, so none of these differences are statistically significant. I treat them as directions to test at 200 or more questions, not results. Two findings were consistent enough that I rely on them anyway. Majority voting is at least as good as having a model merge the answers, and it does not fail badly on numeric tasks. And models from different providers make different mistakes, so the right answer is usually somewhere in the ensemble. The hard part is picking it out.

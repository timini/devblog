---
title: "Talk Trainer: learning a talk from the slides, not the script"
date: 2026-11-15
kind: "Web app"
status: "Live"
summary: Voices your speaker notes, then drills you on each slide out loud as the text gradually disappears, with a model judging every attempt.
image: /images/tt-home.jpg
imageAlt: "The product's home page: a slide card with most words reduced to first letters, and the judge's note on what was missed"
links:
  - label: "Live app"
    url: "https://talk-trainer-prod-d8d5.web.app"
  - label: "Prototype repository"
    url: "https://github.com/timini/talk-trainer"
---

I had a 93-slide talk to give at AMP 2026 and a script I didn't know yet. Re-reading speaker notes barely sticks; speaking from memory and getting corrected works far better, so I built an app to listen and score each slide.

## How it works

You upload a PowerPoint with the script in the speaker notes. The app renders each slide, splits the notes into sentences and voices them with a text-to-speech model, so you can hear any part of the talk.

Then you practise, one slide at a time, out loud. Each slide climbs through four cueing stages:

1. **Read**: the whole script is visible and you read it aloud.
2. **Letters**: some words shrink to their first letter and a gap.
3. **Blanks**: every word starts as a first letter, with more blanked out each round.
4. **Slide only**: just the slide, and you give that part of the talk.

A model listens to each attempt and scores it on meaning and, higher up the ladder, on delivery. A good attempt moves the slide up a step; a miss moves it down. Once slides are solid it adds joins (the end of one slide into the start of the next) and run-throughs of whole sections, and schedules reviews for the days before the talk.

## What a week of practice showed

I used the prototype daily for the five days before the conference: 4,218 attempts, 2,561 judged recordings and 23.5 hours of practice. It got me through the talk, and the logs made it painfully clear where the scheduler had wasted time:

- **The first step is the hardest.** Going from reading to first-letter cues is where recall dropped most, so the bottom of the ladder needs small steps.
- **Big jumps fail.** Starting a slide one notch above its previous best passed 80% of the time; jumping any higher dropped pass rates to 25%.
- **The app forgot faster than I did.** It assumed memory faded within about 8 hours. After 4 to 12 hours I was still scoring 0.87 where it predicted 0.46, so it kept making me redo slides I knew.
- **Loops cost the most.** Repeating the same card three or more times in a row cost 83 minutes. A scoring bug in offline mode cost another 436 attempts.
- **Long recordings are fragile.** Cards over a minute often never reached the judge, so long slides need splitting.

Within the week I had also asked for six new settings, each a sign that the app was pushing harder than I wanted. The product replaces them with better defaults and one pace control.

Model calls and hosting for the whole week came to roughly $11 to $27, mostly spent on the judge.

## Turning it into a product

The original prototype ran single-user on Cloudflare Workers. The product is a ground-up rewrite on Google Cloud and Firebase: a scheduling engine retuned on that week's logs, user accounts, Stripe billing and Terraform infrastructure, with a learner simulator checking every scheduler change before deploy.

The plan is a free tier with one short talk, $29 for a single talk and $19 a month for regular speakers, priced from the measured cost of about $0.65 per judged hour.

An early build is live with the engine, judge, billing, data layer and web client in place and over 260 tests passing. Left before launch: the last few failing tests and a custom domain.

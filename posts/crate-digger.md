---
title: "Crate Digger: a queue of new music for DJs"
date: 2026-09-24
kind: "Desktop app"
status: "Working"
summary: A local-first desktop app that finds tracks through Discogs, tracklists and the web, downloads them from Soulseek, analyses the audio and ranks everything by your own ratings.
image: /images/cd-review.png
imageAlt: "The review screen: a track playing, rating keys, why it was suggested and the evidence behind it"
links:
  - label: "Repository"
    url: "https://github.com/timini/crate-digger"
  - label: "Catalogue service"
    url: "https://github.com/timini/crate-digger-service"
---

Digging for records eats hours: combing through a label's back catalogue on Discogs, reading tracklists, searching Soulseek, then previewing stacks of tracks to keep two or three. Crate Digger automates the fetching so your time goes into listening. It keeps a review queue stocked with candidates, and every rating reshapes what comes up next.

## How it works

**Discovery.** You give it seeds: artists, labels, tracks you like. It follows Discogs artist and label relationships, reads tracklists and editorial pages (respecting robots.txt), and accepts text you paste in. A language model can suggest leads, but a suggestion stays unverified until a real source confirms it. Discovery can refresh every six hours.

**Downloads.** Tracks come from Soulseek through a managed copy of [slskd](https://github.com/slskd/slskd). A matching rule, calibrated against re-encodes, remasters, pitched copies, edits and mislabelled files, prefers lossless and then 320 kbps MP3. By default you choose from a ranked list. Unattended downloads only start when every acceptable result agrees on the track length.

**Analysis.** Each file is analysed in a background worker for tempo, key, loudness and a pretrained audio embedding. AcoustID and MusicBrainz identify the track and fill in release, label, year and genre without modifying the file on disk. Audio fingerprints catch duplicates and alternate pressings.

**Review.** One key per rating: thumbs down, one to three stars, skip, undo or keep. Each track shows why it was suggested and the source that backs it up. Keepers go to your archive and playlists, which export as M3U8 or Rekordbox XML.

## Ranking

A candidate's score combines how much you liked its nearest rated neighbours in embedding space with how strong its source evidence is. Liked tracks are grouped into taste clusters so that a smaller style you like does not get crowded out by a bigger one, and every fifth slot in the queue goes to an exploration pick from outside your usual taste. A dislike only suppresses tracks that are closer to it than to anything you liked, so one bad remix does not bury a whole label.

Weights were tuned by grid search against simulated listeners and checked on held-out profiles. On the held-out set, clustering kept a minority taste at roughly half of the top 20, compared with 8% when collapsing all likes into one average vector. Re-ranking 1,000 candidates against 300 ratings takes 0.19 s on an M4. Because those numbers come from synthetic listeners, they'll be re-checked once I have a few hundred real ratings.

## Library map

The Map view places every analysed track by how it sounds, using a UMAP layout of the embeddings and DBSCAN clusters computed on the real distances rather than the 2D picture. You can colour it by playlist, year, genre, label or country, and select tracks from it to build a playlist or seed discovery.

## Local first

Everything runs locally. Language-model calls can stay on the machine via Ollama or LM Studio or go to an API, with credentials stored in the OS keychain. An optional Rust [catalogue service](https://github.com/timini/crate-digger-service) for Cloud Run is built and tested (not yet deployed) to back up ratings and playlists and share track identifications.

The desktop app is Rust and Tauri with a Svelte frontend; signed builds for macOS, Windows and Linux are next.

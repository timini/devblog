---
title: "Crate Digger: a queue of new music for DJs"
date: 2026-09-24
summary: A local-first desktop app that finds tracks through Discogs, tracklists and the web, downloads them from Soulseek, analyses the audio and ranks everything by your own ratings.
image: /images/cd-review.png
imageAlt: "The review screen: a track playing, rating keys, why it was suggested and the evidence behind it"
links:
  - label: "Repository"
    url: "https://github.com/timini/crate-digger"
  - label: "Catalogue service"
    url: "https://github.com/timini/crate-digger-service"
---

Digging for records takes hours: following a label's back catalogue on Discogs, reading tracklists, searching Soulseek, then listening to most of what you find and keeping very little of it. Crate Digger automates the fetching so the time goes on listening. It keeps a review queue full of new tracks, and every rating you give changes what comes next.

## How it works

**Discovery.** You give it seeds: artists, labels, tracks you like. It follows Discogs artist and label relationships, reads tracklists and editorial pages (respecting robots.txt), and accepts text you paste in. A language model can suggest leads, but a suggestion stays unverified until a real source confirms it. Discovery can refresh every six hours.

**Downloads.** Tracks come from Soulseek through a managed copy of [slskd](https://github.com/slskd/slskd). A matching rule, calibrated against re-encodes, remasters, pitched copies, edits and mislabelled files, prefers lossless and then 320 kbps MP3. By default you choose from a ranked list. Unattended downloads only start when every acceptable result agrees on the track length.

**Analysis.** Each file gets tempo, key, loudness and a pretrained music embedding, computed in a separate worker process. Tracks are identified through AcoustID and MusicBrainz, which fills in release, label, year and genre without touching your files. Audio fingerprints catch duplicates and different versions of the same track.

**Review.** One key per rating: thumbs down, one to three stars, skip, undo or keep. Each track shows why it was suggested and the source that backs it up. Keepers go to your archive and playlists, which export as M3U8 or Rekordbox XML.

## Ranking

A candidate's score combines how much you liked its nearest rated neighbours in embedding space with how strong its source evidence is. Liked tracks are grouped into taste clusters so that a smaller style you like does not get crowded out by a bigger one, and every fifth slot in the queue goes to an exploration pick from outside your usual taste. A dislike only suppresses tracks that are closer to it than to anything you liked, so one bad remix does not bury a whole label.

The weights were chosen by grid search on synthetic listeners and checked on held-out ones. There, clustered taste kept the smaller liked style at about half of the top 20, against 8% when using a single average of everything liked. Re-ranking 1,000 candidates against 300 ratings takes 0.19 s on an M4. These numbers come from simulated listeners, so they will be checked again once there are a few hundred real ratings.

## Library map

The Map view places every analysed track by how it sounds, using a UMAP layout of the embeddings and DBSCAN clusters computed on the real distances rather than the 2D picture. You can colour it by playlist, year, genre, label or country, and select tracks from it to build a playlist or seed discovery.

## Local first

Everything runs on your computer. The language model can be local (Ollama or LM Studio) or an API, and logins stay in the operating system's keychain. An optional [catalogue service](https://github.com/timini/crate-digger-service), written in Rust for Cloud Run, would back up ratings and playlists and let people share track identifications and analyses. It is built and tested but not deployed yet.

The app is written in Rust with a Tauri shell and a Svelte interface. Signed release builds for macOS, Windows and Linux are the next step.

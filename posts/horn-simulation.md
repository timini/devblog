---
title: "Horn Simulation: from a frequency band to a horn you can build"
date: 2026-09-10
summary: A pipeline that generates horn loudspeaker geometries, solves them with FEM, couples the results to real drivers and ranks the combinations for a target band.
image: /images/hs-horn-render.png
imageAlt: "The selected horn for the 18Sound 6NMB420, drawn from the design's exported profile"
links:
  - label: "Repository"
    url: "https://github.com/timini/horn-simulation"
  - label: "Design examples"
    url: "https://github.com/timini/horn-simulation/tree/main/examples"
---

Designing a horn loudspeaker usually means choosing a flare profile, guessing at dimensions, simulating, and repeating. I wanted to start from the question I actually have, "which driver and horn should I use for 320 to 5000 Hz in under 300 mm?", and get back a ranked answer with a STEP file.

Horn Simulation does that. You give it a target band and any size limits. It generates candidate geometries, solves the Helmholtz equation for each with finite element analysis, couples the result to drivers from a database using their Thiele-Small parameters, and ranks every driver and horn combination. The output is a self-contained HTML report plus the winning geometry.

## How it works

The search covers seven profile families: conical, exponential, hyperbolic, tractrix, oblate spheroid (OS), Le Cléac'h and constant directivity. Mouth size and length are first derived from the band analytically, which narrows a grid of hundreds of candidates down to a shortlist. Only the shortlist gets full FEM solves, using FEniCSx with a modal radiation boundary at the mouth. A small refinement budget then adjusts the most promising dimensions.

Geometry is built with gmsh and exported as STEP. Frequency bands are solved in parallel in Docker containers orchestrated by Nextflow, and every run writes a manifest of its source, inputs and container hashes so a result can be traced back to exactly what produced it.

## A worked example

The repository includes a finished design for the 8 ohm 18Sound 6NMB420, a 6.5 inch midrange, covering 320 to 5000 Hz with a 300 mm length limit. The search picked an OS horn with a 76 mm throat and a 245 mm mouth. The predicted response varies by 4.4 dB across the band and averages 105.5 dB SPL at 2.83 V and 1 m, without EQ.

![Profile, predicted SPL, electrical impedance and cone excursion for the selected 6NMB420 horn](/images/hs-design-overview.png)

Getting there took two passes. A broad 700-geometry search sent eight finalists to FEM and all of them failed the ripple limit. A narrower search with a smaller throat found the OS family that worked. In total 15 geometries received complete FEM sweeps. Mesh and frequency refinement changed the in-band response by at most 0.24 dB.

## Checking it against a real horn

A simulator that agrees with itself is not much use, so the solver is compared against published measurements. John Post's 1994 thesis measured the acoustic input impedance of a fibreglass exponential horn. I generated the nominal geometry, solved it at three mesh sizes, and compared against the digitised measurement with no fitting or correction. Pass limits were fixed before the run.

![Simulated and measured resistance and reactance for the Post exponential horn](/images/hs-post-validation.png)

The finest mesh is within 0.5 dB and 1.9 degrees of the measurement over the compared range, roughly 200 to 1000 Hz. That validates the horn loading model. It does not validate a complete driver and horn assembly: the driver interface, real adapters and listening-distance predictions still need physical measurements, and the README says so.

## What's next

The same approach is now feeding a larger design: a three-way coaxial horn with a reversed 15 inch driver for the low end, a 6.5 inch mid horn mounted in its mouth, and a tweeter housing at the centre. The mid horn is the output of a simulated study. The cabinet around it is only a layout drawing so far, with corner pieces turning the square throat into an octagon. None of the assembly has been simulated yet.

![Layout concept for the three-way coaxial horn](/images/hs-coaxial-concept.png)

Horns fed by several drivers at once are out of scope here. They live in a sister project, [MEH Design Studio](/meh-design-studio/).

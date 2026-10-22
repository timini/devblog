---
title: "MEH Design Studio: 3D-printable multiple entry horns"
date: 2026-09-15
summary: Tools for designing multiple entry horn speakers from cheap drivers, simulating them with coupled FEM/BEM, and exporting parts sized for a home 3D printer.
image: /images/meh-240-prototype.png
imageAlt: "Rear of the R1 prototype horn: four mid-driver mounts, the throat flange and the seams between printed sections"
links:
  - label: "Repository"
    url: "https://github.com/timini/meh-design-studio"
---

A multiple entry horn (MEH) feeds one horn from several drivers. A compression tweeter sits at the throat, and a ring of small midrange drivers enters through ports in the horn wall further out. If the ports are close enough together the drivers sum into one coherent source, and cheap drivers can do a job that would otherwise need an expensive one. Tom Danley's [unity summation aperture patent](https://patents.google.com/patent/US6411718B1/en) set out the idea, and DIY designs such as JW Sound's [Solana](https://www.jwsound.live/designs/solana-diy) show it working.

The catch is that a MEH is hard to design by hand. Port position, port size, the cavities in front of and behind each driver, and the crossover all interact. MEH Design Studio is an attempt to search that space with simulation, starting from a driver database and a budget, and to output parts you can print.

## The prototype

The first design to come out of it is R1: four 3 inch FaitalPRO 3FE25 mids around a Celestion CDX1-1445 compression driver, aimed at 240 to 3000 Hz. The mouth is 600 mm across and the horn is 450 mm long.

It splits into 29 prints: a core, three bands of eight sectors each, and four rear covers that form sealed chambers behind the mids. The largest part is about 242 mm, so it fits a 250 mm printer. The parts budget comes to £300 per speaker, including about 6 kg of PETG. There are also two small fit-check coupons to print first, to confirm the real drivers line up with the mounting holes before committing to the full horn.

R1 is a candidate to build and measure, not a finished speaker. Its geometry passes every mesh and solid check, but the four-around-one ring layout has not been through coupled acoustic optimisation yet, so there is no predicted response curve to show.

## The pipeline

The design tools are a Python command line. A design brief describes the band, budget and print constraints. A parametric model generates both the acoustic air domain and the printable solids from the same parameters, using CadQuery, so the thing you simulate is the thing you print. Simulation uses JW Sound's [Boundary Lab](https://github.com/JWSound/boundary-lab) for coupled FEM inside the horn and BEM for radiation outside it, with each driver's electrical, mechanical and acoustic behaviour solved together.

A bounded search then varies driver choice, counts, entry positions and horn shape. Profiles can be plain cones or freeform lofts with different horizontal and vertical flare. Finalists are re-checked at three mesh resolutions and at frequencies the search never saw.

![Simulated pressure inside a larger MEH at 1200, 2000 and 3000 Hz](/images/meh-pressure-field.png)

The first full end-to-end run used a small test horn with three made-up drivers. Starting from a baseline with 14.9 dB of ripple between 1000 and 4000 Hz, the search found a 120 mm horn that improved ripple by 3.8 dB at held-out frequencies. The mesh refinement checks passed within 0.05 dB. The winner was exported as STEP, STL and 3MF.

![The exported test horn with its two side-entry chambers](/images/meh-test-horn.png)

## What I've learned so far

Most of the work has been finding out where the simulation can be trusted. Sparse frequency sampling hid a response peak. An early mesh changed the throat area by 6.5%. With real catalogue drivers, no design has yet met the 6 dB response target, and a finer mesh disagreed with an older one about the acoustic field even where the response scores looked similar. Each of these is kept in the repository as a recorded failure rather than quietly fixed and forgotten.

Cheap drivers are the biggest unknown. A catalogue datasheet gives Thiele-Small parameters, but not how a cone behaves at 3 kHz when it is loaded by a small port in a horn wall. That can only come from measurement. The next step is to print R1, measure each driver and the combined horn with a calibrated microphone, and compare the results with a coupled model of the actual geometry before tuning anything.

Single-driver horns are handled by the sister project, [Horn Simulation](/horn-simulation/).

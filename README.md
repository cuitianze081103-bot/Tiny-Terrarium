# Tiny Terrarium

A complete, responsive five-step terrarium builder and deterministic ecology simulation. Plain JavaScript, SVG and CSS; no framework, database, account, API key, install step, or build step.

## Run locally

Install Node.js 18 or newer, then open a terminal in this folder:

```sh
node server.js
```

Open **http://127.0.0.1:4173** in a browser. Stop with Ctrl+C. Use an HTTP server rather than double-clicking index.html because the app uses JavaScript modules. An optional Google Fonts stylesheet supplies Lora and DM Sans; without an internet connection the interface uses Georgia and Arial.

Run the model checks:

```sh
node --test tests/model.test.js
```

Optional DOM journey test (requires a Node version supported by jsdom and npm): run `npm install`, then `npm run test:journey`. This test uses jsdom and simulated timers, with no browser or network access. These development dependencies are not needed to run or host the website.

## Use

1. Select soil and press Add Soil. Next unlocks after soil is added.
2. Select a species, then click or tap one of the three positions inside the jar. Use Tab and Enter/Space for keyboard planting. Occupied positions replace that plant; removal buttons sit under the species choices. At least one plant is required.
3. Toggle either or both creatures, or explicitly Skip for Now.
4. Set initial moisture and light, then Start Observing.
5. Time starts paused. Advance One Day manually or Play automatically (one day every three seconds). Water adds up to 12 moisture points; light remains adjustable.

The seven-day summary opens once, pausing playback. Continue observing keeps the simulation paused until you choose a time control. The summary can be reopened later. Earlier steps preserve all selections, plant health, and day count; changes affect future days. Going back, opening Field notes, starting a new terrarium, and hiding the browser tab pause playback. Restart requires confirmation and clears all state. Reloading also starts fresh; there is no persistent storage.

## Easy-to-edit source

- `dist/index.html`: page shell, accessibility landmarks and dialogs.
- `dist/style.css`: colors, responsive layouts and reduced-motion rules.
- `dist/model.js`: soil/species data and all ecological calculations.
- `dist/art.js`: editable SVG jar, plants, creature and soil drawings.
- `dist/app.js`: five-step UI, playback, care events and journal.
- `server.js`: dependency-free local static server.
- `tests/model.test.js`: deterministic model checks.
- `tests/journey.mjs`: complete setup/care/summary/restart DOM integration test.

## Rules

All percentages range from 0 to 100. A day first subtracts moisture:

`soil evaporation multiplier * (2 + light * 0.055) + plant count * 0.35`

Multipliers: sandy 1.35, regular 1, humus-rich 0.65. Species preferred ranges (moisture / light): moss 50–85 / 15–55; fern 40–75 / 25–65; foliage 30–65 / 40–80.

For each plant, stress equals moisture distance outside its preferred range × 0.17 plus light distance × 0.10. Stressful days reduce health by `min(15, 2 + stress + consecutive stress days * 0.6)`. Comfortable days restore 5 health points. Growth increases 0.035 per comfortable day and decreases 0.012 per stressed day, bounded between 0.6 and 1.45. No randomness is used. Plants at zero health can still recover in this educational model.

Springtails prefer 40–85 moisture; woodlice prefer 35–75. The shared creature condition uses the largest range violation among the selected creatures. Comfortable days restore 4 points; stressful days lose `2 + distance * 0.2`. Decomposers have an educational role but do not alter evaporation.

Condition labels: 75+ Thriving, 50–74 Settling in, 25–49 Stressed, below 25 Struggling. Overall condition averages mean plant health with creature health if creatures are present. Low/Moderate/High means below 35 / 35–70 / above 70; these describe the slider value, not species suitability.

Moisture darkens soil and controls condensation; light changes scene brightness; health changes leaf color, posture and creature speed; growth changes plant size. Care changes water/light immediately, and health is recalculated at the next day. The daily explanation describes the last simulated day. The first-week summary uses recorded days 1–7, with the current plant combination clearly labeled.

This is a simplified ecological simulation, not a real-world care guide.

## Deploy

Upload the contents of `dist/` to any static website host. No server backend is required. `.openai/hosting.json` is optional Sites hosting metadata and is not required for local use.

## Assets

See [ASSETS.md](ASSETS.md) for the complete Chinese material inventory and offline font notes. Browse the 22 standalone SVG exports at http://127.0.0.1:4173/assets/index.html after starting the server. Regenerate them with: node scripts/export-assets.mjs


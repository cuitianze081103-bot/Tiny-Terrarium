# Wordless game verification

The original source snapshot is preserved on `main` and `codex/terrarium-assets` at `1383851bb17a81069c9039cacf10a47b4184d088`.

Validation for the game is recorded in the current change. Model tests check deterministic ecological behavior and game prerequisites. The DOM journey checks every soil, all plant positions and replacement, both creature boxes and removal, watering, light changes, undo, canceling a selection, playback/pause, hidden-tab pause, first-week results, continuing beyond seven days and reset confirmation/cancellation.

The current layout targets desktop browsers: the landscape scene scales as a whole, keeping the jar, plant cabinet, soils, creatures, spray bottle and single-lamp rotary control visible. Real-browser review at 1280 × 720 covers actual dial dragging, keyboard endpoints, undo, the full setup/care journey and written settlement. The play scene has no visible prose; the seven-day result intentionally includes text and actual care metrics. Screen-reader labels and the hidden status remain available.

All 15 model/game tests and the updated DOM journey pass. Continuous light values, invalid-input handling, context-specific settlement advice, keyboard dial control and undo are included. One full mouse drag commits one undo entry. Standalone export includes desktop styling and all graphics/code.

Static SVG exports are snapshots. Animated and state-dependent behavior is verified in the game, not by opening the individual exported SVG files. Keyboard and touch emulation are checked separately where available; no claim is made about every physical device or assistive technology.

The specimen-card/botanical revision adds five cards with model-backed content and six front/back botanical exports. The complete DOM journey verifies all cards, moisture/retention text, all three plants in both drawing passes, replacement, creature selection and the full care/settlement/reset flow. All 66 SVG files are checked for well-formed XML. Real-browser review inspects the leaning cards, direct card selection, interwoven mixed planting, time and settlement.


2026-10-21: Nine independent planting positions span the whole soil bed. Moss forms an overlapping ground carpet. Plant cards for Moss, Fern and Small foliage show the exact moisture and light ranges used by the game. All 16 model tests and the complete DOM journey passed.

# Wordless game verification

The original source snapshot is preserved on `main` and `codex/terrarium-assets` at `1383851bb17a81069c9039cacf10a47b4184d088`.

Validation for the game is recorded in the current change. Model tests check deterministic ecological behavior and game prerequisites. The DOM journey checks every soil, all plant positions and replacement, both creature boxes and removal, watering, light changes, undo, canceling a selection, playback/pause, hidden-tab pause, first-week results, continuing beyond seven days and reset confirmation/cancellation.

The current layout targets desktop browsers: the landscape scene scales as a whole, keeping the jar, plant cabinet, soils, creatures, spray bottle and single-lamp rotary control visible. Real-browser review at 1280 × 720 covers actual dial dragging, keyboard endpoints, undo, the full setup/care journey and written settlement. The play scene has no visible prose; the seven-day result intentionally includes text and actual care metrics. Screen-reader labels and the hidden status remain available.

All 15 model/game tests and the updated DOM journey pass. Continuous light values, invalid-input handling, context-specific settlement advice, keyboard dial control and undo are included. One full mouse drag commits one undo entry. Standalone export includes desktop styling and all graphics/code.

Static SVG exports are snapshots. Animated and state-dependent behavior is verified in the game, not by opening the individual exported SVG files. Keyboard and touch emulation are checked separately where available; no claim is made about every physical device or assistive technology.

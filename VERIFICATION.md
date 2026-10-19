# Wordless game verification

The original source snapshot is preserved on `main` and `codex/terrarium-assets` at `1383851bb17a81069c9039cacf10a47b4184d088`.

Validation for the game is recorded in the current change. Model tests check deterministic ecological behavior and game prerequisites. The DOM journey checks every soil, all plant positions and replacement, both creature boxes and removal, watering, light changes, undo, canceling a selection, playback/pause, hidden-tab pause, first-week results, continuing beyond seven days and reset confirmation/cancellation.

Manual real-browser review covers the desktop workbench and a 390 × 844 mobile viewport. The game uses no visible prose, numbers or tooltip titles. Screen-reader labels and the hidden live status remain available. Offline standalone export includes all graphics and code.

Static SVG exports are snapshots. Animated and state-dependent behavior is verified in the game, not by opening the individual exported SVG files. Keyboard and touch emulation are checked separately where available; no claim is made about every physical device or assistive technology.

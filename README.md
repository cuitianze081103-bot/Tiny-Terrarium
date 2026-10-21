# Tiny Terrarium · Wordless Greenhouse

A desktop greenhouse game with a visual workbench and written seven-day results. The play scene uses minimal text: Next day, Auto play/Pause, and a day/playback status beside the time controls. Semantic names and a hidden status region support screen readers. All graphics and fonts work without external downloads.

## Versions

- `main`: the original text-based website and its 22 exported SVG assets.
- `codex/terrarium-assets`: the same original snapshot.
- `codex/wordless-terrarium-game`: this new game. The original hosted website is unchanged.

## Play locally

Run `node server.js`, then visit `http://127.0.0.1:4173`. Node 22+ is recommended for development tests. The game itself needs only a modern browser.

Or run `node scripts/build-standalone.mjs` and open the generated HTML file directly. It includes all CSS, JavaScript and vector artwork and works offline.

## Interaction design

1. Pick a soil tray (the pointer carries a loaded trowel), then choose the jar. The separate trowel highlights the soil choices.
2. Pick a potted plant from the cabinet. Three glowing positions appear inside the jar. Fill or replace any position.
3. Pick either insect box and place its inhabitants in the jar. Repeat to remove that species. Creatures are optional.
4. Pick the sprayer and choose the jar to add water. Rotate the dial beside it to control the single pendant lamp continuously from 0 to 100. The lamp and light cone update immediately.
5. Use the sun control to advance one day, or the play/pause control for automatic time. Seven seeds fill as days pass. The first seven days end in a visual record; continue to keep caring.

The landscape workbench scales to the desktop browser window as a single scene, keeping every object visible. Mouse controls support click-to-pick/click-to-place and dragging. Drag around the brightness dial, use the mouse wheel over it, or focus it and press arrow keys (1), Page Up/Down (10), Home (0) or End (100). A complete drag is one undo action. Tab through objects, Enter/Space to select/place, Escape to put down a tool and Ctrl/Cmd+Z to undo. Time pauses during light adjustment and when selecting tools, opening a dialog or hiding the tab. Reloading starts a new world.

After seven days, the result page shows the terrarium, seven daily symbols, a written assessment, average plant health, current health/moisture/light, watering count and context-specific care advice. Continue growing returns to the same world.

Plant health, posture, size, condensation, soil darkness and crawling creatures respond to the existing deterministic ecological model. The game is a simplified learning toy.

## Source and materials

- `dist/game.js`: interactions, animations, undo and time.
- `dist/game-model.js`: game actions and prerequisites.
- `dist/model.js`: original deterministic ecological rules.
- `dist/game-art.js`: editable SVG object and scene generators.
- `dist/botanical-art.js`: redrawn moss, curved fern fronds and rounded foliage; independent front/back layers weave across neighboring plants.
- `dist/game.css`: base room, furniture and animations.
- `dist/desktop.css`: desktop composition, rotary control, result page and reduced motion.
- `ASSETS.md`: complete Chinese asset inventory.
- `dist/assets/game/`: 63 standalone SVG exports, a manifest and a gallery, including five leaning specimen cards and six separate botanical layers.

Two cream specimen cards lean against the insect jars: Springtails (moisture 40–85%) and Woodlice (35–75%). Three matching cards lean against the soil bowls, showing their real game retention properties. Hover/focus enlarges a card; selecting a card selects its object. The cards stay legible before their objects unlock. Plants are composed in two passes: all rear branches first, then interwoven foreground foliage; geometry is deterministic and health/growth behavior is preserved.

Regenerate assets with `node scripts/export-game-assets.mjs`. After starting the server, open `/assets/game/index.html` for the gallery. Exports are static snapshots; animation and changing environmental states are generated at runtime.

## Checks

`npm install` installs the optional jsdom development dependency. `npm test` runs ecology and game-action tests; `npm run test:journey` checks the complete DOM journey. Runtime hosting requires no dependencies or build. `npm run export:assets` refreshes the material library.

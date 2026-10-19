# Tiny Terrarium · Wordless Greenhouse

A playable, entirely visual greenhouse workbench. No visible instructions, menus, captions, numbers, font downloads or external assets. Semantic names and a hidden status region support screen readers.

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
4. Pick the sprayer and choose the jar to add water. Choose any of the three overhead lamps for low, medium or bright light.
5. Use the sun control to advance one day, or the play/pause control for automatic time. Seven seeds fill as days pass. The first seven days end in a visual record; continue to keep caring.

Desktop supports click-to-pick/click-to-place and pointer dragging. Touch supports tap-to-pick/tap-to-place; scrolling stays available. Keyboard: Tab through objects, Enter/Space to select/place, Escape to put down a tool, Ctrl/Cmd+Z to undo. The top controls undo an action or start again after a visual confirmation. Time pauses when choosing a tool, changing light, opening a dialog, or hiding the tab. Reloading starts a new world.

Plant health, posture, size, condensation, soil darkness and crawling creatures respond to the existing deterministic ecological model. The game is a simplified learning toy.

## Source and materials

- `dist/game.js`: interactions, animations, undo and time.
- `dist/game-model.js`: game actions and prerequisites.
- `dist/model.js`: original deterministic ecological rules.
- `dist/game-art.js`: editable SVG object and scene generators.
- `dist/game.css`: room, furniture, responsive layout and reduced motion.
- `ASSETS.md`: complete Chinese asset inventory.
- `dist/assets/game/`: 52 standalone SVG exports, a manifest and a gallery.

Regenerate assets with `node scripts/export-game-assets.mjs`. After starting the server, open `/assets/game/index.html` for the gallery. Exports are static snapshots; animation and changing environmental states are generated at runtime.

## Checks

`npm install` installs the optional jsdom development dependency. `npm test` runs ecology and game-action tests; `npm run test:journey` checks the complete DOM journey. Runtime hosting requires no dependencies or build. `npm run export:assets` refreshes the material library.

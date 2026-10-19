# Verification

Passed on October 10, 2026:

- Nine Node model tests: determinism; soil retention ordering; light-driven evaporation; prolonged dryness and recovery; waterlogging and light stress; species-specific ranges; creature stress and recovery; water caps and 200-day bounds; incomplete-world gating.
- A jsdom integration run against the real HTML and application modules completed setup through day seven, continued to day eight, and restarted from a clean state.
- The integration run also covered all soil choices, all three planting slots, replacement/removal, required-step gating, returning to earlier steps without losing selections or days, both creature types, explicit skip, water/light sliders, watering, manual days, automatic playback, pausing, guide-induced pause, focus retention, summary reopening, reset cancellation/confirmation, and automatic pause at day seven.
- JavaScript syntax checks passed.

The DOM test uses simulated timers and dialog methods; it is not a real browser or a visual test. The local server launched, but the browser automation tool denied access under its URL security policy. Desktop/mobile rendering, native keyboard activation, animation appearance, native dialog focus trapping, and reduced-motion rendering were therefore not visually verified. Responsive CSS, native controls, visible focus outlines and reduced-motion rules are implemented.

## Upload verification — October 18, 2026

Restored the published version 1 source (a4a2feb9053060db3bae4a2ad542ef4c399b1506). Syntax checks, all 9 model tests, and the complete DOM journey passed again. The journey used the existing local jsdom installation; no runtime dependencies were added. Exported 22 standalone SVG files and a gallery. SVG XML validation passed. This is a source and asset archive; no website redeployment or new visual-browser verification was performed.


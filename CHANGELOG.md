# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.5.0] - 2026-07-11

### Added

- Dedicated Berries experience: a browse page with real sprite images, infinite scroll, and inline search, plus filter chips for Firmness (Very Soft → Super Hard) and Flavor (Spicy, Dry, Sweet, Bitter, Sour) that swap in PokéAPI's pre-filtered category lists. ([#9](https://github.com/AsphaltShark14/pokedex-app/pull/9))
- Berry detail page showing growth time, max harvest, natural gift power/type, size, smoothness, and soil dryness, with tappable Firmness and Flavor values that jump straight into that filtered category list. ([#9](https://github.com/AsphaltShark14/pokedex-app/pull/9))

## [1.4.0] - 2026-07-11

### Added

- Enhanced home screen: horizontally-scrollable preview rows for Pokémon, Berries, Items, Moves, Locations, Encounters, and Contests, each with a "See all" link into a full paginated (infinite-scroll) browse page. Pokémon, Berries, and Items show real sprite images fetched with zero extra API calls. ([#8](https://github.com/AsphaltShark14/pokedex-app/pull/8))
- Per-category search: each browse page (Pokémon, Items, Locations, etc.) now has its own inline search bar that filters within that category. ([#8](https://github.com/AsphaltShark14/pokedex-app/pull/8))

### Changed

- Removed the home screen's global "Search Pokémon" bar in favor of the new per-category search on each browse page. ([#8](https://github.com/AsphaltShark14/pokedex-app/pull/8))

## [1.3.0] - 2026-07-10

### Added

- Compare Pokémon: toggle up to two Pokémon from their detail pages via a "Compare" button above Base Stats; a floating button appears once at least one is selected, opening a modal with side-by-side image/name/types and animated two-sided stat bars highlighting the higher value per stat. Selections persist across navigation and dismissing the modal; an explicit "Clear comparison" action empties the selection. ([#7](https://github.com/AsphaltShark14/pokedex-app/pull/7))

## [1.2.0] - 2026-07-10

### Added

- Evolution chain section on the Pokémon detail page: circular, type-colored thumbnails connected by arrows, showing the Pokémon's full evolution family (including branching chains like Eevee's eeveelutions and multi-stage branches like Wurmple's) — tap any stage to jump to its own detail page. ([#6](https://github.com/AsphaltShark14/pokedex-app/pull/6))

## [1.1.0] - 2026-07-10

### Added

- Pokédex home screen: fetches and lists the first 20 Pokémon from PokéAPI, styled in the classic red/cream Pokédex look, with tap-to-navigate to a Pokémon's detail page. ([#3](https://github.com/AsphaltShark14/pokedex-app/pull/3))
- Full Pokémon detail page: official artwork, height/weight, abilities, and animated base-stat bars, themed to the Pokémon's own type color. ([#4](https://github.com/AsphaltShark14/pokedex-app/pull/4))
- Pokémon search: a search entry point on the home screen opens a dedicated search page with a debounced, client-side-filtered results grid; each result shows its image and a type-colored border. ([#5](https://github.com/AsphaltShark14/pokedex-app/pull/5))

### Changed

- Converted the codebase to arrow-function components/hooks and `type` aliases instead of `function` declarations and `interface`s. ([#2](https://github.com/AsphaltShark14/pokedex-app/pull/2))
- Rewrote `README.md` to describe this project instead of the generic Expo starter text. ([#4](https://github.com/AsphaltShark14/pokedex-app/pull/4))

### Fixed

- Pokémon detail page: the cream stats sheet stopped short of the screen bottom, showing the hero type-color through a gap. ([#5](https://github.com/AsphaltShark14/pokedex-app/pull/5))

## [1.0.0] - 2026-07-09

### Added

- Initial Expo Router boilerplate: TypeScript, tabs + stack-push + modal navigation.
- Tamagui for styling, wired through `TamaguiProvider` in the root layout.
- Zustand example store (`useThemeStore`) overriding the system color scheme.
- TanStack Query example hook and `QueryClientProvider` wiring.
- ESLint + Prettier, Jest + React Native Testing Library with example tests.
- EAS build/submit config (`eas.json`) and app identifiers in `app.json`. ([#1](https://github.com/AsphaltShark14/pokedex-app/pull/1))

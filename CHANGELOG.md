# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.9.0] - 2026-07-13

### Added

- Global search tab: repurposes the previously-unused "Explore" tab (still the untouched Expo-starter placeholder) into a real cross-category search covering Pokémon, Items, Berries, Locations, Moves, Contests, Encounters, and Games at once, with quick links to every category page before you start typing. ([#13](https://github.com/AsphaltShark14/pokedex-app/pull/13))

### Changed

- Tab bar restyled to match the rest of the app: the active tab's icon and label now tint red like the header, and both tabs use real SF Symbol/Material icons (house, magnifying glass) instead of custom PNG assets. ([#13](https://github.com/AsphaltShark14/pokedex-app/pull/13))
- The Home/Search tab bar now stays visible on every screen — Pokémon detail, category lists, everything — instead of only on the two tab roots; each tab keeps its own independent navigation history. ([#13](https://github.com/AsphaltShark14/pokedex-app/pull/13))
- The floating Compare button now matches the nav bar's frosted-glass material instead of a solid white circle, with a red outline so it stays visible over any background. ([#13](https://github.com/AsphaltShark14/pokedex-app/pull/13))

## [1.8.0] - 2026-07-13

### Added

- Pokémon detail page redesigned as a swipeable, infinite carousel of 6 tabs with dot indicators: About (genus, Pokédex flavor text, color/shape/habitat, Legendary/Mythical/Baby traits, capture rate, growth rate, gender split), Stats (base stats + base experience), Abilities (real effect text per ability, Hidden badge), Moves (grouped by learn method, tap through to its Moves page), Evolution (unchanged, relocated), and Field Data (Held Items and real "Where to Find" locations, tapping through to the Items and Location-Area pages already built). ([#12](https://github.com/AsphaltShark14/pokedex-app/pull/12))
- The Compare toggle moved into the fixed hero header so it stays visible while swiping between tabs. ([#12](https://github.com/AsphaltShark14/pokedex-app/pull/12))

## [1.7.0] - 2026-07-11

### Added

- Locations get full Items/Berries-depth treatment: a browse page with search, infinite scroll, and a Region filter (11 regions); a Location detail page with a tappable Region and a list of Areas; and a new Location-Area detail page showing real, tappable Pokémon encounters as circular artwork. ([#11](https://github.com/AsphaltShark14/pokedex-app/pull/11))
- Moves get a full detail page: type-colored hero, power/PP/accuracy/priority/damage class/target/generation, an effect description, and a "Learned By" row of real Pokémon. ([#11](https://github.com/AsphaltShark14/pokedex-app/pull/11))
- Lightweight browse + detail pages for Contests (with a tappable Berry Flavor cross-link into the Berries list), Encounters, and Games. ([#11](https://github.com/AsphaltShark14/pokedex-app/pull/11))
- "Explore More" section on the home screen: a staggered bubble grid linking to Contests, Encounters, Evolution, Games, Machines, and Moves. Evolution and Machines open a clearly-labeled "coming soon" placeholder, since PokéAPI's list endpoint gives no usable name for either. ([#11](https://github.com/AsphaltShark14/pokedex-app/pull/11))

### Changed

- Home screen reordered to four featured rows — Pokémon, Items, Berries, Locations — followed by the new Explore More section. ([#11](https://github.com/AsphaltShark14/pokedex-app/pull/11))

### Removed

- The generic non-interactive browse page (`/browse/[resource]`) and its config, fully superseded by dedicated pages for every category. ([#11](https://github.com/AsphaltShark14/pokedex-app/pull/11))

## [1.6.0] - 2026-07-11

### Added

- Dedicated Items experience: a browse page with real sprite images, infinite scroll, and inline search, plus a Category (54 options) and Attribute (8 options) filter, each opening a searchable picker sheet since there are too many to fit as inline chips. ([#10](https://github.com/AsphaltShark14/pokedex-app/pull/10))
- Item detail page showing cost, fling power/effect, tappable Category and Attribute values that jump into that filtered list, an effect description, and a "Held By" row of real Pokémon (with artwork) known to carry that item, tapping through to their own detail page. ([#10](https://github.com/AsphaltShark14/pokedex-app/pull/10))

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

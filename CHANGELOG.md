# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial Expo Router boilerplate: TypeScript, tabs + stack-push + modal navigation, Tamagui styling, a Zustand theme-override store, TanStack Query wiring, ESLint + Prettier, Jest + React Native Testing Library, and EAS build config. ([#1](https://github.com/AsphaltShark14/pokedex-app/pull/1))
- Pokédex home screen: fetches and lists the first 20 Pokémon from PokéAPI, styled in the classic red/cream Pokédex look, with tap-to-navigate to a Pokémon's detail page. ([#3](https://github.com/AsphaltShark14/pokedex-app/pull/3))
- Full Pokémon detail page: official artwork, height/weight, abilities, and animated base-stat bars, themed to the Pokémon's own type color. ([#4](https://github.com/AsphaltShark14/pokedex-app/pull/4))
- Pokémon search: a search entry point on the home screen opens a dedicated search page with a debounced, client-side-filtered results grid; each result shows its image and a type-colored border. ([#5](https://github.com/AsphaltShark14/pokedex-app/pull/5))

### Changed

- Converted the codebase to arrow-function components/hooks and `type` aliases instead of `function` declarations and `interface`s. ([#2](https://github.com/AsphaltShark14/pokedex-app/pull/2))
- Rewrote `README.md` to describe this project instead of the generic Expo starter text. ([#4](https://github.com/AsphaltShark14/pokedex-app/pull/4))

### Fixed

- Pokémon detail page: the cream stats sheet stopped short of the screen bottom, showing the hero type-color through a gap. ([#5](https://github.com/AsphaltShark14/pokedex-app/pull/5))

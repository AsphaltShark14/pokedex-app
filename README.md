# Pokédex

A Pokédex app built with Expo Router, fetching live data from [PokéAPI](https://pokeapi.co/). Browse Pokémon, tap into a full detail page with artwork, base stats, and abilities — styled in the classic red-and-cream Pokédex look, with each detail page themed to the Pokémon's own type color.

## Stack

- [Expo](https://expo.dev) + [Expo Router](https://docs.expo.dev/router/introduction/) — file-based navigation (tabs, stack push, modal)
- [Tamagui](https://tamagui.dev) — styling/theming
- [Zustand](https://zustand-demo.pmnd.rs/) — client state (theme override)
- [TanStack Query](https://tanstack.com/query) — data fetching/caching for PokéAPI calls
- [Reanimated](https://docs.swmansion.com/react-native-reanimated/) — screen entrance transitions and animated stat bars
- TypeScript, ESLint + Prettier, Jest + React Native Testing Library

## Features

- **Home** (`src/app/(tabs)/index.tsx`) — fetches and lists the first 20 Pokémon by name and number.
- **Pokémon detail** (`src/app/details/[id].tsx`) — tap a Pokémon to see its official artwork, height/weight, abilities, and base stats as animated bars, with the whole screen themed to the Pokémon's primary type color (`src/constants/pokemon-types.ts`).
- **Explore** tab and a **theme-toggle** modal exist as boilerplate scaffolding for future features.

Pokémon API calls live in `src/api/pokemon.ts` (fetch functions + types) paired with TanStack Query hooks in `src/api/use-pokemon-list.ts` / `use-pokemon-detail.ts` — this is the pattern to follow when adding new API-backed screens.

## Get started

1. Install dependencies (this project is pinned to Yarn via `packageManager` in `package.json`):

   ```bash
   yarn install
   ```

2. Start the app:

   ```bash
   yarn ios      # iOS simulator
   yarn android  # Android emulator
   yarn web      # web
   ```

   Or `yarn start` to just launch Metro and choose a target from there (including [Expo Go](https://expo.dev/go) or a [development build](https://docs.expo.dev/develop/development-builds/introduction/)).

## Scripts

| Command                                           | What it does                                           |
| ------------------------------------------------- | ------------------------------------------------------ |
| `yarn lint`                                       | ESLint (`eslint-config-expo` + Prettier compatibility) |
| `yarn format` / `format:check`                    | Prettier write / check                                 |
| `yarn typecheck`                                  | `tsc --noEmit`                                         |
| `yarn test`                                       | Jest + React Native Testing Library                    |
| `yarn build:dev` / `build:preview` / `build:prod` | EAS builds (requires `eas login`)                      |

## Versioning

`package.json`'s `version` field is the single source of truth for the app version — `app.config.ts` reads it at build/start time and feeds it into the Expo config. `app.json` intentionally has no `version` field of its own, so there's no stale copy to accidentally edit.

To release a new version:

1. Bump the version: `yarn version --patch` (or `--minor` / `--major` / `--new-version <version>`). This updates `package.json` and creates a git tag.
2. Move the relevant entries from `[Unreleased]` into a new dated section in [`CHANGELOG.md`](./CHANGELOG.md).

Native build numbers (`ios.buildNumber` / `android.versionCode`) are handled remotely by EAS (`appVersionSource: "remote"` in `eas.json`), so they don't need manual bumping here.

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Tamagui documentation](https://tamagui.dev/docs/intro/introduction)
- [PokéAPI documentation](https://pokeapi.co/docs/v2)

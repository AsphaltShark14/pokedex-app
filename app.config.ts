import type { ConfigContext, ExpoConfig } from 'expo/config';

import packageJson from './package.json';

export default ({ config }: ConfigContext): ExpoConfig => {
  if (!config.name || !config.slug) {
    throw new Error('app.json is missing required Expo config fields "name" and/or "slug".');
  }

  return {
    ...config,
    name: config.name,
    slug: config.slug,
    version: packageJson.version,
  };
};

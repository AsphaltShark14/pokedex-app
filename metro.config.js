const { getDefaultConfig } = require('expo/metro-config');
const { withTamagui } = require('@tamagui/metro-plugin');
const tamaguiOptions = require('./tamagui.build-options');

const config = getDefaultConfig(__dirname);

module.exports = withTamagui(config, tamaguiOptions);

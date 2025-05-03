// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver = {
  ...config.resolver,
  sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json', 'cjs', 'mjs'],
  assetExts: [...config.resolver.assetExts, 'ttf', 'png', 'jpg', 'jpeg', 'gif', 'webp']
};

module.exports = config;

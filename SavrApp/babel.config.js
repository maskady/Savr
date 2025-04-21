module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@': './app',
            '@components': './app/components',
            '@screens': './app/screens',
            '@utils': './app/utils',
            '@contexts': './app/contexts',
            '@styles': './app/styles',
            '@assets': './assets'
          }
        }
      ],
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          blacklist: null,
          whitelist: ["API_URI", "HOST_URL", "STRIPE_PUBLISHABLE_KEY", "STRIPE_MERCHANT_ID", "STRIPE_URL_SCHEME", "APP_NAME"],
          safe: true,
          allowUndefined: false
        }
      ]
    ]
  };
}; 
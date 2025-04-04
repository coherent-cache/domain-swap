// webpack.config.js
const path = require('path');
const fs = require('fs');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  // Determine which browser we're building for
  const targetBrowser = env.browser || 'firefox';
  const manifestPath = path.join(__dirname, `manifests/${targetBrowser}.json`);
  
  // Ensure the manifest exists
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest for ${targetBrowser} not found at ${manifestPath}`);
  }

  return {
    mode: argv.mode || 'development',
    entry: {
      'background': './src/background.js',
      'popup': './src/popup.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist', targetBrowser),
      filename: '[name].js',
      clean: true
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { 
            from: manifestPath, 
            to: 'manifest.json' 
          },
          { 
            from: './src/popup.html', 
            to: 'popup.html' 
          },
          { 
            from: './src/browser-polyfill.js', 
            to: 'browser-polyfill.js' 
          },
          { 
            from: './src/icons', 
            to: 'icons' 
          },
          { 
            from: './src/rules.json', 
            to: 'rules.json' 
          }
        ],
      }),
    ],
    optimization: {
      minimize: argv.mode === 'production',
    },
  };
};
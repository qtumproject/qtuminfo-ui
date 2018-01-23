const webpack = require('webpack')

module.exports = {
  head: {
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'}
    ]
  },
  css: [
    'bulma/css/bulma.css',
    'font-awesome/css/font-awesome.css'
  ],
  render: {
    bundleRenderer: {
      shouldPreload: (file, type) => ['script', 'style', 'font'].includes(type)
    }
  },
  build: {
    extend(config, {isServer}) {
      config.module.rules.push({
        test: /\.ya?ml$/,
        use: ['json-loader', 'yaml-loader']
      })
      config.plugins.push(new webpack.DefinePlugin({
        'process.env.qtuminfoAPIBase': JSON.stringify(process.env.QTUMINFO_API_BASE
          || process.env[isServer ? 'QTUMINFO_API_BASE_SERVER' : 'QTUMINFO_API_BASE_CLIENT']
          || 'http://localhost:3001/qtuminfo-api/')
      }))
    },
    extractCSS: true,
    postcss: {
      plugins: {
        'postcss-cssnext': {
          features: {
            customProperties: false
          }
        }
      }
    }
  },
  plugins: [
    '~/plugins/components.js',
    '~/plugins/i18n.js',
    '~/plugins/qtum-utils.js'
  ]
};

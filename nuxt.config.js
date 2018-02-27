const webpack = require('webpack')

module.exports = {
  head: {
    titleTemplate: '%s - qtum.info',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no'}
    ]
  },
  css: [
    'bulma/css/bulma.css',
    'font-awesome/css/font-awesome.css',
    '@/styles/common.css',
    '@/styles/card.less',
    '@/styles/info-table.less',
    '@/icons/style.css'
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
          || 'http://localhost:3001/qtuminfo-api/'),
        'process.env.qtuminfoWSBase': JSON.stringify(process.env.QTUMINFO_WS_BASE
          || process.env.QTUMINFO_API_BASE_WS
          || 'ws://localhost:3002/qtuminfo-ws/')
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
    '~/plugins/qtum-utils.js',
    {src: '~/plugins/websocket.js', ssr: false}
  ]
};

import webpack from 'webpack'

export default {
  mode: 'universal',
  head: {
    titleTemplate: '%s - qtum.info',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' }
    ]
  },
  build: {
    extend(config, { isServer }) {
      config.module.rules.push({
        test: /\.ya?ml$/,
        type: 'json',
        use: 'yaml-loader'
      })
      config.plugins.push(new webpack.DefinePlugin({
        'process.env.qtuminfoAPIBase': JSON.stringify(process.env.QTUMINFO_API_BASE
          || process.env[isServer ? 'QTUMINFO_API_BASE_SERVER' : 'QTUMINFO_API_BASE_CLIENT']
          || 'https://qtum.info/api/'),
        'process.env.qtuminfoWSBase': JSON.stringify(process.env.QTUMINFO_WS_BASE
          || process.env.QTUMINFO_API_BASE_WS
          || '//qtum.info/'),
        'process.env.network': JSON.stringify(process.env.QTUM_NETWORK || 'mainnet')
      }))
    },
    extractCSS: true,
    postcss: {
      features: {
        customProperties: false
      }
    }
  },
  modules: [
    '@nuxtjs/style-resources'
  ],
  css: [
    '@fortawesome/fontawesome-free/css/all.css',
    '@/icons/style.css',
    '@/styles/reset.css'
  ],
  styleResources: {
    less: ['./styles/mixins.less', './styles/variables.less']
  },
  render: {
    bundleRenderer: {
      shouldPreload: (file, type) => ['script', 'style', 'font'].includes(type)
    }
  },
  serverMiddleware: ['~/middleware/ip.js'],
  plugins: [
    '~/plugins/components.js',
    '~/plugins/i18n.js',
    '~/plugins/qtum-utils.js',
    { src: '~/plugins/websocket.js', ssr: false }
  ]
}

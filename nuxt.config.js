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
  env: {
    qtumscanAPIBase: process.env.QTUMSCAN_API_BASE || 'http://localhost:3001/qtumscan-api/'
  },
  render: {
    bundleRenderer: {
      shouldPreload: (file, type) => ['script', 'style', 'font'].includes(type)
    }
  },
  build: {
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
  }
};

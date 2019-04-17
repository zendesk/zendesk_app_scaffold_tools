const fs = require('fs')
const path = require('path')

const WebpackMerge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Visualizer = require('webpack-visualizer-plugin')
const TranslationsPlugin = require('./webpack/translations-plugin')

let entries
try {
  entries = require(`${process.cwd()}/entries.js`).entry
} catch (err) {
  console.error('Error!')
  process.exit(1)
}

/**
 * Default shared configs across environments
 */
const commonConfig = {
  entry: entries,

  externals: {
    'ZAFClient': 'ZAFClient'
  },

  output: {
    filename: '[name].js',
    path: `${process.cwd()}/dist/assets`,
  },

  module: {
    rules: [
      {
        type: 'javascript/auto',
        test: /\.json$/,
        include: `${process.cwd()}/src/translations`,
        use: path.resolve(__dirname, './webpack/translations-loader')
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {loader: 'css-loader', options: { url: false }},
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-preset-env')(),
                require('postcss-import')(),
                require('precss')()
              ]
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: { loader: 'raw-loader' }
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(
      [`${process.cwd()}/dist/*`],
      { root: process.cwd(), verbose: false }
    ),

    new CopyWebpackPlugin([
      { from: 'src/manifest.json', to: '../', flatten: true },
      { from: 'src/images/*', to: '.', flatten: true }
    ]),

    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),

    new TranslationsPlugin({
      path: `${process.cwd()}/src/translations`
    })
  ]
}

/**
 * Dev environment specific webpack configs
 */
const devConfig = {
  mode: 'development',
  devtool: 'source-map'
}

/**
 * Prod environment specific webpack configs
 */
const prodConfig = {
  mode: 'production',
  devtool: 'none',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [path.resolve(__dirname, 'node_modules/')],
        use: {
          loader: 'babel-loader',
          options: { "presets": ["@babel/preset-env"] }
        }
      }
    ]
  }
}

/**
 * Stats environment specific webpack configs
 */
const statsConfig = {
  plugins: [
    new Visualizer({
      filename: './statistics.html'
    })
  ]
}

module.exports = function (env = {}) {
  let config = commonConfig

  if (env.dev) {
    config = WebpackMerge(config, devConfig)
  }

  if (env.prod) {
    config = WebpackMerge(config, prodConfig)
  }

  if (env.stats) {
    config = WebpackMerge(config, prodConfig, statsConfig)
  }

  return config
}

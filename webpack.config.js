const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WatchTimePlugin = require('webpack-watch-time-plugin');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');

module.exports = (env, argv) => {
  let config = {
    entry: {
      twig: './src/twig.js',
      style: './src/scss.js',
      script: './src/js/script.js',
    },
    output: {
      filename: '[name].js',
      chunkFilename: '[name].js?ver=[chunkhash]',
      /*publicPath: '/clientes/ddb/pietran/wordpress/wp-content/themes/pietran/dist/',*/
      publicPath: 'http://localhost/proyectos/ddb/pietran/wp-content/themes/pietran/dist/'
    },
    resolve: {
      extensions: ['*', '.js'],
    },
    mode: 'development',
    performance: {
      hints: false,
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.twig$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                context: 'src',
                name: '[path][name].[ext]',
              },
            },
            { loader: 'extract-loader' },
            {
              loader: 'html-loader',
              options: {
                minimize: false,
                interpolate: true,
                attrs: ['img:src', 'link:href'],
              },
            },
          ],
        },
        {
          test: /\.js$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/env'],
              },
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|tiff|webp|gif|ico|woff|woff2|eot|ttf|otf|mp4|webm|wav|mp3|m4a|aac|oga)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                context: 'src',
                name: '[path][name].[ext]?ver=[md5:hash:8]',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new WatchTimePlugin(),
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
      })
    ],
  };

  if (argv.mode !== 'production') {
    config.module.rules.push({
      test: /\.s?css$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: [autoprefixer({})],
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            precision: 10,
          },
        },
      ],
    });
  }

  if (argv.mode === 'production') {
    config.module.rules.push({
      test: /\.s?css$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
            minimize: true
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: function () { 
              return [
                require('autoprefixer'),
                //require('cssnano'),
                require('@fullhuman/postcss-purgecss')({
                  content:[ '**/*.twig' ],
                  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
                  whitelist: [
                    'check-effect',
                    'active-animation',
                    'product-animation',
                    'show',
                    'header-scroll',
                    'deco-show',
                    'show-nav',
                    'initial',
                    'owl-carousel',
                    'owl-themes',
                    'owl-loaded',
                    'owl-drag',
                    'owl-stage-outer',
                    'owl-stage',
                    'owl-item',
                    'owl-nav',
                    'owl-prev',
                    'owl-next',
                    'owl-dots',
                    'owl-dot',
                    'toshow',
                    'color',
                    'open-btn',
                    'open-header',
                    'fixed',
                    'open',
                    'expand',
                    'current',
                    'current_page_item',
                    'current_page_parent',
                    'current-menu-item',
                    'center',
                    'page-link',
                    'page-number',
                    'page-numbers',
                    'scroll-none',
                    'highlighted-cat-nav',
                    'acti',
                    'open-search',
                    'wp-caption',
                    'wp-caption-text',
                    'wp-block-embed',
                    'single-content',
                    'wp-block-embed-youtube',
                    'aligncenter',
                    'alignright',
                    'iframe',
                    'download-event',
                    'show-nav',
                    'video',
                    'leaflet-popup-content-wrapper',
                    'leaflet-popup-tip',
                    'leaflet-container',
                    'leaflet-popup-close-button',
                    'a',
                    'marker',
                    'hour',
                    'phone',
                    'h3',
                    'small',
                    'mCSB_scrollTools',
                    'mCSB_draggerRail',
                    'mCSB_dragger',
                    'mCSB_dragger_bar',
                    'move',
                    'open-nav',
                    'fa-minus',
                    'fa-plus',
                    'active',
                    'search-error',
                    'close-transform',
                    'row',
                    'col-md-4',
                    'lnr',
                    'lnr-chevron-left',
                    'lnr-chevron-right',
                    'show-menu',
                    'center-content',
                    'min',
                    'pause',
                    'play',
                    'mapsvg', 
                    'mapsvg-popover', 
                    'nano', 
                    'nano-content', 
                    'slider-image-home',
                    'nano-pane', 
                    'svg', 
                    'left-box-organigrama',
                    'title-logo',
                    'box-mini',
                    'plus',
                    'circle',
                    'text-slider-home',
                    'slider-image-home',
                    'parent-mobile',
                    'recipes-mobile',
                    'row-nav',
                    'h3',
                    'fixed-brands',
                    'general',
                    'polygon',
                    'path',
                    'g',
                    'breadcrumb_last',
                    'open-filter',
                    'current-menu-item',
                    'current_page_item',
                    'last',
                    'alert-danger',
                    'alert-success',
                    'wp-block-column',
                    'wp-block-columns',
                    'img-col',
                    'column-custom',
                    'wp-block-image',
                    'disabled-link',
                    'current-menu-ancestor',
                    'hr',
                    'copy-href-to-clipboard',
                    'small',
                    'big',
                    'span',
                    'br',
                    'text-position-1',
                    'text-position-2',
                    'text-position-3',
                    'text-position-4',
                    'header-position-1',
                    'header-position-2',
                    'header-position-3',
                    'header-position-4',
                    'rmp-icon--full-highlight',
                    'rmp-results-widget__avg-rating',
                    'rmp-results-widget__vote-count',
                    'rmp-icon--ratings',
                    'rmp-icon--half-highlight',
                    'rmp-widgets-container',
                    'rmp-wp-plugin',
                    'rmp-main-container',
                    'rmp-rating-widget__results',
                    'active-calculator',
                    'slider-handle',
                    'slider',
                    'slider-horizontal',
                    'slider-track-high',
                    'slider-selection',
                    'slider-track-low',
                    'bs-tooltip-top',
                    'bs-tooltip-bottom',
                    'arrow',
                    'tooltip',
                    'tooltip-inner',
                    'eapps-link',
                    'flotante1',
                    'flotante2',
                    'flotante3',
                    'flotante4',
                    'hojita1',
                    'hojita2',
                    'hojita3',
                    't1',
                    't2',
                    't3',
                    'circular-chart',
                    'circle-bg',
                    'circle',
                    'progress',
                    'orange',
                    'pink',
                    'green',
                    'blue',
                    'active-calculator',
                    'hoja1',
                    'hoja2',
                    'hoja3',
                    'f1',
                    'f2',
                    'f3',
                    'f4',
                    'error-1',
                    'error-2',
                    'error-3'
                  ]
                }),
              ];
            },
            minimize: true,
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            precision: 10,
          },
        },
      ],
    });

    config.module.rules.push({
      test: /\.svg$/,
      enforce: 'pre',
      use: [
        {
          loader: 'svgo-loader',
          options: {
            precision: 2,
            plugins: [
              {
                removeViewBox: false,
              },
            ],
          },
        },
      ],
    });
  }

  return config;
};

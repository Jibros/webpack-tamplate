const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const fileURLToPath = require('url')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const autoprefixer = require('autoprefixer')

// html page enrty 경로
const pagesDir = path.resolve(__dirname, 'src/pages/')
// js 파일 enrty 경로
const jsDir = path.resolve(__dirname, 'src/assets/js/')

// HtmlWebpackPlugin 인스턴스 동적 생성
const htmlPlugins = fs
  .readdirSync(pagesDir)
  .filter((file) => file.endsWith('.html')) // HTML 파일만 필터링
  .map((file) => {
    const name = file.replace('.html', '') // 파일명에서 확장자 제거
    return new HtmlWebpackPlugin({
      // 문서 타이틀
      title: 'DANUSYS-유지보수 운영관리 시스템',
      // 문서 메타
      meta: {
        'X-UA-Compatible': {
          'http-equiv': 'X-UA-Compatible',
          content: 'IE=edge',
        },
        // 'theme-color': '#4285f4',
      },
      template: path.join(pagesDir, file),
      filename: `pages/${name}.html`,
      chunks: `[${name}]`, // 해당 HTML 에 연결할 JS
      inject: 'head',
      minify: {
        collapseWhitespace: false, // 줄 바꿈 유지
      },
      hash: false,
    })
  })

const mainEntries = {
  main: ['./src/index.js', './src/assets/scss/main.scss'],
}

// 페이지 엔트리 파일 동적 생성
const pageEntries = fs
  .readdirSync(jsDir)
  .filter((file) => file.endsWith('.js')) // JS 파일만 필터링
  .reduce((entries, file) => {
    const name = file.replace('.js', '') // 파일명에서 확장자 제거
    entries[name] = `./src/assets/js/${file}` // 엔트리 추가
    return entries
  }, {})

const entries = { ...mainEntries, ...pageEntries }

module.exports = {
  // entry: ['./src/js/index.js', './src/scss/main.scss'],
  entry: entries,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'assets/js/[name].js',
    assetModuleFilename: 'assets/js/[name].[ext]', // 하위 폴더 구조 유지
    clean: true,
  },
  stats: {
    all: true,
    warnings: false,
    errors: true,
  },
  ignoreWarnings: [
    {
      module: /node_modules\/bootstrap/,
    },
  ],
  module: {
    rules: [
      {
        test: /\.(s?css)$/,
        use: [
          {
            // CSS to the DOM by injecting a <style>tag</style>
            loader: MiniCssExtractPlugin.loader,
          },
          {
            // Interprets @import and url() like import/require() and will resolve them
            loader: 'css-loader',
            options: { import: true },
          },
          {
            // Loader for webpack to process CSS with PostCSS
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [autoprefixer],
              },
            },
          },
          {
            // Loads a SASS/SCSS file and compiles it to CSS
            loader: 'sass-loader',
            options: {
              sassOptions: {
                outputStyle: 'expanded',
                includePaths: [
                  path.resolve(__dirname, 'src/assets/scss'),
                  path.resolve(__dirname, 'node_modules/bootstrap/scss'),
                ],
                quietDeps: true, // 의존성에서 발생하는 경고 무시
              },
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        include: path.resolve(__dirname, 'src/assets/images'),
        type: 'asset/resource',
        generator: {
          filename: '[path][name].[ext]',
        },
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|pages)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
        include: [
          path.resolve(__dirname, 'src/assets/fonts'),
          path.resolve(__dirname, 'node_modules/bootstrap-icons/font/fonts'),
        ],
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]',
        },
      },
    ],
  },
  resolve: {
    alias: {
      // 특정 모듈의 별칭 지정
      'bootstrap-icons': 'node_modules/bootstrap-icons/font/fonts',
      apexcharts: 'apexcharts',
      jquery: 'jquery/src/jquery',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 문서 타이틀
      title: 'DANUSYS-유지보수 운영관리 시스템',
      // 문서 메타
      meta: {
        'X-UA-Compatible': {
          'http-equiv': 'X-UA-Compatible',
          content: 'IE=edge',
        },
      },
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['main'], // 연결할 JS
      inject: 'head',
      minify: {
        collapseWhitespace: false, // 줄 바꿈 유지
      },
      hash: false,
    }),
    ...htmlPlugins, // 동적으로 생성된 HtmlWebpackPlugin 인스턴스 추가 (원래는 낱개별로 작성해 주어야 함)
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].css',
      insert: 'head',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/assets/images',
          to: './assets/images/',
        },
      ],
    }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: './src/assets/fonts',
    //       to: './assets/fonts/',
    //     },
    //   ],
    // }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jquery: 'jQuery',
      'window.jQuery': 'jquery',
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', path.resolve(process.cwd(), 'dist/**/*')],
      dry: true,
      verbose: true,
    }),
  ],
}

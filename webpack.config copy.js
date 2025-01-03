const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const fileURLToPath = require('url')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer')

// html page 경로
const pagesDir = path.resolve(__dirname, 'src/pages/')
const jsDir = path.resolve(__dirname, 'src/js/')

// HtmlWebpackPlugin 인스턴스 동적 생성
const htmlPlugins = fs
  .readdirSync(pagesDir)
  .filter((file) => file.endsWith('.html')) // HTML 파일만 필터링
  .map((file) => {
    const name = file.replace('.html', '') // 파일명에서 확장자 제거
    return new HtmlWebpackPlugin({
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
  main: ['./src/index.js', './src/scss/main.scss'],
}

// 페이지 엔트리 파일 동적 생성
const pageEntries = fs
  .readdirSync(jsDir)
  .filter((file) => file.endsWith('.js')) // JS 파일만 필터링
  .reduce((entries, file) => {
    const name = file.replace('.js', '') // 파일명에서 확장자 제거
    entries[name] = `./src/js/${file}` // 엔트리 추가
    console.log(entries, file)
    return entries
  }, {})

const entries = { ...mainEntries, ...pageEntries }

module.exports = {
  // entry: ['./src/js/index.js', './src/scss/main.scss'],
  entry: entries,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name][contenthash].js',
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
                  path.resolve(__dirname, 'src/scss'),
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
        type: 'asset/resource',
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|pages)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 문서 타이틀
      title: 'Webpack 러닝 가이드',
      // 문서 메타
      meta: {
        'X-UA-Compatible': {
          'http-equiv': 'X-UA-Compatible',
          content: 'IE=edge',
        },
        'theme-color': '#4285f4',
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
      filename: 'css/[name][contenthash].css',
      insert: 'head',
    }),
  ],

  // webpack-dev-server
  devtool: 'source-map', // [eval, eval-source-map, eval-cheap-source-map, eval-cheap-module-source-map]
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'), // 정적 파일 제공 디렉토리
      serveIndex: true, // 디렉토리 인덱스 페이지 활성화
    },
    hot: true, // 핫 모듈 교체(HMR) 활성화 설정
    port: 3000, // 포트 번호 설정
    compress: false, // gzip 압축 활성화
    historyApiFallback: true,
    open: true,
    watchFiles: ['src/**/*'],
    // dist 디렉토리에 실제 파일 생성
    devMiddleware: {
      writeToDisk: true, // 빌드 결과를 디스크에 기록
    },
  },
}

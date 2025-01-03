const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  // webpack-dev-server
  devtool: 'source-map', // [eval, eval-source-map, eval-cheap-source-map, eval-cheap-module-source-map]
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'), // 정적 파일 제공 디렉토리
      serveIndex: true, // 디렉토리 인덱스 페이지 활성화
    },
    hot: true, // 핫 모듈 교체(HMR) 활성화 설정
    port: 4000, // 포트 번호 설정
    compress: false, // gzip 압축 활성화
    historyApiFallback: true,
    open: false,
    watchFiles: ['src/**/*'],
    // dist 디렉토리에 실제 파일 생성
    devMiddleware: {
      writeToDisk: true, // 빌드 결과를 디스크에 기록
    },
  },
})

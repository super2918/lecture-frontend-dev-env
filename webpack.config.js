const path = require("path");
const webpack = require("webpack");

const chilPross = require("child_process");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

process.env.NODE_ENV = process.env.NODE_ENV || "development"

module.exports = {
  mode: "development",
  entry: {
    main: "./src/app.js"
  },
  output: {
    filename: "[name].js",
    path: path.resolve("./dist")
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === 'production'
          ? MiniCssExtractPlugin.loader 
          : "style-loader", "css-loader"
        ]
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        loader: "url-loader",
        options: {
          name: "[name].[ext]?[hash]",
          limit: 10000 // 10Kb
        }
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: () => {
        const commit = chilPross.execSync("git rev-parse --short HEAD")
        const user = chilPross.execSync("git config user.name")
        const date = new Date().toLocaleString()

        return `commitVersion: ${commit}` + `date: ${date}\n` + `Author: ${user}`
      }
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      templateParameters: {
        env: process.env.NODE_ENV === "development" ? '개발용' : ''
      },
      minify: process.env.NODE_ENV === "production" ? {
        collapseWhitespace: true, 
        removeComments: true,
        hase: true,
      } : false
    }),
    new CleanWebpackPlugin(),
    ...(process.env.NODE_ENV === 'production' 
      ? [ new MiniCssExtractPlugin({ filename: `[name].css`})]  
      : []
    )
  ]
  /**
   * TODO: 아래 플러그인을 추가해서 번들 결과를 만들어 보세요.
   * 1. BannerPlugin: 결과물에 빌드 시간을 출력하세요. 결과물에 빌드 정보, 커밋버전 내용을 추가할 수 있음
   * 2. HtmlWebpackPlugin: 동적으로 html 파일을 생성하세요. html 파일 후처리하는데 사용, 빌드 타임의 값을 넣거나 코드를 압축함
   * 3. CleanWebpackPlugin: 빌드 전에 아웃풋 폴더를 깨끗히 정리하세요. 빌드 이전의 결과물을 제거
   * 4. MiniCssExtractPlugin: 모듈에서 css 파일을 분리하세요. 결과물에서 css를 스타일의 코드를 뽑아서 별도의 css를 파일로 만들어 역할에 따라 파일을 분리, 
   *  브라우저에서 큰 파일을 하나 받는 것보다 여러개의 작은 파일을 동시에 처리하는게 빠르기 때문
   */
};

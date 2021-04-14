module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          ie: "11" // npm i regenerator-runtime 필요함
        },
        useBuiltIns: "usage", // 폴리필 사용 방식 지정
        corejs: 3
      }
    ]
  ]
};

const TerserPlugin = require('terser-webpack-plugin');

module.exports = function override(config) {
  if (config.mode === 'production') {
    config.optimization.minimizer.push(
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // 콘솔 로그 제거
          },
          output: {
            comments: false, // 주석 제거
          },
        },
      })
    );
  }
  return config;
};
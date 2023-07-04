// @Kamil swcDefaultConfig expects tsOptions input
// I expect this needs an update to the example code in docs
const tsOptions = require('./tsconfig.json').compilerOptions;
const swcDefaultConfig =
  require('@nestjs/cli/lib/compiler/defaults/swc-defaults').swcDefaultsFactory(
    tsOptions,
  ).swcOptions;

module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: swcDefaultConfig,
        },
      },
    ],
  },
};

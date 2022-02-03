"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const path_1 = require("path");
const pilet_webpack_plugin_1 = require("pilet-webpack-plugin");
const bundler_run_1 = require("./bundler-run");
const common_1 = require("./common");
const constants_1 = require("../constants");
const helpers_1 = require("../helpers");
function getConfig(template, dist, filename, externals, importmap = [], piral, schema, develop = false, sourceMaps = true, contentHash = true, minimize = true) {
    return __awaiter(this, void 0, void 0, function* () {
        const production = !develop;
        const name = process.env.BUILD_PCKG_NAME;
        const version = process.env.BUILD_PCKG_VERSION;
        const entry = filename.replace(/\.js$/i, '');
        return {
            devtool: sourceMaps ? (develop ? 'cheap-module-source-map' : 'source-map') : false,
            mode: develop ? 'development' : 'production',
            entry: {
                [entry]: [(0, path_1.join)(__dirname, '..', 'set-path'), template],
            },
            output: {
                publicPath: './',
                path: dist,
                filename: '[name].js',
                chunkFilename: contentHash ? '[chunkhash:8].js' : undefined,
            },
            resolve: {
                extensions: common_1.extensions,
            },
            module: {
                rules: (0, common_1.getRules)(production),
            },
            optimization: {
                minimize,
                minimizer: [
                    new TerserPlugin({
                        extractComments: false,
                        terserOptions: {
                            ie8: true,
                            output: {
                                comments: /^@pilet/,
                            },
                            mangle: {
                                reserved: ['__bundleUrl__'],
                            },
                        },
                    }),
                    new OptimizeCSSAssetsPlugin({}),
                ],
            },
            plugins: (0, common_1.getPlugins)([
                new pilet_webpack_plugin_1.PiletWebpackPlugin({
                    name,
                    piral,
                    version,
                    externals,
                    importmap,
                    schema,
                    variables: (0, common_1.getVariables)(),
                }),
            ], production, true),
        };
    });
}
const handler = {
    create(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const otherConfigPath = (0, path_1.resolve)(options.root, constants_1.defaultWebpackConfig);
            const baseConfig = yield getConfig(options.entryModule, options.outDir, options.outFile, options.externals, options.importmap, options.piral, options.version, options.develop, options.sourceMaps, options.contentHash, options.minify);
            const wpConfig = (0, helpers_1.extendConfig)(baseConfig, otherConfigPath, {
                watch: options.watch,
            });
            return (0, bundler_run_1.runWebpack)(wpConfig, options.logLevel);
        });
    },
};
exports.create = handler.create;
//# sourceMappingURL=pilet.js.map
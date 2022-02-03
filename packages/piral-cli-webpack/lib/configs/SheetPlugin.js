"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_inject_plugin_1 = require("webpack-inject-plugin");
const webpack_sources_1 = require("webpack-sources");
function sheetLoader(cssName, name) {
    return () => {
        const debug = process.env.NODE_ENV === 'development';
        return [
            `var d=document`,
            `var u=__webpack_public_path__+${JSON.stringify(cssName)}`,
            `var e=d.createElement("link")`,
            `e.setAttribute('data-origin', ${JSON.stringify(name)})`,
            `e.type="text/css"`,
            `e.rel="stylesheet"`,
            `e.href=${debug ? 'u+"?_="+Math.random()' : 'u'}`,
            `d.head.appendChild(e)`,
        ].join(';');
    };
}
class SheetPlugin extends webpack_inject_plugin_1.default {
    constructor(cssName, name) {
        super(sheetLoader(cssName, name));
        this.cssName = cssName;
    }
    apply(compiler) {
        super.apply(compiler);
        compiler.hooks.compilation.tap('SheetPlugin', (compilation) => {
            compilation.hooks.afterProcessAssets.tap('SheetPlugin', (module) => {
                if (!compilation.assets[this.cssName] && Object.keys(module).length > 0) {
                    const source = new webpack_sources_1.RawSource('');
                    compilation.emitAsset(this.cssName, source);
                }
            });
        });
    }
}
exports.default = SheetPlugin;
//# sourceMappingURL=SheetPlugin.js.map
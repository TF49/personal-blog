var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createRequire } from 'module';
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var require = createRequire(import.meta.url);
// vite-plugin-prerender's ESM build uses `require()` internally; load CJS export to avoid ESM runtime errors.
// eslint-disable-next-line @typescript-eslint/no-var-requires
var vitePrerender = require('vite-plugin-prerender');
var enablePrerender = process.env.ENABLE_PRERENDER === 'true';
/** 读取实际安装的依赖版本(而非 package.json 中的范围),供首页 COLOPHON 展示 */
function installedVersion(name) {
    var _a;
    try {
        var raw = fs.readFileSync(path.join(__dirname, 'node_modules', name, 'package.json'), 'utf8');
        return (_a = JSON.parse(raw).version) !== null && _a !== void 0 ? _a : 'unknown';
    }
    catch (_b) {
        return 'unknown';
    }
}
var buildInfo = {
    builtAt: new Date().toISOString(),
    deps: Object.fromEntries(['react', 'three', 'gsap', 'tailwindcss', 'vite', 'typescript'].map(function (name) { return [name, installedVersion(name)]; })),
};
var prerenderPlugin = vitePrerender({
    staticDir: path.join(__dirname, 'dist'),
    routes: (function () {
        var baseRoutes = ['/', '/about', '/blog'];
        var articlesPath = path.join(__dirname, 'public', 'articles.json');
        try {
            var raw = fs.readFileSync(articlesPath, 'utf8');
            var articles = JSON.parse(raw);
            var slugs = articles
                .map(function (a) { return a === null || a === void 0 ? void 0 : a.slug; })
                .filter(function (s) { return typeof s === 'string' && s.trim().length > 0; });
            var postRoutes = slugs.map(function (s) { return "/blog/".concat(encodeURIComponent(s)); });
            return Array.from(new Set(__spreadArray(__spreadArray([], baseRoutes, true), postRoutes, true)));
        }
        catch (_a) {
            return baseRoutes;
        }
    })(),
    renderer: new vitePrerender.PuppeteerRenderer({
        maxConcurrentRoutes: 2,
        injectProperty: '__PRERENDER_INJECTED',
        inject: { prerender: true },
        renderAfterDocumentEvent: 'prerender-ready',
        navigationOptions: {
            waitUntil: 'domcontentloaded',
            timeout: 15000,
        },
        skipThirdPartyRequests: true,
    }),
    minify: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        decodeEntities: true,
        keepClosingSlash: true,
        sortAttributes: true,
    },
});
export default defineConfig({
    define: {
        __BUILD_INFO__: JSON.stringify(buildInfo),
    },
    plugins: __spreadArray([
        react()
    ], (enablePrerender ? [prerenderPlugin] : []), true),
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    base: (function () {
        var _a, _b;
        var repo = (_b = (_a = process.env.GITHUB_REPOSITORY) === null || _a === void 0 ? void 0 : _a.split('/')) === null || _b === void 0 ? void 0 : _b[1];
        return repo ? "/".concat(repo, "/") : '/';
    })(),
});

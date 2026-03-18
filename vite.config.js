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
export default defineConfig({
    plugins: [
        react(),
        vitePrerender({
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
                // Effects/data-loading in this app are client-side; give the route a moment to settle.
                // (Using a timed render avoids prerender hangs if an event never fires.)
                renderAfterTime: 2000,
                skipThirdPartyRequests: true,
            }),
            minify: {
                collapseBooleanAttributes: true,
                collapseWhitespace: true,
                decodeEntities: true,
                keepClosingSlash: true,
                sortAttributes: true,
            },
        }),
    ],
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

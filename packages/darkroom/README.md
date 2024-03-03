# Darkroom

The goal is for this package to facilitate the compiling and executing of Safelight plugins.

My plan for achieving that goal is to use [ses](https://github.com/endojs/endo) and [esbuild-wasm](https://esbuild.github.io/getting-started/#wasm) to
first: transform and bundle the plugin (If not bundled already) to remove any low-hanging fruit and to minify the code. Then second: execute the code in [ses](https://github.com/endojs/endo) and only grant the code access to objects it requires.

In the end, the end-user should be able to enable and disable features for a plugin. Like if the plugin should be allowed to make network requests, or if it's allowed to store data in permanent storage.

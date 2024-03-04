# Darkroom

The goal is for this package to facilitate the compiling and executing of Safelight plugins.

My plan for achieving that goal is to use [SES](https://github.com/endojs/endo) and [esbuild-wasm](https://esbuild.github.io/getting-started/#wasm) to first: transform and bundle the plugin (If not bundled already) to remove any low-hanging fruit and to minify the code. Then second: execute the code in [SES](https://github.com/endojs/endo) and only grant the code access to objects it requires.

In the end, the end-user should be able to enable and disable features for a plugin. Like if the plugin should be allowed to make network requests, or if it's allowed to store data in permanent storage.

### Why esbuild?

I want the user to be able to write their own plugins in the browser using Typescript. Using esbuild, it's possible to resolve modules manually, which will allow for a list of third-party dependencies to be able to use.

### Isn't esbuild-wasm like 15 MB?!?

Yes.

### Why SES?

The Figma team has a great writeup about ["How to build a plugin system on the web and also sleep well at night"](https://www.figma.com/blog/how-we-built-the-figma-plugin-system/), which is exactly what I'm doing here.

In that blog post, the team talks about [Realms](https://github.com/tc39/proposal-shadowrealm) and how they currently use it, but seeing as I don't plan to give the user browser API's (That a worker wouldn't already have). I think its viable to run the code in the main thread, and create a whitelist of API's.

### Missing an API or found a bug?

Message me on [Discord](https://discordapp.com/users/255730583655809025) or make an issue on [Github](https://github.com/Joery-M/Safelight)

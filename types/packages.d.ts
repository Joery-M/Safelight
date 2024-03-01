declare module '@/generated/packages.json' {
    export default packages as Packages;

    interface Packages {
        name: string;
        version: string;
        private: boolean;
        dependencies: { [key: string]: Dependency };
        devDependencies: { [key: string]: Dependency };
    }

    export interface DependencyDependencies {
        'ts-event-bus'?: Dependency;
        three?: Dependency;
        vue?: Dependency;
        '@vue/compiler-sfc'?: Dependency;
        '@vue/compiler-dom'?: Dependency;
        '@vue/shared'?: Dependency;
        '@vue/runtime-dom'?: Dependency;
        '@vue/server-renderer'?: Dependency;
        typescript?: Dependency;
        'ansi-colors'?: Dependency;
        minimist?: Dependency;
        'color-support'?: Dependency;
        'remove-markdown'?: Dependency;
        zod?: Dependency;
        'spdx-license-list'?: Dependency;
        multimatch?: Dependency;
        'strip-indent'?: Dependency;
        '@types/minimatch'?: Dependency;
        'array-differ'?: Dependency;
        'array-union'?: Dependency;
        minimatch?: Dependency;
        'min-indent'?: Dependency;
        '@types/web-bluetooth'?: Dependency;
        '@vueuse/metadata'?: Dependency;
        'vue-demi'?: Dependency;
        '@vueuse/shared'?: Dependency;
        consola?: Dependency;
        upath?: Dependency;
        chokidar?: Dependency;
        anymatch?: Dependency;
        'is-binary-path'?: Dependency;
        braces?: Dependency;
        'glob-parent'?: Dependency;
        fsevents?: EsbuildAIXPpc64;
        'is-glob'?: Dependency;
        'normalize-path'?: Dependency;
        readdirp?: Dependency;
        'change-case'?: Dependency;
        '@vueuse/core'?: Dependency;
        'karma-safari-launcher'?: Dependency;
        karma?: Dependency;
        '@vue/devtools-api'?: Dependency;
        '@endo/env-options'?: Dependency;
        '@antfu/utils'?: Dependency;
        '@rollup/pluginutils'?: Dependency;
        'fast-glob'?: Dependency;
        'local-pkg'?: Dependency;
        'magic-string'?: Dependency;
        unimport?: Dependency;
        unplugin?: Dependency;
        '@types/estree'?: Dependency;
        'estree-walker'?: Dependency;
        picomatch?: Dependency;
        '@nodelib/fs.stat'?: Dependency;
        '@nodelib/fs.walk'?: Dependency;
        merge2?: Dependency;
        micromatch?: Dependency;
        'pkg-types'?: Dependency;
        mlly?: Dependency;
        '@jridgewell/sourcemap-codec'?: Dependency;
        'brace-expansion'?: Dependency;
        acorn?: Dependency;
        'escape-string-regexp'?: Dependency;
        pathe?: Dependency;
        scule?: Dependency;
        'strip-literal'?: Dependency;
        'webpack-virtual-modules'?: Dependency;
        'webpack-sources'?: Dependency;
        '@vue/compiler-core'?: Dependency;
        '@babel/parser'?: Dependency;
        '@vue/compiler-ssr'?: Dependency;
        'source-map-js'?: Dependency;
        postcss?: Dependency;
        '@vue/runtime-core'?: Dependency;
        csstype?: Dependency;
        '@babel/helper-string-parser'?: Dependency;
        'to-fast-properties'?: Dependency;
        '@babel/helper-validator-identifier'?: Dependency;
        '@iconify/types'?: Dependency;
        'undici-types'?: Dependency;
        '@types/webxr'?: Dependency;
        '@types/stats.js'?: Dependency;
        fflate?: Dependency;
        meshoptimizer?: Dependency;
        '@eslint-community/regexpp'?: Dependency;
        graphemer?: Dependency;
        ignore?: Dependency;
        'natural-compare'?: Dependency;
        '@typescript-eslint/parser'?: Dependency;
        '@typescript-eslint/scope-manager'?: Dependency;
        '@typescript-eslint/type-utils'?: Dependency;
        '@typescript-eslint/utils'?: Dependency;
        '@typescript-eslint/visitor-keys'?: Dependency;
        debug?: Dependency;
        'ts-api-utils'?: Dependency;
        eslint?: Dependency;
        semver?: Dependency;
        '@typescript-eslint/types'?: Dependency;
        '@typescript-eslint/typescript-estree'?: Dependency;
        '@eslint-community/eslint-utils'?: Dependency;
        '@types/json-schema'?: Dependency;
        '@types/semver'?: Dependency;
        'eslint-visitor-keys'?: Dependency;
        ms?: Dependency;
        '@eslint/eslintrc'?: Dependency;
        '@eslint/js'?: Dependency;
        '@humanwhocodes/config-array'?: Dependency;
        '@humanwhocodes/module-importer'?: Dependency;
        ajv?: Dependency;
        '@ungap/structured-clone'?: Dependency;
        chalk?: Dependency;
        'cross-spawn'?: Dependency;
        doctrine?: Dependency;
        'eslint-scope'?: Dependency;
        espree?: Dependency;
        esquery?: Dependency;
        esutils?: Dependency;
        'fast-deep-equal'?: Dependency;
        'find-up'?: Dependency;
        'file-entry-cache'?: Dependency;
        globals?: Dependency;
        imurmurhash?: Dependency;
        'is-path-inside'?: Dependency;
        'js-yaml'?: Dependency;
        levn?: Dependency;
        'json-stable-stringify-without-jsonify'?: Dependency;
        'lodash.merge'?: Dependency;
        optionator?: Dependency;
        'strip-ansi'?: Dependency;
        'text-table'?: Dependency;
        'lru-cache'?: Dependency;
        globby?: Dependency;
        vite?: Dependency;
        '@types/node'?: Dependency;
        esbuild?: Dependency;
        lightningcss?: Dependency;
        rollup?: Dependency;
        sass?: Dependency;
        'caniuse-lite'?: Dependency;
        'fraction.js'?: Dependency;
        'normalize-range'?: Dependency;
        picocolors?: Dependency;
        'postcss-value-parser'?: Dependency;
        browserslist?: Dependency;
        'electron-to-chromium'?: Dependency;
        'node-releases'?: Dependency;
        'update-browserslist-db'?: Dependency;
        nanoid?: Dependency;
        escalade?: Dependency;
        'import-fresh'?: Dependency;
        'strip-json-comments'?: Dependency;
        '@humanwhocodes/object-schema'?: Dependency;
        '@nodelib/fs.scandir'?: Dependency;
        fastq?: Dependency;
        'json-schema-traverse'?: Dependency;
        'fast-json-stable-stringify'?: Dependency;
        'uri-js'?: Dependency;
        'ansi-styles'?: Dependency;
        'supports-color'?: Dependency;
        'path-key'?: Dependency;
        which?: Dependency;
        'shebang-command'?: Dependency;
        esrecurse?: Dependency;
        estraverse?: Dependency;
        'acorn-jsx'?: Dependency;
        'flat-cache'?: Dependency;
        'locate-path'?: Dependency;
        'path-exists'?: Dependency;
        'type-fest'?: Dependency;
        'is-extglob'?: Dependency;
        argparse?: Dependency;
        'prelude-ls'?: Dependency;
        'type-check'?: Dependency;
        '@aashutoshrathi/word-wrap'?: Dependency;
        'deep-is'?: Dependency;
        'fast-levenshtein'?: Dependency;
        'ansi-regex'?: Dependency;
        prettier?: Dependency;
        'eslint-config-prettier'?: Dependency;
        'prettier-linter-helpers'?: Dependency;
        synckit?: Dependency;
        'fast-diff'?: Dependency;
        '@pkgr/core'?: Dependency;
        tslib?: Dependency;
        tailwindcss?: Dependency;
        '@alloc/quick-lru'?: Dependency;
        arg?: Dependency;
        didyoumean?: Dependency;
        dlv?: Dependency;
        jiti?: Dependency;
        lilconfig?: Dependency;
        'object-hash'?: Dependency;
        'postcss-import'?: Dependency;
        'postcss-js'?: Dependency;
        'postcss-selector-parser'?: Dependency;
        'postcss-load-config'?: Dependency;
        'postcss-nested'?: Dependency;
        resolve?: Dependency;
        sucrase?: Dependency;
        'xml-name-validator'?: Dependency;
        'nth-check'?: Dependency;
        'vue-eslint-parser'?: Dependency;
        boolbase?: Dependency;
        cssesc?: Dependency;
        'util-deprecate'?: Dependency;
        lodash?: Dependency;
        'lightningcss-darwin-arm64'?: EsbuildAIXPpc64;
        'lightningcss-darwin-x64'?: EsbuildAIXPpc64;
        'detect-libc'?: Dependency;
        'lightningcss-freebsd-x64'?: EsbuildAIXPpc64;
        'lightningcss-linux-arm-gnueabihf'?: EsbuildAIXPpc64;
        'lightningcss-linux-arm64-gnu'?: EsbuildAIXPpc64;
        'lightningcss-linux-arm64-musl'?: EsbuildAIXPpc64;
        'lightningcss-linux-x64-gnu'?: EsbuildAIXPpc64;
        'lightningcss-linux-x64-musl'?: EsbuildAIXPpc64;
        'lightningcss-win32-x64-msvc'?: Dependency;
        'source-map'?: Dependency;
        open?: Dependency;
        yargs?: Dependency;
        'define-lazy-prop'?: Dependency;
        'is-wsl'?: Dependency;
        'is-docker'?: Dependency;
        cliui?: Dependency;
        'get-caller-file'?: Dependency;
        'require-directory'?: Dependency;
        'string-width'?: Dependency;
        y18n?: Dependency;
        'yargs-parser'?: Dependency;
        immutable?: Dependency;
        'read-cache'?: Dependency;
        'camelcase-css'?: Dependency;
        yaml?: Dependency;
        'path-parse'?: Dependency;
        'is-core-module'?: Dependency;
        'supports-preserve-symlinks-flag'?: Dependency;
        '@jridgewell/gen-mapping'?: Dependency;
        commander?: Dependency;
        glob?: Dependency;
        'lines-and-columns'?: Dependency;
        mz?: Dependency;
        pirates?: Dependency;
        'ts-interface-checker'?: Dependency;
        mkdirp?: Dependency;
        'tree-kill'?: Dependency;
        'dynamic-dedupe'?: Dependency;
        rimraf?: Dependency;
        'source-map-support'?: Dependency;
        'ts-node'?: Dependency;
        tsconfig?: Dependency;
        'buffer-from'?: Dependency;
        '@cspotcode/source-map-support'?: Dependency;
        '@tsconfig/node10'?: Dependency;
        '@tsconfig/node12'?: Dependency;
        '@tsconfig/node14'?: Dependency;
        '@tsconfig/node16'?: Dependency;
        'acorn-walk'?: Dependency;
        diff?: Dependency;
        'make-error'?: Dependency;
        'create-require'?: Dependency;
        yn?: Dependency;
        'v8-compile-cache-lib'?: Dependency;
        '@types/strip-bom'?: Dependency;
        '@types/strip-json-comments'?: Dependency;
        'strip-bom'?: Dependency;
        'get-tsconfig'?: Dependency;
        '@esbuild/aix-ppc64'?: EsbuildAIXPpc64;
        '@esbuild/android-arm'?: EsbuildAIXPpc64;
        '@esbuild/android-arm64'?: EsbuildAIXPpc64;
        '@esbuild/android-x64'?: EsbuildAIXPpc64;
        '@esbuild/darwin-arm64'?: EsbuildAIXPpc64;
        '@esbuild/darwin-x64'?: EsbuildAIXPpc64;
        '@esbuild/freebsd-arm64'?: EsbuildAIXPpc64;
        '@esbuild/freebsd-x64'?: EsbuildAIXPpc64;
        '@esbuild/linux-arm'?: EsbuildAIXPpc64;
        '@esbuild/linux-arm64'?: EsbuildAIXPpc64;
        '@esbuild/linux-ia32'?: EsbuildAIXPpc64;
        '@esbuild/linux-loong64'?: EsbuildAIXPpc64;
        '@esbuild/linux-mips64el'?: EsbuildAIXPpc64;
        '@esbuild/linux-ppc64'?: EsbuildAIXPpc64;
        '@esbuild/linux-riscv64'?: EsbuildAIXPpc64;
        '@esbuild/linux-s390x'?: EsbuildAIXPpc64;
        '@esbuild/linux-x64'?: EsbuildAIXPpc64;
        '@esbuild/netbsd-x64'?: EsbuildAIXPpc64;
        '@esbuild/openbsd-x64'?: EsbuildAIXPpc64;
        '@esbuild/sunos-x64'?: EsbuildAIXPpc64;
        '@esbuild/win32-arm64'?: EsbuildAIXPpc64;
        '@esbuild/win32-ia32'?: EsbuildAIXPpc64;
        '@esbuild/win32-x64'?: Dependency;
        'resolve-pkg-maps'?: Dependency;
        '@typescript-eslint/eslint-plugin'?: Dependency;
        'get-port-please'?: Dependency;
        'ast-kit'?: Dependency;
        h3?: Dependency;
        'launch-editor'?: Dependency;
        'serve-static'?: Dependency;
        'cookie-es'?: Dependency;
        crossws?: Dependency;
        defu?: Dependency;
        destr?: Dependency;
        ohash?: Dependency;
        'iron-webcrypto'?: Dependency;
        radix3?: Dependency;
        ufo?: Dependency;
        uncrypto?: Dependency;
        unenv?: Dependency;
        'shell-quote'?: Dependency;
        encodeurl?: Dependency;
        'escape-html'?: Dependency;
        parseurl?: Dependency;
        send?: Dependency;
        json5?: Dependency;
        '@babel/types'?: Dependency;
        'ast-walker-scope'?: Dependency;
        '@vue-macros/common'?: Dependency;
        'vue-router'?: Dependency;
        'magic-string-ast'?: Dependency;
        '@rollup/rollup-android-arm-eabi'?: EsbuildAIXPpc64;
        '@rollup/rollup-android-arm64'?: EsbuildAIXPpc64;
        '@rollup/rollup-darwin-arm64'?: EsbuildAIXPpc64;
        '@rollup/rollup-darwin-x64'?: EsbuildAIXPpc64;
        '@rollup/rollup-linux-arm-gnueabihf'?: EsbuildAIXPpc64;
        '@rollup/rollup-linux-arm64-gnu'?: EsbuildAIXPpc64;
        '@rollup/rollup-linux-arm64-musl'?: EsbuildAIXPpc64;
        '@rollup/rollup-linux-riscv64-gnu'?: EsbuildAIXPpc64;
        '@rollup/rollup-linux-x64-gnu'?: EsbuildAIXPpc64;
        '@rollup/rollup-linux-x64-musl'?: EsbuildAIXPpc64;
        '@rollup/rollup-win32-arm64-msvc'?: EsbuildAIXPpc64;
        '@rollup/rollup-win32-ia32-msvc'?: EsbuildAIXPpc64;
        '@rollup/rollup-win32-x64-msvc'?: Dependency;
        axios?: Dependency;
        '@octokit/rest'?: Dependency;
        '@octokit/plugin-paginate-rest'?: Dependency;
        '@octokit/plugin-request-log'?: Dependency;
        '@octokit/plugin-rest-endpoint-methods'?: Dependency;
        '@octokit/core'?: Dependency;
        'follow-redirects'?: Dependency;
        'form-data'?: Dependency;
        'proxy-from-env'?: Dependency;
        '@volar/typescript'?: Dependency;
        '@vue/language-core'?: Dependency;
        'path-browserify'?: Dependency;
        '@volar/language-core'?: Dependency;
        '@volar/source-map'?: Dependency;
        computeds?: Dependency;
        'muggle-string'?: Dependency;
        'vue-template-compiler'?: Dependency;
    }

    export interface Dependency {
        from: string;
        version?: string;
        resolved: string;
        description?: string;
        license: string | License;
        author?: Author;
        homepage: string;
        repository?: string;
        dependencies?: DependencyDependencies;
    }

    export interface Author {
        name: string;
        url?: string;
        email?: string;
    }

    export interface License {
        type: string;
        url: string;
    }
}

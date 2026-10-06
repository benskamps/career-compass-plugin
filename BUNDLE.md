# Where server/ comes from

Built from the npm package
[career-compass-mcp@2.9.7](https://www.npmjs.com/package/career-compass-mcp/v/2.9.7), the same tarball
`npx career-compass-mcp@2.9.7` installs. Its source is
[v2.9.7 in career-compass-mcp](https://github.com/benskamps/career-compass-mcp/tree/v2.9.7).

- Nothing is minified, bundled into one file, or edited. Each file under `server/build` and
  `server/node_modules` is byte-for-byte identical to that release after
  `npm install --omit=dev`. `server/package.json` is a shortened copy of the package's own.
- Only the files the server loads are included. esbuild traced them from
  `build/src/index.js`; it was not used to transform anything.
- Runtime dependencies, as locked by that install:
  - `@modelcontextprotocol/sdk@1.32.1` (MIT)
  - `ajv@8.20.0` (MIT)
  - `ajv-formats@3.0.1` (MIT)
  - `fast-deep-equal@3.1.3` (MIT)
  - `fast-uri@3.1.8` (BSD-3-Clause)
  - `json-schema-traverse@1.0.0` (MIT)
  - `yaml@2.9.1` (ISC)
  - `zod@4.6.5` (MIT)
  - `zod-to-json-schema@3.25.2` (ISC)
- 386 files in the plugin in total.

To check it yourself: install `career-compass-mcp@2.9.7` with `npm install --omit=dev` and
compare any file under `server/` with the same path in that install. The build script that
produces this repository is
[scripts/build-plugin-bundle.mjs](https://github.com/benskamps/career-compass-mcp/blob/main/scripts/build-plugin-bundle.mjs)
in career-compass-mcp, so each release can be regenerated and compared the same way.

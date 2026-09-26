# Where server/ comes from

Built by `.github/scripts/build-bundle.mjs 2.9.3` from the npm package
[career-compass-mcp@2.9.3](https://www.npmjs.com/package/career-compass-mcp/v/2.9.3), the same tarball
`npx career-compass-mcp@2.9.3` installs. Its source is
[v2.9.3 in career-compass-mcp](https://github.com/benskamps/career-compass-mcp/tree/v2.9.3).

- Nothing is minified, bundled into one file, or edited. Each file is copied as published.
- Only the files the server loads are included. esbuild traced them from
  `build/src/index.js`; it was not used to transform anything.
- Runtime dependencies, as locked by that install:
  - `@modelcontextprotocol/sdk@1.30.1` (MIT)
  - `ajv@8.20.0` (MIT)
  - `ajv-formats@3.0.1` (MIT)
  - `fast-deep-equal@3.1.3` (MIT)
  - `fast-uri@3.1.8` (BSD-3-Clause)
  - `json-schema-traverse@1.0.0` (MIT)
  - `yaml@2.9.1` (ISC)
  - `zod@4.6.5` (MIT)
  - `zod-to-json-schema@3.25.2` (ISC)
- 379 files in the plugin in total.

To check it yourself: run the same command on a clean checkout and compare with `git diff`.

# Where this plugin comes from

Built from [v2.16.0 in career-compass-mcp](https://github.com/benskamps/career-compass-mcp/tree/cf8755f5fdcba844d09bf89c649085e5eb502a29).

- The plugin is skills only: `skills/`, the icon, the manifest, LICENSE and the privacy
  policy. There is no MCP server, no `.mcp.json`, and no program that runs on your
  computer. Every skill file is a byte-for-byte copy of `plugin/skills/` at that commit.
- `plugin.json` is `plugin/.claude-plugin/plugin.json` at that commit, with the listing
  fields in `plugin/directory.json` laid over it and the repository set to this one.
- 21 files in the plugin in total.

The full plugin, which adds a local server that remembers your career history and tracks
your applications, installs in Claude Code from career-compass-mcp's own marketplace:

```
/plugin marketplace add benskamps/career-compass-mcp
/plugin install career-compass@career-compass
```

The build script is
[scripts/build-plugin-skills.mjs](https://github.com/benskamps/career-compass-mcp/blob/main/scripts/build-plugin-skills.mjs)
in career-compass-mcp, so each release can be regenerated and compared.

# Where this plugin comes from

Built from [v2.16.1 in career-compass-mcp](https://github.com/benskamps/career-compass-mcp/tree/3c2d9c7bb2fa45261b4844a47f172fc289edfdbc).

- The plugin is skills only: `skills/`, the icon, the manifest, LICENSE and the privacy
  policy. There is no MCP server, no `.mcp.json`, and no program that runs on your
  computer.
- Each skill file is `plugin/skills/` at that commit with two things removed: the
  `allowed-tools` lists (they name the full version's MCP tools), and the passages marked
  full-only, which tell Claude to read the full version's saved files on your computer.
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

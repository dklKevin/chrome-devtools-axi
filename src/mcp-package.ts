/**
 * Exact chrome-devtools-mcp package the bridge may spawn via npx.
 *
 * Dist-tags (`@latest`, `@next`, `@canary`, `@beta`) and version ranges
 * (`^`, `~`, `*`) are forbidden: they resolve to whatever was published
 * today and skip the pin. Bump {@link CHROME_DEVTOOLS_MCP_VERSION}
 * deliberately when taking a new MCP release.
 *
 * Leaf module: node builtins only.
 */

export const CHROME_DEVTOOLS_MCP_NAME = "chrome-devtools-mcp" as const;

/** Exact semver. Never a range or dist-tag. */
export const CHROME_DEVTOOLS_MCP_VERSION = "1.7.0" as const;

export const CHROME_DEVTOOLS_MCP_SPEC =
  `${CHROME_DEVTOOLS_MCP_NAME}@${CHROME_DEVTOOLS_MCP_VERSION}` as const;

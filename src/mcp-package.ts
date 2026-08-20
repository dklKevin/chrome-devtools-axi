/**
 * Pinned chrome-devtools-mcp identity.
 *
 * The npx fallback and `package.json` dependency must stay on this exact
 * version — never `@latest`, never a semver range. `test/bridge.test.ts`
 * fails if the two sources drift.
 *
 * Leaf module: node builtins only, so the CLI graph can mention the pin
 * without loading the MCP SDK.
 */

export const CHROME_DEVTOOLS_MCP_NAME = "chrome-devtools-mcp";

/** Exact x.y.z. Bump together with the `package.json` dependency. */
export const CHROME_DEVTOOLS_MCP_VERSION = "1.7.0";

export const CHROME_DEVTOOLS_MCP_SPEC = `${CHROME_DEVTOOLS_MCP_NAME}@${CHROME_DEVTOOLS_MCP_VERSION}`;

/** Path inside the package to the CLI entrypoint (global + local installs). */
export const CHROME_DEVTOOLS_MCP_BIN = "build/src/bin/chrome-devtools-mcp.js";

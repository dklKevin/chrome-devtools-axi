import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { buildTransportArgs, resolveTransportSpec } from "../src/bridge.js";
import { TOP_HELP } from "../src/cli.js";
import {
  CHROME_DEVTOOLS_MCP_NAME,
  CHROME_DEVTOOLS_MCP_SPEC,
  CHROME_DEVTOOLS_MCP_VERSION,
} from "../src/mcp-package.js";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

const FLOATING_MCP_SPEC = `${CHROME_DEVTOOLS_MCP_NAME}@latest`;
const EXACT_SEMVER = /^\d+\.\d+\.\d+$/;

const SCAN_ROOTS = [
  "src",
  "test",
  "bin",
  "scripts",
  "skills",
  "AGENTS.md",
  "README.md",
];

function listFiles(path: string): string[] {
  const st = statSync(path);
  if (st.isFile()) return [path];
  const out: string[] = [];
  for (const entry of readdirSync(path)) {
    if (entry === "node_modules" || entry === "dist") continue;
    out.push(...listFiles(join(path, entry)));
  }
  return out;
}

describe("chrome-devtools-mcp pin", () => {
  it("is an exact semver, never a dist-tag or range", () => {
    expect(CHROME_DEVTOOLS_MCP_VERSION).toMatch(EXACT_SEMVER);
    expect(CHROME_DEVTOOLS_MCP_SPEC).toBe(
      `${CHROME_DEVTOOLS_MCP_NAME}@${CHROME_DEVTOOLS_MCP_VERSION}`,
    );
    expect(CHROME_DEVTOOLS_MCP_SPEC).not.toContain("@latest");
    expect(CHROME_DEVTOOLS_MCP_SPEC).not.toMatch(
      /[@](latest|next|canary|beta)\b/,
    );
    expect(CHROME_DEVTOOLS_MCP_SPEC).not.toMatch(/[@][\^~*]/);
    // The spec contains exactly one `@` (the version separator). A second
    // `@` would be a dist-tag (`name@latest`).
    expect(CHROME_DEVTOOLS_MCP_SPEC.split("@")).toHaveLength(2);
  });

  it("is what the npx fallback actually spawns", () => {
    const args = buildTransportArgs();
    expect(args[0]).toBe("-y");
    expect(args[1]).toBe(CHROME_DEVTOOLS_MCP_SPEC);
    expect(args).not.toContain(FLOATING_MCP_SPEC);

    const spec = resolveTransportSpec({
      existsSync: () => false,
      getNpmPrefix: () => null,
    });
    expect(spec.command).toBe("npx");
    expect(spec.args[1]).toBe(CHROME_DEVTOOLS_MCP_SPEC);
    expect(spec.args).not.toContain(FLOATING_MCP_SPEC);
  });

  it("is documented in top-level help instead of @latest", () => {
    expect(TOP_HELP).toContain(`npx -y ${CHROME_DEVTOOLS_MCP_SPEC}`);
    expect(TOP_HELP).not.toContain(FLOATING_MCP_SPEC);
  });

  it("never appears as a floating @latest package spec in the repo", () => {
    const hits: string[] = [];
    for (const root of SCAN_ROOTS) {
      for (const file of listFiles(join(ROOT, root))) {
        const text = readFileSync(file, "utf8");
        if (text.includes(FLOATING_MCP_SPEC)) {
          hits.push(relative(ROOT, file));
        }
      }
    }
    expect(hits).toEqual([]);
  });
});

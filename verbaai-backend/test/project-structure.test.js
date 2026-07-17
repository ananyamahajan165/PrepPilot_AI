import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const srcDir = path.join(rootDir, "src");

describe("backend project structure", () => {
  it("contains the backend source directory", () => {
    assert.equal(existsSync(srcDir), true);
  });

  it("keeps an application entrypoint in src", () => {
    assert.equal(existsSync(path.join(srcDir, "app.js")), true);
    assert.equal(existsSync(path.join(srcDir, "server.js")), true);
  });

  it("has source files ready for implementation", () => {
    const files = readdirSync(srcDir, { recursive: true }).filter((file) =>
      file.endsWith(".js")
    );

    assert.ok(files.length > 0);
  });
});

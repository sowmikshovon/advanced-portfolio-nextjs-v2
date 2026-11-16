import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");

const ts = require(path.join(PROJECT_ROOT, "node_modules", "typescript"));

const ASSET_EXT_RE = /\.(png|jpe?g|webp|svg)$/i;

function createTsLoader(projectRoot) {
  const cache = new Map();
  const importedAssetsByModule = new Map();

  function resolveFile(basePath) {
    const candidates = [
      basePath,
      `${basePath}.ts`,
      `${basePath}.tsx`,
      `${basePath}.js`,
      `${basePath}.mjs`,
      path.join(basePath, "index.ts"),
      path.join(basePath, "index.tsx"),
      path.join(basePath, "index.js"),
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return candidate;
      }
    }
    return null;
  }

  function loadModule(relOrAbsPath) {
    const absPath = path.isAbsolute(relOrAbsPath)
      ? relOrAbsPath
      : path.resolve(projectRoot, relOrAbsPath);

    if (cache.has(absPath)) {
      return cache.get(absPath).exports;
    }

    const source = fs.readFileSync(absPath, "utf8");
    const { outputText } = ts.transpileModule(source, {
      fileName: absPath,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        jsx: ts.JsxEmit.React,
        esModuleInterop: true,
        resolveJsonModule: true,
      },
    });

    const mod = { exports: {} };
    cache.set(absPath, mod);

    const assetsForModule = [];
    importedAssetsByModule.set(absPath, assetsForModule);

    const nodeRequire = createRequire(absPath);

    const customRequire = (specifier) => {
      if (specifier.startsWith("@/")) {
        const mappedPath = path.resolve(projectRoot, specifier.slice(2));
        if (ASSET_EXT_RE.test(mappedPath)) {
          assetsForModule.push(mappedPath);
          return { src: "/stub" };
        }
        const resolved = resolveFile(mappedPath);
        if (!resolved) {
          throw new Error(`Cannot resolve alias import '${specifier}' from ${absPath}`);
        }
        return loadModule(resolved);
      }

      if (specifier.startsWith("./") || specifier.startsWith("../")) {
        const mappedPath = path.resolve(path.dirname(absPath), specifier);
        if (ASSET_EXT_RE.test(mappedPath)) {
          assetsForModule.push(mappedPath);
          return { src: "/stub" };
        }
        const resolved = resolveFile(mappedPath);
        if (!resolved) {
          throw new Error(`Cannot resolve relative import '${specifier}' from ${absPath}`);
        }
        return loadModule(resolved);
      }

      return nodeRequire(specifier);
    };

    const fn = new Function(
      "exports",
      "require",
      "module",
      "__filename",
      "__dirname",
      `${outputText}\n//# sourceURL=${absPath}`
    );
    fn(mod.exports, customRequire, mod, absPath, path.dirname(absPath));

    return mod.exports;
  }

  return { loadModule, importedAssetsByModule };
}

const loader = createTsLoader(PROJECT_ROOT);
const utils = loader.loadModule("lib/utils.ts");
const data = loader.loadModule("lib/data.ts");
const cvData = loader.loadModule("lib/cv-data.ts");

test("lib/utils.ts: validateString validates non-empty strings within maxLength", () => {
  assert.equal(utils.validateString("hello", 10), true);
  assert.equal(utils.validateString("abc", 3), true);
  assert.equal(utils.validateString("abcd", 3), false);
  assert.equal(utils.validateString("", 10), false);
  assert.equal(utils.validateString(null, 10), false);
  assert.equal(utils.validateString(undefined, 10), false);
  assert.equal(utils.validateString(123, 10), false);
  assert.equal(utils.validateString({}, 10), false);
});

test("lib/utils.ts: validateEmail validates proper emails and rejects invalid inputs", () => {
  assert.equal(utils.validateEmail("sowmik@example.com"), true);
  assert.equal(utils.validateEmail("  user.name+tag@lut.fi  "), true);
  assert.equal(utils.validateEmail(""), false);
  assert.equal(utils.validateEmail("not-an-email"), false);
  assert.equal(utils.validateEmail("@example.com"), false);
  assert.equal(utils.validateEmail("user@"), false);
  assert.equal(utils.validateEmail("user@domain"), false);
  assert.equal(utils.validateEmail("user name@example.com"), false);
  assert.equal(utils.validateEmail("a@b.co", 5), false);
  assert.equal(utils.validateEmail(null), false);
  assert.equal(utils.validateEmail(42), false);
});

test("lib/utils.ts: getErrorMessage extracts readable messages from errors and objects", () => {
  assert.equal(utils.getErrorMessage(new Error("boom")), "boom");
  assert.equal(utils.getErrorMessage({ message: "obj error" }), "obj error");
  assert.equal(utils.getErrorMessage({ message: 500 }), "500");
  assert.equal(utils.getErrorMessage("plain string"), "plain string");
  assert.equal(utils.getErrorMessage(null), "Something went wrong");
  assert.equal(utils.getErrorMessage(undefined), "Something went wrong");
  assert.equal(utils.getErrorMessage(123), "Something went wrong");
  assert.equal(utils.getErrorMessage({}), "Something went wrong");
});

test("lib/cv-data.ts: resolveDirectCvUrl resolves Drive, Dropbox, local, and unsafe/empty URLs", () => {
  const fallback = cvData.cvConfig.fallbackLocalPath;
  assert.equal(fallback, "/SowmikShovonKarmakarCV.pdf");

  assert.equal(
    cvData.resolveDirectCvUrl(
      "https://drive.google.com/file/d/10Eeuk0-Sefn8RYVn4oB3ggZg-BI24QRs/view?usp=drive_link"
    ),
    "https://drive.google.com/uc?export=download&id=10Eeuk0-Sefn8RYVn4oB3ggZg-BI24QRs"
  );

  assert.equal(
    cvData.resolveDirectCvUrl("https://drive.google.com/open?id=ABC_123"),
    "https://drive.google.com/uc?export=download&id=ABC_123"
  );

  assert.equal(
    cvData.resolveDirectCvUrl("https://www.dropbox.com/s/abc123/resume.pdf?dl=0"),
    "https://www.dropbox.com/s/abc123/resume.pdf?dl=1"
  );

  assert.equal(cvData.resolveDirectCvUrl("/foo.pdf"), "/foo.pdf");
  assert.equal(cvData.resolveDirectCvUrl("javascript:alert(1)"), fallback);
  assert.equal(cvData.resolveDirectCvUrl(""), fallback);
  assert.equal(cvData.resolveDirectCvUrl("   "), fallback);
  assert.equal(cvData.resolveDirectCvUrl(undefined), fallback);
});

test("lib/data.ts: educationData is reverse-chronological and omits SSC/HSC", () => {
  assert.ok(Array.isArray(data.educationData));
  assert.ok(data.educationData.length >= 4);

  const first = data.educationData[0];
  assert.match(
    first.date,
    /2026|Present/i,
    `Expected first educationData entry date to contain "2026" or "Present", got "${first.date}"`
  );

  const earlyCombined = data.educationData
    .slice(0, 2)
    .map((entry) => `${entry.title} ${entry.location} ${entry.description}`)
    .join(" ");
  assert.match(
    earlyCombined,
    /LUT University/i,
    "Expected an early educationData entry (first or second) to mention LUT University"
  );

  for (const entry of data.educationData) {
    assert.doesNotMatch(
      `${entry.title} ${entry.description}`,
      /\b(SSC|HSC)\b/i,
      `educationData must not contain high school SSC/HSC entry: ${entry.title}`
    );
  }
});

test("lib/cv-data.ts: cvProfile.education starts with MSc at LUT University and ends with BSc", () => {
  const edu = cvData.cvProfile.education;
  assert.ok(Array.isArray(edu));
  assert.ok(edu.length >= 3);

  assert.equal(
    edu[0].title,
    "MSc in Software Product Management and Business"
  );
  assert.match(edu[0].institution, /LUT University/i);
  assert.equal(edu[edu.length - 1].title, "BSc");
});

test("lib/data.ts: projectsData entries have valid githubUrl, liveUrl, and existing public/ images", () => {
  assert.ok(Array.isArray(data.projectsData));
  assert.ok(data.projectsData.length >= 9);

  for (const project of data.projectsData) {
    assert.equal(
      typeof project.githubUrl,
      "string",
      `Project "${project.title}" must define string githubUrl`
    );
    assert.ok(
      project.githubUrl.startsWith("https://github.com/sowmikshovon/") &&
        project.githubUrl.length > "https://github.com/sowmikshovon/".length,
      `Project "${project.title}" githubUrl must start with https://github.com/sowmikshovon/, got "${project.githubUrl}"`
    );

    assert.ok(
      Object.prototype.hasOwnProperty.call(project, "liveUrl"),
      `Project "${project.title}" must define liveUrl (string or null)`
    );
    assert.ok(
      project.liveUrl === null ||
        (typeof project.liveUrl === "string" && project.liveUrl.startsWith("https://")),
      `Project "${project.title}" liveUrl must be null or an https:// URL, got "${project.liveUrl}"`
    );

    assert.deepEqual(project.imageUrl, { src: "/stub" });
  }

  const deployedTitles = [
    "Spotify Full-Stack Clone",
    "Advanced Portfolio",
    "Anime Vault",
    "Terminal Portfolio",
  ];
  for (const title of deployedTitles) {
    const project = data.projectsData.find((p) => p.title === title);
    assert.ok(project, `Expected deployed project "${title}" to exist in projectsData`);
    assert.equal(
      typeof project.liveUrl,
      "string",
      `Deployed project "${title}" must have a non-null liveUrl`
    );
    assert.ok(
      project.liveUrl.startsWith("https://"),
      `Deployed project "${title}" liveUrl must start with https://, got "${project.liveUrl}"`
    );
  }

  const dataAbsPath = path.resolve(PROJECT_ROOT, "lib/data.ts");
  const publicDir = path.resolve(PROJECT_ROOT, "public");
  const importedAssets = loader.importedAssetsByModule.get(dataAbsPath) ?? [];

  assert.ok(importedAssets.length >= 9, "Expected lib/data.ts to import project images");
  for (const assetPath of importedAssets) {
    const resolvedAsset = path.resolve(assetPath);
    assert.ok(
      resolvedAsset.startsWith(publicDir + path.sep),
      `Imported image must live under public/: ${resolvedAsset}`
    );
    assert.ok(
      fs.existsSync(resolvedAsset),
      `Imported image does not exist on disk: ${resolvedAsset}`
    );
  }
});

test("lib/data.ts: skillsData has no duplicates and covers all skillCategories entries", () => {
  const skillsSet = new Set(data.skillsData);
  assert.equal(
    skillsSet.size,
    data.skillsData.length,
    "skillsData must not contain duplicate skills"
  );

  for (const [category, skills] of Object.entries(data.skillCategories)) {
    for (const skill of skills) {
      assert.ok(
        skillsSet.has(skill),
        `Skill "${skill}" in skillCategories["${category}"] is missing from skillsData`
      );
    }
  }
});

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");

function readSource(relPath) {
  return fs.readFileSync(path.join(PROJECT_ROOT, relPath), "utf8");
}

function extractClassNameExprs(source) {
  const results = [];
  const pattern = /className\s*=\s*/g;
  let match;

  while ((match = pattern.exec(source)) !== null) {
    let idx = match.index + match[0].length;
    const ch = source[idx];

    if (ch === '"' || ch === "'") {
      const end = source.indexOf(ch, idx + 1);
      if (end !== -1) {
        results.push(source.slice(idx + 1, end));
      }
    } else if (ch === "{") {
      let depth = 0;
      let i = idx;
      let quote = null;
      while (i < source.length) {
        const c = source[i];
        if (quote) {
          if (c === "\\" && i + 1 < source.length) {
            i += 2;
            continue;
          }
          if (c === quote) {
            quote = null;
          }
        } else {
          if (c === '"' || c === "'" || c === "`") {
            quote = c;
          } else if (c === "{") {
            depth += 1;
          } else if (c === "}") {
            depth -= 1;
            if (depth === 0) {
              results.push(source.slice(idx + 1, i));
              break;
            }
          }
        }
        i += 1;
      }
    }
  }

  return results;
}

function extractAllOpeningTags(source, tagName) {
  const tags = [];
  const regex = new RegExp(`<${tagName}\\b`, "g");
  let startMatch;

  while ((startMatch = regex.exec(source)) !== null) {
    let i = startMatch.index + startMatch[0].length;
    let braceDepth = 0;
    let quote = null;

    while (i < source.length) {
      const c = source[i];
      if (quote) {
        if (c === "\\" && i + 1 < source.length) {
          i += 2;
          continue;
        }
        if (c === quote) {
          quote = null;
        }
      } else {
        if (c === '"' || c === "'" || c === "`") {
          quote = c;
        } else if (c === "{") {
          braceDepth += 1;
        } else if (c === "}") {
          braceDepth = Math.max(0, braceDepth - 1);
        } else if (c === ">" && braceDepth === 0) {
          tags.push(source.slice(startMatch.index, i + 1));
          break;
        }
      }
      i += 1;
    }
  }

  return tags;
}

function extractOpeningTag(source, tagName) {
  return extractAllOpeningTags(source, tagName)[0] ?? null;
}

function hasExactTailwindClass(source, className) {
  const escaped = className.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[\\s"'\`])${escaped}(?:$|[\\s"'\`])`).test(source);
}

// =============================================================================
// Priority 1: Accessibility & Reduced Motion
// =============================================================================

test("Priority 1 (A11y): no raw outline-none without focus-visible:ring in interactive files", () => {
  const files = [
    "components/intro.tsx",
    "components/contact.tsx",
    "components/submit-btn.tsx",
    "components/header.tsx",
    "components/theme-switch.tsx",
    "components/projects.tsx",
    "components/skills.tsx",
    "components/project.tsx",
    "app/cv/page.tsx",
  ];

  for (const relPath of files) {
    const src = readSource(relPath);
    const classExprs = extractClassNameExprs(src);

    for (const expr of classExprs) {
      if (expr.includes("outline-none")) {
        assert.match(
          expr,
          /focus-visible:ring/,
          `${relPath} uses outline-none without focus-visible:ring in className: ${expr}`
        );
      }
    }
  }
});

test("Priority 1 (A11y): theme-switch.tsx has type='button' and aria-label", () => {
  const src = readSource("components/theme-switch.tsx");
  assert.match(src, /type\s*=\s*["']button["']/);
  assert.match(src, /aria-label\s*=/);
});

test("Priority 1 (A11y): projects.tsx and skills.tsx filter buttons use aria-pressed and omit tablist/tab roles", () => {
  for (const relPath of ["components/projects.tsx", "components/skills.tsx"]) {
    const src = readSource(relPath);
    assert.match(src, /aria-pressed\s*=/, `${relPath} should use aria-pressed on filter buttons`);
    assert.doesNotMatch(src, /role\s*=\s*["']tablist["']/, `${relPath} must not use role="tablist"`);
    assert.doesNotMatch(src, /role\s*=\s*["']tab["']/, `${relPath} must not use role="tab"`);
  }
});

test("Priority 1 (A11y): app/layout.tsx includes Skip to main content link and MotionConfig reducedMotion='user'", () => {
  const src = readSource("app/layout.tsx");
  assert.match(src, /Skip to main content/);
  assert.match(src, /\bsr-only\b/);
  assert.match(src, /\bfocus:not-sr-only\b/);
  assert.match(src, /<MotionConfig\b/);
  assert.match(src, /reducedMotion\s*=\s*["']user["']/);
});

test("Priority 1 (A11y): globals.css respects prefers-reduced-motion and project.tsx checks useReducedMotion()", () => {
  const css = readSource("app/globals.css");
  assert.match(
    css,
    /@media\s*\(\s*prefers-reduced-motion:\s*no-preference\s*\)\s*\{[\s\S]*?scroll-behavior:\s*smooth/
  );
  assert.match(css, /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*\{/);

  const project = readSource("components/project.tsx");
  assert.match(project, /\buseReducedMotion\s*\(/);
});

// =============================================================================
// Priority 2: Touch & Interaction
// =============================================================================

test("Priority 2 (Touch): globals.css sets cursor: pointer on buttons", () => {
  const css = readSource("app/globals.css");
  assert.match(css, /\bbutton\b[^{]*\{[^}]*cursor:\s*pointer/i);
});

test("Priority 2 (Touch): projects.tsx and skills.tsx filter buttons use min-h-10 or py-2 touch target", () => {
  for (const relPath of ["components/projects.tsx", "components/skills.tsx"]) {
    const src = readSource(relPath);
    const buttons = src.match(/<button[\s\S]*?<\/button>/g) ?? [];
    assert.ok(buttons.length > 0, `${relPath} must contain filter <button> elements`);
    for (const btn of buttons) {
      assert.match(
        btn,
        /\b(min-h-10|min-h-\[2\.5rem\]|min-h-\[40px\]|min-h-\[44px\]|py-2|py-2\.5)\b/,
        `${relPath} filter button should use min-h-10 or py-2 for larger touch targets`
      );
    }
  }
});

// =============================================================================
// Priority 3: Performance & FOUC
// =============================================================================

test("Priority 3 (Perf): public/ contains no deleted legacy files and retains core assets", () => {
  const deletedLegacyFiles = [
    "gericht.png",
    "gptthree.png",
    "fear.jpg",
    "portvone.png",
    "museumofcandy.png",
    "DIceGameDOM.png",
    "CV.pdf",
    "CV_2.pdf",
    "Sowmik_Shovon_Karmakar_Resume.pdf",
    "SowmikShovonKarmakarResume.pdf",
  ];

  for (const file of deletedLegacyFiles) {
    assert.equal(
      fs.existsSync(path.join(PROJECT_ROOT, "public", file)),
      false,
      `Legacy file public/${file} must be removed`
    );
  }

  assert.equal(fs.existsSync(path.join(PROJECT_ROOT, "public", "SowmikShovonKarmakarCV.pdf")), true);
  assert.equal(fs.existsSync(path.join(PROJECT_ROOT, "public", "Untitled-3.jpg")), true);
});

test("Priority 3 (Perf): project.tsx sets sizes on <Image> and omits quality={95}", () => {
  const src = readSource("components/project.tsx");
  const imageTags = extractAllOpeningTags(src, "Image");
  assert.ok(imageTags.length > 0, "project.tsx must render at least one <Image>");
  for (const tag of imageTags) {
    assert.match(tag, /\bsizes\s*=/, `Every <Image> in project.tsx must set sizes=`);
    assert.doesNotMatch(tag, /quality\s*=\s*\{\s*95\s*\}/);
  }
});

test("Priority 3 (FOUC): app/layout.tsx includes inline dark-mode FOUC script in <head>", () => {
  const src = readSource("app/layout.tsx");
  const headMatch = src.match(/<head>([\s\S]*?)<\/head>/);
  assert.ok(headMatch, "app/layout.tsx must render a <head> element with inline FOUC script");
  const headContent = headMatch[1];
  assert.match(headContent, /<script\b/);
  assert.match(headContent, /localStorage/);
  assert.match(headContent, /dark/);
});

// =============================================================================
// Priority 4: Style & Storytelling
// =============================================================================

test("Priority 4 (Style): intro.tsx omits checkmark emoji and uses 1:1 circular avatar", () => {
  const src = readSource("components/intro.tsx");
  assert.equal(src.includes("✅"), false, "intro.tsx must not contain ✅");
  assert.equal(src.includes("h-[10.5rem]"), false);
  assert.equal(src.includes("w-[8.75rem]"), false);
  assert.match(src, /\bh-32\b/);
  assert.match(src, /\bw-32\b/);
  assert.match(src, /\bsm:h-36\b/);
  assert.match(src, /\bsm:w-36\b/);
});

test("Priority 4 (Style): about.tsx omits rocket and watch emojis", () => {
  const src = readSource("components/about.tsx");
  assert.equal(src.includes("🚀"), false, "about.tsx must not contain 🚀");
  assert.equal(src.includes("⌚"), false, "about.tsx must not contain ⌚");
});

test("Priority 4 (Storytelling): educations.tsx heading is 'Experience & Education'", () => {
  const src = readSource("components/educations.tsx");
  assert.equal(src.includes("Experience & Education"), true);
  assert.equal(src.includes("Education Timeline"), false);
});

// =============================================================================
// Priority 5: Layout & Responsive
// =============================================================================

test("Priority 5 (Layout): app/layout.tsx sets overflow-x-hidden on body and wraps blobs in overflow-hidden", () => {
  const src = readSource("app/layout.tsx");
  const bodyTag = extractOpeningTag(src, "body");
  assert.ok(bodyTag, "app/layout.tsx must contain a <body> element");
  assert.match(bodyTag, /\boverflow-x-hidden\b/);
  assert.match(src, /overflow-hidden[\s\S]*bg-\[#fbe2e3\][\s\S]*bg-\[#dbd7fb\]/);
});

test("Priority 5 (Responsive): header.tsx uses responsive w-[min(22rem,92vw)] instead of w-[22rem]", () => {
  const src = readSource("components/header.tsx");
  assert.equal(src.includes("w-[min(22rem,92vw)]"), true);
  assert.doesNotMatch(src, /\bw-\[22rem\]/);
});

test("Priority 5 (Responsive): project.tsx includes mobile preview (sm:hidden) alongside desktop preview (sm:block)", () => {
  const src = readSource("components/project.tsx");
  assert.match(src, /\bsm:hidden\b/);
  assert.match(src, /\bsm:block\b/);
});

// =============================================================================
// Priority 6: Typography & Color
// =============================================================================

test("Priority 6 (Typography): app/layout.tsx imports and configures JetBrains_Mono", () => {
  const src = readSource("app/layout.tsx");
  assert.match(
    src,
    /import\s*\{[^}]*\bJetBrains_Mono\b[^}]*\}\s*from\s*["']next\/font\/google["']/
  );
  assert.match(src, /JetBrains_Mono\s*\(/);
});

test("Priority 6 (Color): submit-btn.tsx uses dark:bg-white and dark:text-gray-950", () => {
  const src = readSource("components/submit-btn.tsx");
  assert.equal(
    hasExactTailwindClass(src, "dark:bg-white"),
    true,
    "submit-btn.tsx must include dark:bg-white (not dark:bg-white/10)"
  );
  assert.equal(
    hasExactTailwindClass(src, "dark:text-gray-950"),
    true,
    "submit-btn.tsx must include dark:text-gray-950"
  );
});

test("Priority 6 (Color): contact.tsx uses dark:bg-white/5 and dark:text-white instead of dark:bg-white/80 and dark:text-black", () => {
  const src = readSource("components/contact.tsx");
  assert.equal(src.includes("dark:bg-white/80"), false);
  assert.equal(src.includes("dark:text-black"), false);
  assert.equal(hasExactTailwindClass(src, "dark:bg-white/5"), true);
  assert.equal(hasExactTailwindClass(src, "dark:text-white"), true);
});

// =============================================================================
// Priority 8: Forms & Feedback
// =============================================================================

test("Priority 8 (Forms): contact.tsx has accessible labels, autoComplete='email', and resets form on success", () => {
  const src = readSource("components/contact.tsx");
  assert.match(src, /<label[^>]*\bhtmlFor\s*=\s*["']senderEmail["']/);
  assert.match(src, /<label[^>]*\bhtmlFor\s*=\s*["']message["']/);
  assert.match(src, /autoComplete\s*=\s*["']email["']/);
  assert.match(src, /\.reset\s*\(/);
});

// =============================================================================
// Priority 9: Navigation & CI
// =============================================================================

test("Priority 9 (Navigation): skills.tsx uses useSectionInView('Skills', <= 0.35)", () => {
  const src = readSource("components/skills.tsx");
  const match = src.match(/useSectionInView\(\s*["']Skills["']\s*,\s*([0-9.]+)\s*\)/);
  assert.ok(match, "skills.tsx must pass explicit threshold to useSectionInView('Skills', ...)");
  const threshold = Number(match[1]);
  assert.ok(
    Number.isFinite(threshold) && threshold <= 0.35,
    `Expected Skills useSectionInView threshold <= 0.35, got ${match[1]}`
  );
});

test("Priority 9 (CI): .github/workflows/ci.yml runs npm test and omits continue-on-error: true", () => {
  const src = readSource(".github/workflows/ci.yml");
  assert.match(src, /\bnpm test\b/);
  assert.doesNotMatch(src, /continue-on-error\s*:\s*true/);
});

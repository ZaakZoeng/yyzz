type RawModuleMap = Record<string, string>;

export type VowPost = {
  locale: "zh-CN" | "en-US";
  slug: string;
  title: string;
  summary: string;
  date: string;
  status: string;
  order: number;
  content: string;
};

const markdownModules = import.meta.glob("../content/vows/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as RawModuleMap;

const assetModules = import.meta.glob("../content/vows/**/*.{png,jpg,jpeg,webp,gif,svg}", {
  eager: true,
  query: "?url",
  import: "default",
}) as RawModuleMap;

function resolveLocalAssets(markdown: string, sourcePath: string) {
  const directory = sourcePath.slice(0, sourcePath.lastIndexOf("/"));

  return markdown.replace(/(!?\[[^\]]*\]\()(\.\/[^)\s]+)(\s+(?:"[^"]*"|'[^']*'))?(\))/g, (match, opening, relativePath, title = "", closing) => {
    const assetPath = `${directory}/${relativePath.slice(2)}`;
    return assetModules[assetPath] ? `${opening}${assetModules[assetPath]}${title}${closing}` : match;
  });
}

function parseVow(sourcePath: string, rawContent: string): VowPost {
  const slug = sourcePath.split("/").pop()?.replace(/\.md$/, "") || "untitled";
  const locale = sourcePath.includes("/en-US/") ? "en-US" : "zh-CN";
  const frontmatter = rawContent.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  const metadata: Record<string, string> = {};

  if (frontmatter) {
    frontmatter[1].split("\n").forEach((line) => {
      const separator = line.indexOf(":");
      if (separator < 0) return;
      const key = line.slice(0, separator).trim();
      const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
      metadata[key] = value;
    });
  }

  const body = frontmatter ? rawContent.slice(frontmatter[0].length) : rawContent;

  return {
    locale,
    slug,
    title: metadata.title || slug.replace(/[-_]/g, " "),
    summary: metadata.summary || (locale === "en-US" ? "Open this vow to read the full story." : "点击打开这份还愿记录。"),
    date: metadata.date || "",
    status: metadata.status || (locale === "en-US" ? "Dreaming" : "心愿中"),
    order: Number(metadata.order) || 999,
    content: resolveLocalAssets(body, sourcePath),
  };
}

const allVowPosts = Object.entries(markdownModules)
  .map(([path, content]) => parseVow(path, content))
  .sort((a, b) => a.order - b.order || b.date.localeCompare(a.date));

export function getVowPosts(locale: string) {
  const localized = allVowPosts.filter((post) => post.locale === locale);
  const chinese = allVowPosts.filter((post) => post.locale === "zh-CN");
  if (locale === "zh-CN") return chinese;

  const localizedSlugs = new Set(localized.map((post) => post.slug));
  return [...localized, ...chinese.filter((post) => !localizedSlugs.has(post.slug))]
    .sort((a, b) => a.order - b.order || b.date.localeCompare(a.date));
}

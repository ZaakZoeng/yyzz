<script setup lang="ts">
import DOMPurify from "dompurify";
import { marked } from "marked";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import type { VowPost } from "../data/vows";

const props = defineProps<{ vow?: VowPost }>();
const route = useRoute();
const { t } = useI18n();
const homeRoute = computed(() => ({ name: "home", params: { locale: route.params.locale } }));
const vowListRoute = computed(() => ({ ...homeRoute.value, hash: "#vows" }));

const renderedContent = computed(() => {
  if (!props.vow) return "";
  return DOMPurify.sanitize(marked.parse(props.vow.content, { async: false }) as string);
});
</script>

<template>
  <main class="vow-detail-page">
    <article v-if="vow" class="vow-article">
      <RouterLink class="back-link" :to="vowListRoute"><span aria-hidden="true">←</span> {{ t('vows.back') }}</RouterLink>
      <header>
        <p><span>{{ vow.status }}</span><time v-if="vow.date" :datetime="vow.date">{{ vow.date }}</time></p>
        <h1>{{ vow.title }}</h1>
        <strong>{{ vow.summary }}</strong>
      </header>
      <div class="markdown-body" v-html="renderedContent"></div>
      <footer>
        <span>YY ♡ ZZ</span>
        <RouterLink :to="homeRoute">{{ t('vows.home') }} →</RouterLink>
      </footer>
    </article>

    <section v-else class="not-found">
      <span>404</span>
      <h1>{{ t('vows.notFoundTitle') }}</h1>
      <p>{{ t('vows.notFoundText') }}</p>
      <RouterLink :to="homeRoute">{{ t('vows.backHome') }}</RouterLink>
    </section>
  </main>
</template>

<style scoped>
.vow-detail-page { min-height: calc(100vh - 180px); padding: 150px clamp(24px, 7vw, 112px) 100px; background: var(--page-bg, #f8f4ed); }
.vow-article { width: min(860px, 100%); margin: 0 auto; }
.back-link { display: inline-flex; align-items: center; gap: 10px; color: var(--blue, #527b9d); text-decoration: none; font-size: 12px; }
.back-link:hover { color: var(--red, #b8514a); }
.vow-article > header { margin: 70px 0 62px; padding-bottom: 52px; border-bottom: 1px solid var(--line-color, #e4d9d1); }
.vow-article > header p { display: flex; gap: 12px; align-items: center; margin-bottom: 20px; color: var(--text-muted, #7a6964); font-size: 10px; letter-spacing: .12em; }
.vow-article > header p span { padding: 6px 10px; color: #fff; background: var(--red, #b8514a); border-radius: 999px; }
.vow-article h1, .not-found h1 { margin: 0; font-family: "Noto Serif SC", "Songti SC", serif; font-size: clamp(40px, 6vw, 70px); line-height: 1.25; letter-spacing: -.05em; }
.vow-article > header strong { display: block; max-width: 620px; margin-top: 25px; color: var(--text-muted, #7a6964); font-family: "Noto Serif SC", "Songti SC", serif; font-size: 16px; font-weight: 400; line-height: 1.9; }
.markdown-body { color: var(--text-main, #302725); font-size: 16px; line-height: 2; }
.markdown-body :deep(h2), .markdown-body :deep(h3) { margin: 2em 0 .8em; font-family: "Noto Serif SC", "Songti SC", serif; line-height: 1.45; }
.markdown-body :deep(h2) { font-size: 28px; }
.markdown-body :deep(h3) { font-size: 21px; }
.markdown-body :deep(p), .markdown-body :deep(ul), .markdown-body :deep(ol) { margin: 0 0 1.35em; }
.markdown-body :deep(blockquote) { margin: 2em 0; padding: 20px 24px; color: var(--text-muted, #7a6964); background: var(--surface-map, #f0f5f7); border-left: 3px solid var(--red, #b8514a); }
.markdown-body :deep(a) { color: var(--blue, #527b9d); text-underline-offset: 4px; }
.markdown-body :deep(img) { display: block; max-width: 100%; height: auto; margin: 2em auto; border-radius: 18px; box-shadow: 0 18px 46px rgba(48, 35, 31, .12); }
.markdown-body :deep(hr) { margin: 3em 0; border: 0; border-top: 1px solid var(--line-color, #e4d9d1); }
.markdown-body :deep(code) { padding: .15em .4em; background: var(--surface-map, #f0f5f7); border-radius: 5px; }
.vow-article > footer { margin-top: 80px; padding-top: 30px; display: flex; justify-content: space-between; gap: 20px; border-top: 1px solid var(--line-color, #e4d9d1); }
.vow-article > footer span { color: var(--red, #b8514a); font-family: Georgia, serif; }
.vow-article > footer a { color: var(--blue, #527b9d); text-decoration: none; }
.not-found { min-height: 60vh; display: grid; place-content: center; justify-items: center; text-align: center; }
.not-found > span { color: var(--red, #b8514a); font-family: Georgia, serif; font-size: 14px; letter-spacing: .3em; }
.not-found h1 { margin-top: 20px; font-size: clamp(32px, 5vw, 56px); }
.not-found p { margin: 20px 0 30px; color: var(--text-muted, #7a6964); }
.not-found a { padding: 12px 20px; color: #fff; background: var(--blue, #527b9d); border-radius: 999px; text-decoration: none; }

@media (max-width: 600px) {
  .vow-detail-page { padding-top: 120px; padding-bottom: 70px; }
  .vow-article > header { margin: 46px 0 42px; padding-bottom: 38px; }
  .vow-article > footer { flex-direction: column; }
}
</style>

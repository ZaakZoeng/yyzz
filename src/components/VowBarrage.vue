<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { getVowPosts } from "../data/vows";

const route = useRoute();
const { t, locale } = useI18n();
const vowPosts = computed(() => getVowPosts(locale.value));
const routeLocale = computed(() => route.params.locale === "en" ? "en" : "zh");

function barrageStyle(index: number) {
  return {
    "--track": index % 4,
    "--duration": `${22 + (index % 5) * 3}s`,
    "--delay": `${-(5 + index * 7)}s`,
  };
}
</script>

<template>
  <div class="vow-barrage">
    <div class="barrage-stage" :aria-label="t('vows.aria')">
      <RouterLink
        v-for="(vow, index) in vowPosts"
        :key="vow.slug"
        class="vow-bullet"
        :to="{ name: 'vow', params: { locale: routeLocale, slug: vow.slug } }"
        :style="barrageStyle(index)"
      >
        <span>{{ String(index + 1).padStart(2, '0') }}</span>
        <strong>{{ vow.title }}</strong>
        <small>{{ vow.status }}</small>
        <i aria-hidden="true">↗</i>
      </RouterLink>
    </div>
    <p class="barrage-tip"><span aria-hidden="true">↗</span> {{ t('vows.tip') }}</p>
  </div>
</template>

<style scoped>
.vow-barrage { min-width: 0; }
.barrage-stage { position: relative; height: 382px; overflow: hidden; border-top: 1px solid rgba(255,255,255,.2); border-bottom: 1px solid rgba(255,255,255,.2); }
.barrage-stage::before { content: ""; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(90deg, #aa514c 0, transparent 9%, transparent 91%, #aa514c 100%); z-index: 2; }
.vow-bullet {
  position: absolute;
  z-index: 1;
  top: calc(24px + var(--track) * 88px);
  left: 0;
  width: max-content;
  max-width: min(520px, 78vw);
  padding: 16px 19px;
  display: grid;
  grid-template-columns: 30px minmax(150px, auto) auto 20px;
  align-items: center;
  gap: 13px;
  color: #fff7f3;
  text-decoration: none;
  background: rgba(255,255,255,.1);
  border: 1px solid rgba(255,255,255,.23);
  border-radius: 999px;
  box-shadow: 0 12px 28px rgba(70, 26, 29, .12);
  backdrop-filter: blur(8px);
  animation: vow-move var(--duration) linear var(--delay) infinite;
  transition: color .2s ease, background .2s ease, border-color .2s ease;
}
.vow-bullet:hover, .vow-bullet:focus-visible { z-index: 3; color: #365d7e; background: #fff8f2; border-color: #fff8f2; animation-play-state: paused; }
.vow-bullet > span { color: rgba(255,255,255,.55); font-size: 10px; }
.vow-bullet:hover > span, .vow-bullet:focus-visible > span { color: #b8514a; }
.vow-bullet strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: "Noto Serif SC", "Songti SC", serif; font-size: clamp(15px, 1.5vw, 20px); font-weight: 500; }
.vow-bullet small { padding: 5px 9px; color: #f4d8d0; border: 1px solid rgba(255,255,255,.2); border-radius: 999px; font-size: 9px; white-space: nowrap; }
.vow-bullet:hover small, .vow-bullet:focus-visible small { color: #527b9d; border-color: #b9cad6; }
.vow-bullet i { font-size: 18px; font-style: normal; }
.barrage-tip { margin: 18px 0 0; color: rgba(255,255,255,.64); font-size: 10px; letter-spacing: .08em; text-align: right; }
.barrage-tip span { margin-right: 7px; }

@keyframes vow-move {
  from { left: 0; transform: translateX(calc(-100% - 30px)); }
  to { left: 100%; transform: translateX(30px); }
}

@media (max-width: 600px) {
  .barrage-stage { height: 342px; }
  .vow-bullet { top: calc(18px + var(--track) * 78px); padding: 13px 15px; grid-template-columns: 24px minmax(120px, auto) auto 17px; gap: 9px; }
  .vow-bullet small { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .barrage-stage { height: auto; padding: 16px 0; display: flex; gap: 10px; overflow-x: auto; }
  .barrage-stage::before { display: none; }
  .vow-bullet { position: static; flex: 0 0 auto; transform: none; animation: none; }
}
</style>

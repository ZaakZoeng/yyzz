<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import Backtop from "./components/Backtop.vue";
import FootprintMap from "./components/FootprintMap.vue";
import LoveTimeline from "./components/LoveTimeline.vue";
import VowBarrage from "./components/VowBarrage.vue";
import VowDetail from "./components/VowDetail.vue";
import { journeyStats } from "./data/journey";
import { getVowPosts } from "./data/vows";

type ColorTheme = "light" | "dark";

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();
const relationshipStartedAt = new Date("2018-04-05T00:00:00+08:00");
const now = ref(new Date());
const menuOpen = ref(false);
const noteOpen = ref(false);
const theme = ref<ColorTheme>("light");
const headerScrolled = ref(false);
let clock: number | undefined;
let revealObserver: IntersectionObserver | undefined;

const routeLocale = computed(() => route.params.locale === "en" ? "en-US" : "zh-CN");
const routeLocaleSegment = computed(() => routeLocale.value === "en-US" ? "en" : "zh");
const currentVowSlug = computed(() => route.name === "vow" ? String(route.params.slug || "") : "");
const selectedVow = computed(() =>
  getVowPosts(routeLocale.value).find((vow) => vow.slug === currentVowSlug.value),
);

const dayCount = computed(() => {
  const elapsed = now.value.getTime() - relationshipStartedAt.getTime();
  return Math.max(1, Math.floor(elapsed / 86_400_000) + 1);
});

const togetherClock = computed(() => {
  const elapsed = Math.max(0, now.value.getTime() - relationshipStartedAt.getTime());
  const hours = Math.floor((elapsed % 86_400_000) / 3_600_000);
  const minutes = Math.floor((elapsed % 3_600_000) / 60_000);
  const seconds = Math.floor((elapsed % 60_000) / 1_000);

  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0"));
});

const nextAnniversary = computed(() => {
  const year = now.value.getFullYear();
  let target = new Date(`${year}-04-05T00:00:00+08:00`);
  if (target.getTime() <= now.value.getTime()) {
    target = new Date(`${year + 1}-04-05T00:00:00+08:00`);
  }
  return Math.ceil((target.getTime() - now.value.getTime()) / 86_400_000);
});

async function scrollToSection(id: string) {
  if (currentVowSlug.value) {
    await router.push({ name: "home", params: { locale: routeLocaleSegment.value } });
    await nextTick();
    setupRevealTargets();
  }
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  menuOpen.value = false;
}

function setupRevealTargets() {
  revealObserver?.disconnect();
  const revealTargets = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver?.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  revealTargets.forEach((target) => revealObserver?.observe(target));
}

function toggleLocale() {
  const nextSegment = routeLocale.value === "zh-CN" ? "en" : "zh";
  window.localStorage.setItem("yyzz-locale", nextSegment === "en" ? "en-US" : "zh-CN");
  void router.push({
    name: route.name === "vow" ? "vow" : "home",
    params: { locale: nextSegment, ...(currentVowSlug.value ? { slug: currentVowSlug.value } : {}) },
  });
}

function applyTheme(nextTheme: ColorTheme) {
  theme.value = nextTheme;
  document.documentElement.dataset.theme = nextTheme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    "content",
    nextTheme === "dark" ? "#11171d" : "#f8f4ed",
  );
  window.localStorage.setItem("yyzz-color-theme", nextTheme);
}

function toggleTheme() {
  applyTheme(theme.value === "light" ? "dark" : "light");
}

function handleScroll() {
  headerScrolled.value = window.scrollY > 12;
}

onMounted(() => {
  const savedTheme = window.localStorage.getItem("yyzz-color-theme");
  applyTheme(savedTheme === "dark" ? "dark" : "light");
  clock = window.setInterval(() => (now.value = new Date()), 1_000);
  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
  setupRevealTargets();
});

onBeforeUnmount(() => {
  window.clearInterval(clock);
  window.removeEventListener("scroll", handleScroll);
  revealObserver?.disconnect();
});

watch(routeLocale, (nextLocale) => {
  locale.value = nextLocale;
  document.documentElement.lang = nextLocale;
  document.title = nextLocale === "en-US" ? "YY & ZZ · Our Love Space" : "YY & ZZ · 我们的爱情空间";
  window.localStorage.setItem("yyzz-locale", nextLocale);
}, { immediate: true });

watch(() => route.fullPath, () => {
  menuOpen.value = false;
  if (!route.hash) window.scrollTo({ top: 0 });
  void nextTick(setupRevealTargets);
});
</script>

<template>
  <div :class="['site-shell', `theme-${theme}`]">
    <header :class="['topbar', { scrolled: headerScrolled }]">
      <button class="brand" type="button" :aria-label="t('brand.home')" @click="scrollToSection('home')">
        <span class="brand-mark">YY<span>♡</span>ZZ</span>
        <span class="brand-copy">{{ t('brand.subtitle') }}</span>
      </button>

      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="menuOpen"
        :aria-label="t('common.menu')"
        @click="menuOpen = !menuOpen"
      >
        <span></span><span></span>
      </button>

      <nav :class="['nav', { open: menuOpen }]" :aria-label="t('common.nav')">
        <button type="button" @click="scrollToSection('home')">{{ t('nav.home') }}</button>
        <button type="button" @click="scrollToSection('story')">{{ t('nav.story') }}</button>
        <button type="button" @click="scrollToSection('footprints')">{{ t('nav.footprints') }}</button>
        <button type="button" @click="scrollToSection('vows')">{{ t('nav.vows') }}</button>
        <button class="language-toggle" type="button" :title="routeLocale === 'zh-CN' ? 'English' : '中文'" @click="toggleLocale">
          {{ routeLocale === 'zh-CN' ? 'EN' : '中文' }}
        </button>
        <button
          class="theme-toggle"
          type="button"
          :aria-label="theme === 'light' ? t('theme.dark') : t('theme.light')"
          :title="theme === 'light' ? t('theme.dark') : t('theme.light')"
          @click="toggleTheme"
        >
          <span aria-hidden="true">{{ theme === 'light' ? '☾' : '☀' }}</span>
        </button>
        <button class="nav-pill" type="button" @click="noteOpen = true">{{ t('nav.letter') }}</button>
      </nav>
    </header>

    <main v-if="!currentVowSlug">
      <section id="home" class="hero section-pad">
        <div class="hero-copy">
          <p class="eyebrow"><span></span> {{ t('hero.eyebrow') }}</p>
          <h1>{{ t('hero.title') }}<br /><em>{{ t('hero.titleAccent') }}</em></h1>
          <p class="hero-description">{{ t('hero.description') }}</p>
          <div class="hero-actions">
            <button class="primary-button" type="button" @click="scrollToSection('story')">
              {{ t('hero.storyAction') }} <span>↘</span>
            </button>
            <button class="text-button" type="button" @click="noteOpen = true">{{ t('hero.letterAction') }}</button>
          </div>
        </div>

        <div class="hero-visual" :aria-label="t('hero.together')">
          <div class="orbit orbit-one"></div>
          <div class="orbit orbit-two"></div>
          <div class="love-card">
            <span class="card-label">{{ t('hero.cardLabel') }}</span>
            <strong>{{ dayCount }}</strong>
            <span class="days-label">{{ t('hero.days') }}</span>
            <div
              class="together-clock"
              :aria-label="t('hero.togetherAria', { hours: togetherClock[0], minutes: togetherClock[1], seconds: togetherClock[2] })"
            >
              <span>{{ togetherClock[0] }}</span><i>:</i>
              <span>{{ togetherClock[1] }}</span><i>:</i>
              <span>{{ togetherClock[2] }}</span>
            </div>
            <span class="clock-label">{{ t('hero.clockLabels') }}</span>
            <div class="card-divider"></div>
            <p>{{ t('hero.since') }}</p>
          </div>
          <div class="floating-note note-top">{{ t('hero.curiosity') }}</div>
          <div class="floating-note note-bottom">{{ t('hero.anniversary', { days: nextAnniversary }) }}</div>
          <span class="spark spark-one">✦</span>
          <span class="spark spark-two">✦</span>
        </div>
      </section>

      <section class="promise section-pad" :aria-label="t('promise.label')" data-reveal>
        <p>{{ t('promise.quote') }}</p>
        <span>{{ t('promise.label') }}</span>
      </section>

      <section id="story" class="story section-pad">
        <div class="section-heading" data-reveal>
          <div>
            <p class="eyebrow"><span></span> {{ t('story.eyebrow') }}</p>
            <h2>{{ t('story.title') }}<br />{{ t('story.titleSecond') }}</h2>
          </div>
          <p class="section-intro">{{ t('story.intro') }}</p>
        </div>

        <div data-reveal>
          <LoveTimeline />
        </div>
      </section>

      <section id="footprints" class="footprints section-pad">
        <div class="section-heading map-heading" data-reveal>
          <div>
            <p class="eyebrow blue"><span></span> {{ t('footprints.eyebrow') }}</p>
            <h2>{{ t('footprints.title') }}<br />{{ t('footprints.titleSecond') }}</h2>
          </div>
          <div class="footprint-stats" :aria-label="t('footprints.statsAria')">
            <div><strong>{{ journeyStats.continents }}</strong><span>{{ t('footprints.continents') }}</span></div>
            <div><strong>{{ journeyStats.countries }}</strong><span>{{ t('footprints.countries') }}</span></div>
            <div><strong>{{ journeyStats.cities }}</strong><span>{{ t('footprints.cities') }}</span></div>
            <div><strong>{{ journeyStats.moments }}</strong><span>{{ t('footprints.moments') }}</span></div>
            <div><strong>{{ journeyStats.years }}</strong><span>{{ t('footprints.years') }}</span></div>
          </div>
        </div>

        <div data-reveal>
          <FootprintMap />
        </div>
      </section>

      <section id="vows" class="vow-section section-pad">
        <div class="vow-copy" data-reveal>
          <p class="eyebrow light"><span></span> {{ t('vows.eyebrow') }}</p>
          <h2>{{ t('vows.title') }}<br />{{ t('vows.titleSecond') }}</h2>
          <p>{{ t('vows.intro') }}</p>
        </div>

        <div class="vow-barrage-wrap" data-reveal>
          <VowBarrage />
        </div>
      </section>
    </main>

    <VowDetail v-else :vow="selectedVow" />

    <footer class="footer section-pad">
      <div class="footer-visitors">
        <a
          class="footer-counter footer-counter-map"
          href="https://mapmyvisitors.com/web/1c85m"
          target="_blank"
          rel="nofollow noreferrer"
          :title="t('footer.visitors')"
        >
          <img
            src="https://mapmyvisitors.com/map.png?cl=ffffff&t=tt&d=A7H0z-fWuTV5ZWODeP-7_PWS_da3fI-8VE7ocTInB1E&cl=527b9d"
            :alt="t('footer.visitorsAlt')"
            referrerpolicy="no-referrer"
          />
        </a>

        <a
          class="footer-counter-legacy"
          href="https://info.flagcounter.com/TSBZ"
          tabindex="-1"
          aria-hidden="true"
          rel="nofollow noreferrer"
        >
          <img
            src="https://s01.flagcounter.com/map/TSBZ/size_s/txt_365D7E/border_D5DEE5/pageviews_1/viewers_0/flags_0/"
            alt=""
            referrerpolicy="no-referrer"
          />
        </a>
      </div>
      <p>{{ t('footer.made') }}</p>
      <span>© 2017—{{ now.getFullYear() }}—∞ · {{ t('footer.copyright') }}</span>
    </footer>

    <Backtop />

    <Transition name="fade">
      <div v-if="noteOpen" class="modal-backdrop" role="presentation" @click.self="noteOpen = false">
        <article class="love-letter" role="dialog" aria-modal="true" :aria-label="t('letter.aria')">
          <button class="modal-close" type="button" :aria-label="t('letter.close')" @click="noteOpen = false">×</button>
          <span class="letter-date">{{ t('letter.label') }}</span>
          <h2>{{ t('letter.title') }}</h2>
          <p>{{ t('letter.p1') }}</p>
          <p>{{ t('letter.p2') }}</p>
          <strong>{{ t('letter.sign') }}</strong>
        </article>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
:global(*) { box-sizing: border-box; }
:global(html) { scroll-behavior: smooth; }
:global(body) {
  margin: 0;
  min-width: 320px;
  color: #302725;
  background: #f8f4ed;
  font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif;
  -webkit-font-smoothing: antialiased;
  transition: color .35s ease, background .35s ease;
}
:global(html[data-theme="dark"] body) { color: #e8e2dc; background: #11171d; }
:global(button) { font: inherit; }
:global(button:focus-visible) { outline: 2px solid currentColor; outline-offset: 3px; }

.site-shell {
  --page-bg: #f8f4ed;
  --text-main: #302725;
  --text-muted: #7a6964;
  --surface-story: #fbf8f3;
  --surface-map: #f0f5f7;
  --surface-footer: #f2ebe3;
  --line-color: #e4d9d1;
  --blue: #527b9d;
  --blue-deep: #365d7e;
  --red: #b8514a;
  --map-canvas: #e9f0f4;
  --map-country: #d4e0e7;
  --map-stroke: #f5f1eb;
  --photo-surface: #efe7df;
  --backtop-bg: #365d7e;
  min-height: 100vh;
  overflow: hidden;
  color: var(--text-main);
  background: var(--page-bg);
  transition: color .35s ease, background .35s ease;
}
.site-shell.theme-dark {
  --page-bg: #11171d;
  --text-main: #e8e2dc;
  --text-muted: #a9a29d;
  --surface-story: #171e24;
  --surface-map: #121d25;
  --surface-footer: #10161b;
  --line-color: #33414b;
  --blue: #7ea9c8;
  --blue-deep: #345f7e;
  --red: #d4746e;
  --map-canvas: #1a2933;
  --map-country: #293d4a;
  --map-stroke: #17232c;
  --photo-surface: #222c33;
  --backtop-bg: #b85f5a;
}
.section-pad { padding-left: clamp(24px, 7vw, 112px); padding-right: clamp(24px, 7vw, 112px); }
.topbar {
  position: fixed; z-index: 30; top: 0; left: 0; width: 100%; height: 104px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 clamp(24px, 7vw, 112px);
  border-bottom: 1px solid transparent;
  background: rgba(248, 244, 237, .7);
  backdrop-filter: blur(18px) saturate(1.25);
  transition: height .3s ease, background .35s ease, border-color .35s ease, box-shadow .35s ease;
}
.topbar.scrolled { height: 78px; border-color: rgba(70, 49, 43, .1); background: rgba(248, 244, 237, .9); box-shadow: 0 8px 30px rgba(61, 43, 37, .07); }
.brand { display: flex; align-items: center; gap: 14px; color: inherit; border: 0; background: none; cursor: pointer; }
.brand-mark { font-family: "DM Serif Display", Georgia, serif; font-size: 27px; letter-spacing: -.05em; }
.brand-mark span { color: #b8514a; font-size: 21px; margin: 0 3px; }
.brand-copy { font-family: "Noto Serif SC", serif; font-size: 13px; letter-spacing: .2em; }
.nav { display: flex; align-items: center; gap: clamp(22px, 3vw, 44px); }
.nav button { color: #5b4a45; border: 0; background: none; font-size: 14px; cursor: pointer; transition: color .2s ease; }
.nav button:hover { color: #b8514a; }
.nav .language-toggle { min-width: 44px; padding: 7px 11px; color: #365d7e; border: 1px solid rgba(54, 93, 126, .24); border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: .04em; }
.nav .language-toggle:hover { color: #fff; border-color: #365d7e; background: #365d7e; }
.nav .nav-pill { padding: 11px 21px; color: #fff; background: #365d7e; border-radius: 999px; }
.nav .theme-toggle { width: 38px; height: 38px; padding: 0; display: grid; place-items: center; color: #365d7e; border: 1px solid rgba(54, 93, 126, .24); border-radius: 50%; font-size: 18px; transition: color .25s ease, border-color .25s ease, transform .25s ease, background .25s ease; }
.nav .theme-toggle:hover { color: #fff; border-color: #365d7e; background: #365d7e; transform: rotate(12deg); }
.menu-toggle { display: none; width: 42px; height: 42px; border: 0; background: transparent; }
.menu-toggle span { display: block; width: 22px; height: 1px; margin: 7px auto; background: #342a28; }

.hero {
  position: relative; min-height: 810px; padding-top: 176px; padding-bottom: 90px;
  display: grid; grid-template-columns: 1.02fr .98fr; align-items: center; gap: 5vw;
  background:
    radial-gradient(circle at 85% 8%, rgba(230, 181, 167, .32), transparent 25%),
    linear-gradient(115deg, #f8f4ed 0 58%, #efe5da 58% 100%);
}
.hero::before { content: ""; position: absolute; left: -90px; bottom: -130px; width: 290px; height: 290px; border: 1px solid rgba(184, 81, 74, .14); border-radius: 50%; }
.eyebrow { display: flex; align-items: center; gap: 11px; margin: 0 0 25px; color: #9c6a60; font-size: 11px; font-weight: 700; letter-spacing: .24em; }
.eyebrow span { width: 34px; height: 1px; background: currentColor; }
h1, h2, h3, p { margin-top: 0; }
.hero h1, .section-heading h2, .vow-copy h2 {
  margin-bottom: 28px; font-family: "Noto Serif SC", "Songti SC", serif; font-size: clamp(46px, 5.2vw, 78px);
  line-height: 1.22; letter-spacing: -.06em; font-weight: 600;
}
.hero h1 em { color: #b8514a; font-style: normal; }
.hero-description { color: #7a6964; font-size: 16px; line-height: 2; white-space: pre-line; }
.hero-actions { display: flex; align-items: center; gap: 32px; margin-top: 42px; }
.primary-button { padding: 15px 25px; border-radius: 999px; cursor: pointer; transition: transform .2s ease, background .2s ease; }
.primary-button { color: #fff; border: 1px solid #b8514a; background: #b8514a; box-shadow: 0 12px 30px rgba(184, 81, 74, .18); }
.primary-button span { margin-left: 12px; }
.primary-button:hover { transform: translateY(-2px); }
.text-button { padding: 8px 0; color: #5d4d48; border: 0; border-bottom: 1px solid #c6a39c; background: none; cursor: pointer; }
.hero-visual { position: relative; min-height: 500px; display: grid; place-items: center; }
.love-card {
  position: relative; z-index: 2; width: min(360px, 78vw); aspect-ratio: .86; padding: 58px 30px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  color: #f8efe9; text-align: center; background: #b8514a; border-radius: 49% 49% 40px 40px;
  box-shadow: 0 30px 70px rgba(87, 48, 42, .2); transform: rotate(2deg);
}
.love-card::after { content: "♡"; position: absolute; top: 28px; right: 34px; color: rgba(255,255,255,.55); font-size: 25px; }
.card-label { font-size: 9px; font-weight: 700; letter-spacing: .22em; }
.love-card strong { margin: 18px 0 -5px; font-family: "DM Serif Display", Georgia, serif; font-size: 112px; line-height: 1; font-weight: 400; }
.days-label { font-size: 11px; letter-spacing: .36em; }
.together-clock { display: flex; align-items: center; gap: 7px; margin-top: 19px; font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace; font-size: 19px; font-variant-numeric: tabular-nums; letter-spacing: .04em; }
.together-clock span { width: 25px; }
.together-clock i { color: rgba(255,255,255,.55); font-style: normal; animation: clock-pulse 1s steps(1, end) infinite; }
.clock-label { margin-top: 5px; color: rgba(255,255,255,.58); font-size: 6px; letter-spacing: .12em; }
.card-divider { width: 42px; height: 1px; margin: 23px 0 19px; background: rgba(255,255,255,.45); }
.love-card p { margin: 0; font-family: "Noto Serif SC", serif; font-size: 13px; letter-spacing: .16em; }
.orbit { position: absolute; border: 1px solid rgba(106, 73, 65, .16); border-radius: 50%; }
.orbit-one { width: 480px; height: 480px; }
.orbit-two { width: 590px; height: 360px; transform: rotate(-24deg); }
.floating-note { position: absolute; z-index: 3; padding: 12px 18px; background: rgba(255,255,255,.78); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,.75); border-radius: 999px; color: #6d5953; font-size: 12px; box-shadow: 0 12px 30px rgba(91,65,59,.08); }
.note-top { top: 47px; right: 2%; }
.note-bottom { left: 0; bottom: 70px; }
.spark { position: absolute; color: #c78578; }
.spark-one { top: 60px; left: 10%; font-size: 22px; }
.spark-two { right: 7%; bottom: 67px; font-size: 13px; }

.promise { min-height: 235px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #f4f8fb; text-align: center; background: #365d7e; }
.promise p { margin-bottom: 24px; font-family: "Noto Serif SC", serif; font-size: clamp(20px, 2.5vw, 32px); letter-spacing: .06em; }
.promise span { color: rgba(255,255,255,.52); font-size: 9px; letter-spacing: .34em; }

.story { padding-top: 120px; padding-bottom: 130px; background: #fbf8f3; }
.section-heading { display: grid; grid-template-columns: 1fr .72fr; align-items: end; gap: 12vw; margin-bottom: 0; }
.section-heading h2, .vow-copy h2 { margin-bottom: 0; font-size: clamp(38px, 4.2vw, 62px); }
.section-intro { max-width: 380px; margin-bottom: 8px; color: #86746f; line-height: 1.9; }
.footprints { padding-top: 120px; padding-bottom: 130px; background: #f0f5f7; }
.eyebrow.blue { color: #527b9d; }
.map-heading .section-intro { color: #6f818c; }
.footprint-stats { display: grid; grid-template-columns: repeat(5, minmax(58px, 1fr)); align-self: end; min-width: min(100%, 500px); border-top: 1px solid color-mix(in srgb, var(--blue, #527b9d) 34%, transparent); border-bottom: 1px solid color-mix(in srgb, var(--blue, #527b9d) 22%, transparent); }
.footprint-stats div { min-width: 0; padding: 17px 10px 15px; text-align: center; border-right: 1px solid color-mix(in srgb, var(--blue, #527b9d) 18%, transparent); }
.footprint-stats div:last-child { border-right: 0; }
.footprint-stats strong { display: block; color: var(--blue-deep, #365d7e); font-family: "DM Serif Display", Georgia, serif; font-size: clamp(25px, 2.4vw, 36px); font-weight: 400; line-height: 1; }
.footprint-stats span { display: block; margin-top: 7px; color: var(--text-muted, #6f818c); font-size: 10px; letter-spacing: .12em; }

.vow-section { min-height: 570px; padding-top: 100px; padding-bottom: 100px; display: grid; grid-template-columns: .72fr 1.28fr; align-items: center; gap: clamp(50px, 8vw, 120px); color: #f7eee8; background: #aa514c; }
.eyebrow.light { color: #edc7bd; }
.vow-copy h2 { font-size: clamp(38px, 3.65vw, 56px); letter-spacing: -.04em; }
.vow-copy > p:not(.eyebrow) { max-width: 420px; margin-top: 30px; color: rgba(255,255,255,.72); line-height: 1.9; }
.vow-barrage-wrap { min-width: 0; width: 100%; }

.footer { min-height: 180px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 20px; color: #796963; background: #f2ebe3; font-size: 12px; }
.footer p { margin: 0; font-family: Georgia, serif; font-style: italic; }
.footer > span:last-child { text-align: right; }
.footer-visitors { position: relative; justify-self: start; }
.footer-counter { display: block; padding: 6px; overflow: hidden; background: rgba(255,255,255,.72); border: 1px solid rgba(54,93,126,.18); border-radius: 9px; box-shadow: 0 8px 24px rgba(54,93,126,.08); }
.footer-counter-map img { display: block; width: 190px; max-width: 100%; height: auto; border: 0; border-radius: 4px; }
.footer-counter-legacy { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; pointer-events: none; }
.footer-counter-legacy img { width: 1px; height: 1px; }

.modal-backdrop { position: fixed; z-index: 50; inset: 0; padding: 24px; display: grid; place-items: center; background: rgba(38, 29, 27, .54); backdrop-filter: blur(6px); }
.love-letter { position: relative; width: min(520px, 100%); padding: clamp(38px, 7vw, 70px); color: #463733; background: #fffaf3; box-shadow: 0 30px 90px rgba(31,20,18,.25); transform: rotate(-1deg); }
.love-letter::before { content: ""; position: absolute; inset: 14px; border: 1px solid #e6d7cb; pointer-events: none; }
.letter-date { color: #b6786c; font-size: 9px; letter-spacing: .25em; }
.love-letter h2 { margin: 25px 0; font-family: "Noto Serif SC", serif; font-size: 30px; }
.love-letter p { color: #776660; line-height: 2; }
.love-letter strong { display: block; margin-top: 30px; color: #a34c47; text-align: right; font-family: "Noto Serif SC", serif; font-weight: 600; }
.modal-close { position: absolute; z-index: 2; top: 20px; right: 22px; width: 34px; height: 34px; color: #7f6b65; border: 0; background: none; font-size: 27px; cursor: pointer; }
.fade-enter-active, .fade-leave-active { transition: opacity .25s ease, transform .25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

main section[id] { scroll-margin-top: 78px; }
.hero-copy > * { animation: rise-in .75s cubic-bezier(.2, .7, .2, 1) both; }
.hero-copy > :nth-child(2) { animation-delay: .08s; }
.hero-copy > :nth-child(3) { animation-delay: .16s; }
.hero-copy > :nth-child(4) { animation-delay: .24s; }
.hero-visual { animation: rise-in .9s .18s cubic-bezier(.2, .7, .2, 1) both; }
.love-card { animation: card-float 6s ease-in-out infinite; }
.orbit-one { animation: orbit-spin 60s linear infinite; }
.orbit-one::after {
  content: "";
  position: absolute;
  top: 42px;
  left: 48px;
  width: 8px;
  height: 8px;
  background: var(--red);
  border-radius: 50%;
  box-shadow: 0 0 0 6px rgba(184, 81, 74, .1);
}
.orbit-two { animation: orbit-breathe 8s ease-in-out infinite; }
.floating-note { animation: note-drift 5s ease-in-out infinite; }
.note-bottom { animation-delay: -2.5s; }
.spark { animation: sparkle 2.8s ease-in-out infinite; }
.spark-two { animation-delay: -1.4s; }
[data-reveal] { opacity: 0; transform: translateY(24px); transition: opacity .75s ease, transform .75s cubic-bezier(.2, .7, .2, 1); }
[data-reveal].is-visible { opacity: 1; transform: translateY(0); }

@keyframes rise-in {
  from { opacity: 0; transform: translateY(22px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes card-float {
  0%, 100% { transform: rotate(2deg) translateY(0); }
  50% { transform: rotate(1deg) translateY(-9px); }
}
@keyframes orbit-spin {
  to { transform: rotate(360deg); }
}
@keyframes orbit-breathe {
  0%, 100% { transform: rotate(-24deg) scale(1); }
  50% { transform: rotate(-20deg) scale(1.025); }
}
@keyframes note-drift {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-7px); }
}
@keyframes sparkle {
  0%, 100% { opacity: .35; transform: scale(.8) rotate(0); }
  50% { opacity: 1; transform: scale(1.15) rotate(15deg); }
}
@keyframes clock-pulse {
  50% { opacity: .35; }
}

.theme-dark .topbar { background: rgba(17, 23, 29, .7); }
.theme-dark .topbar.scrolled { border-color: rgba(255, 255, 255, .08); background: rgba(17, 23, 29, .92); box-shadow: 0 8px 34px rgba(0, 0, 0, .24); }
.theme-dark .brand-mark span,
.theme-dark .nav button:hover,
.theme-dark .hero h1 em { color: #d4746e; }
.theme-dark .nav button { color: #c9c3bd; }
.theme-dark .nav .language-toggle { color: #a9cee7; border-color: rgba(126, 169, 200, .34); }
.theme-dark .nav .language-toggle:hover { color: #11171d; border-color: #a9cee7; background: #a9cee7; }
.theme-dark .nav .nav-pill { color: #fff; background: #b85f5a; }
.theme-dark .nav .theme-toggle { color: #e5c285; border-color: rgba(229, 194, 133, .34); }
.theme-dark .nav .theme-toggle:hover { color: #11171d; border-color: #e5c285; background: #e5c285; }
.theme-dark .menu-toggle span { background: #e8e2dc; }
.theme-dark .hero {
  background:
    radial-gradient(circle at 83% 10%, rgba(158, 73, 70, .2), transparent 27%),
    linear-gradient(115deg, #11171d 0 58%, #18232c 58% 100%);
}
.theme-dark .hero::before { border-color: rgba(212, 116, 110, .18); }
.theme-dark .eyebrow { color: #c4867e; }
.theme-dark .hero-description,
.theme-dark .section-intro { color: #aaa29d; }
.theme-dark .text-button { color: #d1c9c3; border-color: #755955; }
.theme-dark .orbit { border-color: rgba(176, 199, 215, .16); }
.theme-dark .floating-note { color: #d9d2cc; border-color: rgba(255, 255, 255, .08); background: rgba(31, 42, 51, .82); box-shadow: 0 12px 30px rgba(0, 0, 0, .2); }
.theme-dark .promise { color: #eef4f7; background: #263f52; }
.theme-dark .story { background: var(--surface-story); }
.theme-dark .footprints { background: var(--surface-map); }
.theme-dark .vow-section { color: #fbf1ed; background: #713d42; }
.theme-dark .footer { color: #aaa29d; background: var(--surface-footer); }
.theme-dark .footer-counter { background: rgba(241,245,247,.94); border-color: rgba(126,169,200,.3); box-shadow: 0 10px 28px rgba(0,0,0,.2); }
.theme-dark .love-letter { color: #ded6d0; background: #20272c; box-shadow: 0 30px 90px rgba(0, 0, 0, .5); }
.theme-dark .love-letter::before { border-color: #46515a; }
.theme-dark .love-letter p { color: #b9b1ab; }
.theme-dark .modal-close { color: #c4bbb4; }

@media (max-width: 1050px) {
  .topbar { height: 82px; }
  .brand-copy { display: none; }
  .menu-toggle { display: block; }
  .nav { position: absolute; top: 70px; right: 22px; min-width: 190px; padding: 16px; display: none; flex-direction: column; align-items: stretch; gap: 2px; background: rgba(255,250,245,.96); border: 1px solid rgba(80,54,48,.1); box-shadow: 0 18px 45px rgba(58,40,35,.12); }
  .nav.open { display: flex; }
  .nav button { padding: 12px 14px; text-align: left; }
  .nav .nav-pill { margin-top: 5px; text-align: center; }
  .nav .language-toggle { margin-top: 5px; text-align: center; }
  .nav .theme-toggle { width: 100%; height: 42px; margin-top: 5px; border-radius: 999px; }
  .theme-dark .nav { border-color: rgba(255,255,255,.08); background: rgba(24, 32, 39, .98); box-shadow: 0 18px 45px rgba(0,0,0,.3); }
  .hero { min-height: auto; padding-top: 130px; grid-template-columns: 1fr; gap: 55px; background: radial-gradient(circle at 90% 6%, rgba(230,181,167,.33), transparent 26%), #f8f4ed; }
.hero-copy { text-align: center; }
  .eyebrow, .hero-actions { justify-content: center; }
  .hero-visual { min-height: 480px; }
  .vow-section { grid-template-columns: 1fr; gap: 48px; }
  .vow-copy { text-align: center; }
  .vow-copy .eyebrow { justify-content: center; }
  .vow-copy > p:not(.eyebrow) { margin-left: auto; margin-right: auto; }
}

@media (max-width: 600px) {
  .desktop-only { display: none; }
  .hero { padding-bottom: 65px; }
  .hero h1 { font-size: 42px; }
  .hero-description { font-size: 14px; }
  .hero-actions { flex-direction: column; gap: 20px; margin-top: 32px; }
  .hero-visual { min-height: 420px; }
  .love-card { width: 280px; padding: 42px 24px; }
  .love-card strong { font-size: 86px; }
  .orbit-one { width: 350px; height: 350px; }
  .orbit-two { width: 390px; height: 270px; }
  .note-top { top: 28px; right: -5px; }
  .note-bottom { left: -5px; bottom: 38px; }
  .promise { min-height: 190px; }
  .story { padding-top: 82px; padding-bottom: 85px; }
  .section-heading { grid-template-columns: 1fr; gap: 26px; }
  .footprint-stats { width: 100%; min-width: 0; }
  .footprint-stats div { padding-left: 5px; padding-right: 5px; }
  .section-heading h2, .vow-copy h2 { font-size: 38px; }
  .footprints { padding-top: 82px; padding-bottom: 85px; }
  .vow-section { padding-top: 80px; padding-bottom: 80px; }
  .footer { padding-top: 42px; padding-bottom: 42px; grid-template-columns: 1fr; justify-items: center; text-align: center; }
  .footer > span:last-child { text-align: center; }
  .footer-visitors { justify-self: center; }
}

@media (prefers-reduced-motion: reduce) {
  :global(html) { scroll-behavior: auto; }
  * { transition: none !important; }
  .hero-copy > *, .hero-visual, .love-card, .orbit-one, .orbit-two, .floating-note, .spark, .together-clock i { animation: none !important; }
  [data-reveal] { opacity: 1; transform: none; }
}
</style>

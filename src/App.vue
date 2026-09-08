<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import sunsetPhoto from "./assets/memory-sunset.jpg";

type Memory = {
  date: string;
  title: string;
  description: string;
  tone: "rose" | "amber" | "sage";
  image?: string;
};

const relationshipStartedAt = new Date("2024-05-20T00:00:00+08:00");
const now = ref(new Date());
const menuOpen = ref(false);
const noteOpen = ref(false);
const toast = ref("");
let clock: number | undefined;
let toastTimer: number | undefined;

const memories: Memory[] = [
  {
    date: "2024 · 05 · 20",
    title: "故事，从这一天开始",
    description: "晚风、散步和一句认真说出口的喜欢，让平常的一天有了新的名字。",
    tone: "rose",
  },
  {
    date: "2025 · 04 · 10",
    title: "一起追过的日落",
    description: "相机留下了光，而我们记住了彼此笑起来的样子。",
    tone: "amber",
    image: sunsetPhoto,
  },
  {
    date: "2026 · 05 · 20",
    title: "第二个纪念日",
    description: "日子缓慢向前，爱意却在每一顿饭、每一次分享里悄悄生长。",
    tone: "sage",
  },
];

const dayCount = computed(() => {
  const elapsed = now.value.getTime() - relationshipStartedAt.getTime();
  return Math.max(1, Math.floor(elapsed / 86_400_000) + 1);
});

const nextAnniversary = computed(() => {
  const year = now.value.getFullYear();
  let target = new Date(`${year}-05-20T00:00:00+08:00`);
  if (target.getTime() <= now.value.getTime()) {
    target = new Date(`${year + 1}-05-20T00:00:00+08:00`);
  }
  return Math.ceil((target.getTime() - now.value.getTime()) / 86_400_000);
});

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  menuOpen.value = false;
}

function showToast(message: string) {
  toast.value = message;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => (toast.value = ""), 2400);
}

onMounted(() => {
  clock = window.setInterval(() => (now.value = new Date()), 60_000);
});

onBeforeUnmount(() => {
  window.clearInterval(clock);
  window.clearTimeout(toastTimer);
});
</script>

<template>
  <div class="site-shell">
    <header class="topbar">
      <button class="brand" type="button" aria-label="返回首页" @click="scrollToSection('home')">
        <span class="brand-mark">Y<span>♡</span>Z</span>
        <span class="brand-copy">我们的爱情空间</span>
      </button>

      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="menuOpen"
        aria-label="打开导航"
        @click="menuOpen = !menuOpen"
      >
        <span></span><span></span>
      </button>

      <nav :class="['nav', { open: menuOpen }]" aria-label="主导航">
        <button type="button" @click="scrollToSection('home')">首页</button>
        <button type="button" @click="scrollToSection('story')">我们的故事</button>
        <button type="button" @click="scrollToSection('wishlist')">小小愿望</button>
        <button class="nav-pill" type="button" @click="noteOpen = true">写给你</button>
      </nav>
    </header>

    <main>
      <section id="home" class="hero section-pad">
        <div class="hero-copy">
          <p class="eyebrow"><span></span> YY & ZZ · LOVE SPACE</p>
          <h1>把普通的日子，<br /><em>过成我们的故事。</em></h1>
          <p class="hero-description">
            这里收藏两个人的微小幸福：一次散步、一顿晚饭，<br class="desktop-only" />
            还有每个想起你就会微笑的瞬间。
          </p>
          <div class="hero-actions">
            <button class="primary-button" type="button" @click="scrollToSection('story')">
              翻开我们的故事 <span>↘</span>
            </button>
            <button class="text-button" type="button" @click="noteOpen = true">读一封小情书</button>
          </div>
        </div>

        <div class="hero-visual" aria-label="在一起的时间">
          <div class="orbit orbit-one"></div>
          <div class="orbit orbit-two"></div>
          <div class="love-card">
            <span class="card-label">WE HAVE BEEN TOGETHER</span>
            <strong>{{ dayCount }}</strong>
            <span class="days-label">DAYS</span>
            <div class="card-divider"></div>
            <p>自 2024.05.20 起</p>
          </div>
          <div class="floating-note note-top">永远对彼此好奇 ✦</div>
          <div class="floating-note note-bottom">下一纪念日 · {{ nextAnniversary }} 天</div>
          <span class="spark spark-one">✦</span>
          <span class="spark spark-two">✦</span>
        </div>
      </section>

      <section class="promise section-pad" aria-label="爱情寄语">
        <p>“世界很大，幸福很小。有你在身边，刚刚好。”</p>
        <span>OUR LITTLE UNIVERSE</span>
      </section>

      <section id="story" class="story section-pad">
        <div class="section-heading">
          <div>
            <p class="eyebrow"><span></span> OUR STORY</p>
            <h2>时间把喜欢，<br />写成了日常。</h2>
          </div>
          <p class="section-intro">不追求轰轰烈烈，只想把每一个值得记住的片刻，好好放在这里。</p>
        </div>

        <div class="timeline">
          <article v-for="(memory, index) in memories" :key="memory.date" class="memory-card">
            <div :class="['memory-art', `tone-${memory.tone}`]">
              <img v-if="memory.image" :src="memory.image" :alt="memory.title" />
              <div class="memory-number">0{{ index + 1 }}</div>
              <span v-if="!memory.image" class="memory-symbol">{{ index === 0 ? '♡' : '∞' }}</span>
            </div>
            <div class="memory-copy">
              <time>{{ memory.date }}</time>
              <h3>{{ memory.title }}</h3>
              <p>{{ memory.description }}</p>
            </div>
          </article>
        </div>
      </section>

      <section id="wishlist" class="wishlist section-pad">
        <div class="wish-copy">
          <p class="eyebrow light"><span></span> OUR WISH LIST</p>
          <h2>还有好多以后，<br />想和你一起。</h2>
          <p>愿望不必宏大。只要在实现它们的时候，身边的人还是你。</p>
          <button class="outline-button" type="button" @click="showToast('新的愿望，已经替你留好位置啦 ♡')">
            + 添加一个愿望
          </button>
        </div>

        <div class="wish-list">
          <button type="button" @click="showToast('一起去看海，约定好了！')">
            <span>01</span><strong>去一座陌生的海边城市</strong><i>↗</i>
          </button>
          <button type="button" @click="showToast('今年也要记得多拍照片。')">
            <span>02</span><strong>拍满一本属于我们的相册</strong><i>↗</i>
          </button>
          <button type="button" @click="showToast('把家布置成喜欢的样子。')">
            <span>03</span><strong>拥有一间阳光很好的小屋</strong><i>↗</i>
          </button>
        </div>
      </section>
    </main>

    <footer class="footer section-pad">
      <span class="footer-heart">♡</span>
      <p>Made with love, for YY & ZZ.</p>
      <span>© {{ now.getFullYear() }} · 我们的爱情空间</span>
    </footer>

    <Transition name="fade">
      <div v-if="noteOpen" class="modal-backdrop" role="presentation" @click.self="noteOpen = false">
        <article class="love-letter" role="dialog" aria-modal="true" aria-label="写给你的信">
          <button class="modal-close" type="button" aria-label="关闭" @click="noteOpen = false">×</button>
          <span class="letter-date">TO MY FAVORITE PERSON</span>
          <h2>见字如面：</h2>
          <p>谢谢你来到我的生命里，让重复的日子有了不同的颜色。</p>
          <p>以后也一起吃好多顿饭，看好多次日落，在每一个普通的明天里继续喜欢彼此。</p>
          <strong>爱你的人，ZZ ♡</strong>
        </article>
      </div>
    </Transition>

    <Transition name="toast">
      <div v-if="toast" class="toast-message">{{ toast }}</div>
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
}
:global(button) { font: inherit; }

.site-shell { min-height: 100vh; overflow: hidden; }
.section-pad { padding-left: clamp(24px, 7vw, 112px); padding-right: clamp(24px, 7vw, 112px); }
.topbar {
  position: absolute; z-index: 20; top: 0; left: 0; width: 100%; height: 104px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 clamp(24px, 7vw, 112px); border-bottom: 1px solid rgba(70, 49, 43, .09);
}
.brand { display: flex; align-items: center; gap: 14px; color: inherit; border: 0; background: none; cursor: pointer; }
.brand-mark { font-family: "DM Serif Display", Georgia, serif; font-size: 29px; letter-spacing: -.08em; }
.brand-mark span { color: #b8514a; font-size: 21px; margin: 0 3px; }
.brand-copy { font-family: "Noto Serif SC", serif; font-size: 13px; letter-spacing: .2em; }
.nav { display: flex; align-items: center; gap: clamp(22px, 3vw, 44px); }
.nav button { color: #5b4a45; border: 0; background: none; font-size: 14px; cursor: pointer; transition: color .2s ease; }
.nav button:hover { color: #b8514a; }
.nav .nav-pill { padding: 11px 21px; color: #fff; background: #4f6b5a; border-radius: 999px; }
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
.hero h1, .section-heading h2, .wish-copy h2 {
  margin-bottom: 28px; font-family: "Noto Serif SC", "Songti SC", serif; font-size: clamp(46px, 5.2vw, 78px);
  line-height: 1.22; letter-spacing: -.06em; font-weight: 600;
}
.hero h1 em { color: #b8514a; font-style: normal; }
.hero-description { color: #7a6964; font-size: 16px; line-height: 2; }
.hero-actions { display: flex; align-items: center; gap: 32px; margin-top: 42px; }
.primary-button, .outline-button { padding: 15px 25px; border-radius: 999px; cursor: pointer; transition: transform .2s ease, background .2s ease; }
.primary-button { color: #fff; border: 1px solid #b8514a; background: #b8514a; box-shadow: 0 12px 30px rgba(184, 81, 74, .18); }
.primary-button span { margin-left: 12px; }
.primary-button:hover, .outline-button:hover { transform: translateY(-2px); }
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
.card-divider { width: 42px; height: 1px; margin: 31px 0 19px; background: rgba(255,255,255,.45); }
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

.promise { min-height: 235px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #f7eee8; text-align: center; background: #4f6b5a; }
.promise p { margin-bottom: 24px; font-family: "Noto Serif SC", serif; font-size: clamp(20px, 2.5vw, 32px); letter-spacing: .06em; }
.promise span { color: rgba(255,255,255,.52); font-size: 9px; letter-spacing: .34em; }

.story { padding-top: 120px; padding-bottom: 130px; background: #fbf8f3; }
.section-heading { display: grid; grid-template-columns: 1fr .72fr; align-items: end; gap: 12vw; margin-bottom: 72px; }
.section-heading h2, .wish-copy h2 { margin-bottom: 0; font-size: clamp(38px, 4.2vw, 62px); }
.section-intro { max-width: 380px; margin-bottom: 8px; color: #86746f; line-height: 1.9; }
.timeline { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.memory-card { min-width: 0; }
.memory-art { position: relative; aspect-ratio: 1.18; overflow: hidden; border-radius: 3px; }
.memory-art img { width: 100%; height: 100%; object-fit: cover; filter: saturate(.75) sepia(.12); transition: transform .5s ease; }
.memory-card:hover img { transform: scale(1.035); }
.tone-rose { background: linear-gradient(135deg, #ddb0a5, #a84d49); }
.tone-amber { background: #d0a474; }
.tone-sage { background: linear-gradient(145deg, #aab9a5, #52705e); }
.memory-number { position: absolute; top: 18px; left: 20px; color: rgba(255,255,255,.8); font-family: Georgia, serif; font-size: 13px; letter-spacing: .12em; }
.memory-symbol { position: absolute; inset: 0; display: grid; place-items: center; color: rgba(255,255,255,.78); font-family: Georgia, serif; font-size: 82px; font-weight: 300; }
.memory-copy { padding: 25px 4px; }
.memory-copy time { color: #b17b70; font-size: 10px; font-weight: 700; letter-spacing: .2em; }
.memory-copy h3 { margin: 12px 0 11px; font-family: "Noto Serif SC", serif; font-size: 21px; font-weight: 600; }
.memory-copy p { margin: 0; color: #887670; font-size: 14px; line-height: 1.8; }

.wishlist { min-height: 570px; padding-top: 100px; padding-bottom: 100px; display: grid; grid-template-columns: .8fr 1.2fr; gap: 10vw; color: #f7eee8; background: #aa514c; }
.eyebrow.light { color: #edc7bd; }
.wish-copy > p:not(.eyebrow) { max-width: 420px; color: rgba(255,255,255,.7); line-height: 1.9; }
.outline-button { margin-top: 25px; color: #fff; border: 1px solid rgba(255,255,255,.46); background: transparent; }
.outline-button:hover { background: rgba(255,255,255,.08); }
.wish-list { align-self: center; border-top: 1px solid rgba(255,255,255,.22); }
.wish-list button { width: 100%; padding: 28px 4px; display: grid; grid-template-columns: 50px 1fr auto; align-items: center; gap: 18px; color: inherit; text-align: left; border: 0; border-bottom: 1px solid rgba(255,255,255,.22); background: transparent; cursor: pointer; }
.wish-list span { color: rgba(255,255,255,.45); font-size: 11px; }
.wish-list strong { font-family: "Noto Serif SC", serif; font-size: clamp(16px, 1.5vw, 21px); font-weight: 500; }
.wish-list i { font-size: 20px; font-style: normal; transition: transform .2s ease; }
.wish-list button:hover i { transform: translate(3px, -3px); }

.footer { min-height: 180px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 20px; color: #796963; background: #f2ebe3; font-size: 12px; }
.footer p { margin: 0; font-family: Georgia, serif; font-style: italic; }
.footer > span:last-child { text-align: right; }
.footer-heart { color: #b8514a; font-family: Georgia, serif; font-size: 32px; }

.modal-backdrop { position: fixed; z-index: 50; inset: 0; padding: 24px; display: grid; place-items: center; background: rgba(38, 29, 27, .54); backdrop-filter: blur(6px); }
.love-letter { position: relative; width: min(520px, 100%); padding: clamp(38px, 7vw, 70px); color: #463733; background: #fffaf3; box-shadow: 0 30px 90px rgba(31,20,18,.25); transform: rotate(-1deg); }
.love-letter::before { content: ""; position: absolute; inset: 14px; border: 1px solid #e6d7cb; pointer-events: none; }
.letter-date { color: #b6786c; font-size: 9px; letter-spacing: .25em; }
.love-letter h2 { margin: 25px 0; font-family: "Noto Serif SC", serif; font-size: 30px; }
.love-letter p { color: #776660; line-height: 2; }
.love-letter strong { display: block; margin-top: 30px; color: #a34c47; text-align: right; font-family: "Noto Serif SC", serif; font-weight: 600; }
.modal-close { position: absolute; z-index: 2; top: 20px; right: 22px; width: 34px; height: 34px; color: #7f6b65; border: 0; background: none; font-size: 27px; cursor: pointer; }
.toast-message { position: fixed; z-index: 60; left: 50%; bottom: 34px; padding: 13px 22px; color: #fff; background: #3f5046; border-radius: 999px; box-shadow: 0 10px 35px rgba(0,0,0,.16); font-size: 13px; transform: translateX(-50%); }
.fade-enter-active, .fade-leave-active, .toast-enter-active, .toast-leave-active { transition: opacity .25s ease, transform .25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 12px); }

@media (max-width: 900px) {
  .topbar { height: 82px; }
  .brand-copy { display: none; }
  .menu-toggle { display: block; }
  .nav { position: absolute; top: 70px; right: 22px; min-width: 190px; padding: 16px; display: none; flex-direction: column; align-items: stretch; gap: 2px; background: rgba(255,250,245,.96); border: 1px solid rgba(80,54,48,.1); box-shadow: 0 18px 45px rgba(58,40,35,.12); }
  .nav.open { display: flex; }
  .nav button { padding: 12px 14px; text-align: left; }
  .nav .nav-pill { margin-top: 5px; text-align: center; }
  .hero { min-height: auto; padding-top: 130px; grid-template-columns: 1fr; gap: 55px; background: radial-gradient(circle at 90% 6%, rgba(230,181,167,.33), transparent 26%), #f8f4ed; }
  .hero-copy { text-align: center; }
  .eyebrow, .hero-actions { justify-content: center; }
  .hero-visual { min-height: 480px; }
  .timeline { grid-template-columns: 1fr 1fr; }
  .memory-card:last-child { grid-column: 1 / -1; max-width: calc(50% - 12px); }
  .wishlist { grid-template-columns: 1fr; gap: 55px; }
  .wish-copy { text-align: center; }
  .wish-copy .eyebrow { justify-content: center; }
  .wish-copy > p:not(.eyebrow) { margin-left: auto; margin-right: auto; }
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
  .section-heading { grid-template-columns: 1fr; gap: 26px; margin-bottom: 48px; }
  .section-heading h2, .wish-copy h2 { font-size: 38px; }
  .timeline { grid-template-columns: 1fr; gap: 10px; }
  .memory-card:last-child { grid-column: auto; max-width: none; }
  .wishlist { padding-top: 80px; padding-bottom: 80px; }
  .wish-list button { grid-template-columns: 34px 1fr auto; gap: 10px; }
  .footer { padding-top: 42px; padding-bottom: 42px; grid-template-columns: 1fr; justify-items: center; text-align: center; }
  .footer > span:last-child { text-align: center; }
}

@media (prefers-reduced-motion: reduce) {
  :global(html) { scroll-behavior: auto; }
  * { transition: none !important; }
}
</style>

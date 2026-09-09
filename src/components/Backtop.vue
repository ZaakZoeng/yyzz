<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const visible = ref(false);

function updateVisibility() {
  visible.value = window.scrollY > 560;
}

function backToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

onMounted(() => {
  updateVisibility();
  window.addEventListener("scroll", updateVisibility, { passive: true });
});

onBeforeUnmount(() => window.removeEventListener("scroll", updateVisibility));
</script>

<template>
  <Transition name="backtop">
    <button v-if="visible" class="backtop" type="button" aria-label="返回页面顶部" @click="backToTop">
      <span aria-hidden="true">↑</span>
      <small>TOP</small>
    </button>
  </Transition>
</template>

<style scoped>
.backtop {
  position: fixed;
  z-index: 35;
  right: clamp(18px, 3vw, 42px);
  bottom: clamp(18px, 3vw, 38px);
  width: 52px;
  height: 52px;
  display: grid;
  place-content: center;
  gap: 1px;
  color: var(--backtop-color, #fff);
  background: var(--backtop-bg, #365d7e);
  border: 1px solid var(--backtop-border, rgba(255, 255, 255, .28));
  border-radius: 50%;
  box-shadow: 0 12px 30px rgba(15, 30, 43, .2);
  cursor: pointer;
  transition: transform .25s ease, background .25s ease, box-shadow .25s ease;
}
.backtop:hover { transform: translateY(-4px); box-shadow: 0 16px 36px rgba(15, 30, 43, .27); }
.backtop span { font-size: 18px; line-height: 1; }
.backtop small { font-size: 7px; letter-spacing: .13em; }
.backtop-enter-active, .backtop-leave-active { transition: opacity .25s ease, transform .25s ease; }
.backtop-enter-from, .backtop-leave-to { opacity: 0; transform: translateY(12px) scale(.9); }

@media (max-width: 600px) {
  .backtop { width: 46px; height: 46px; }
}
@media (prefers-reduced-motion: reduce) {
  .backtop, .backtop-enter-active, .backtop-leave-active { transition: none; }
}
</style>

<script setup lang="ts">
import { computed, ref } from "vue";
import { journeyMemories } from "../data/journey";

const activeYear = ref("all");
const expanded = ref(false);
const failedImages = ref(new Set<string>());

const years = computed(() =>
  [...new Set(journeyMemories.map((memory) => memory.date.slice(0, 4)))].reverse(),
);

const visibleMemories = computed(() => {
  if (activeYear.value !== "all") {
    return journeyMemories.filter((memory) => memory.date.startsWith(activeYear.value));
  }

  return expanded.value
    ? journeyMemories
    : journeyMemories.filter((memory) => memory.featured);
});

function selectYear(year: string) {
  activeYear.value = year;
  expanded.value = false;
}

function markImageAsFailed(src: string) {
  failedImages.value = new Set([...failedImages.value, src]);
}
</script>

<template>
  <div class="timeline-explorer">
    <div class="year-filter" aria-label="按年份筛选爱情点滴">
      <button
        type="button"
        :class="{ active: activeYear === 'all' }"
        :aria-pressed="activeYear === 'all'"
        @click="selectYear('all')"
      >
        精选
      </button>
      <button
        v-for="year in years"
        :key="year"
        type="button"
        :class="{ active: activeYear === year }"
        :aria-pressed="activeYear === year"
        @click="selectYear(year)"
      >
        {{ year }}
      </button>
    </div>

    <div class="timeline" aria-live="polite">
      <article
        v-for="(memory, index) in visibleMemories"
        :key="`${memory.date}-${memory.title}`"
        :class="['timeline-entry', index % 2 === 0 ? 'entry-left' : 'entry-right']"
      >
        <div class="timeline-content">
          <div class="entry-date">
            <time :datetime="memory.date">{{ memory.displayDate }}</time>
            <small>{{ memory.kind }}</small>
          </div>
          <div class="entry-copy">
            <h3>{{ memory.title }}</h3>
            <p>{{ memory.city }}<template v-if="memory.place"> · {{ memory.place }}</template></p>
          </div>
          <figure v-if="memory.image" class="memory-photo">
            <div class="memory-photo-frame">
              <img
                v-if="!failedImages.has(memory.image.src)"
                :src="memory.image.src"
                :alt="memory.image.alt"
                :style="{ objectPosition: memory.image.objectPosition || 'center' }"
                loading="lazy"
                decoding="async"
                @error="markImageAsFailed(memory.image.src)"
              />
              <div v-else class="memory-photo-placeholder" role="img" :aria-label="memory.image.alt">
                <span aria-hidden="true">♡</span>
                <p>照片待补充</p>
              </div>
              <span v-if="memory.image.demo" class="demo-label">示例图片</span>
            </div>
            <figcaption v-if="memory.image.caption">{{ memory.image.caption }}</figcaption>
          </figure>
        </div>
        <div class="timeline-node" aria-hidden="true">
          <span>{{ String(index + 1).padStart(2, '0') }}</span>
        </div>
      </article>
    </div>

    <button
      v-if="activeYear === 'all'"
      class="expand-button"
      type="button"
      @click="expanded = !expanded"
    >
      {{ expanded ? '收起完整时间线' : `查看全部 ${journeyMemories.length} 个时刻` }}
      <span aria-hidden="true">{{ expanded ? '↑' : '↓' }}</span>
    </button>
  </div>
</template>

<style scoped>
.timeline-explorer { margin-top: 64px; color: var(--text-main, #302725); }
.year-filter {
  display: flex;
  gap: 8px;
  padding-bottom: 18px;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--blue, #527b9d) 52%, transparent) transparent;
}
.year-filter button {
  flex: 0 0 auto;
  min-width: 58px;
  padding: 9px 15px;
  color: var(--text-muted, #7f6d67);
  border: 1px solid var(--line-color, #dfd5cd);
  border-radius: 999px;
  background: transparent;
  cursor: pointer;
  transition: color .2s ease, border-color .2s ease, background .2s ease;
}
.year-filter button:hover { border-color: var(--blue, #527b9d); color: var(--blue, #365d7e); }
.year-filter button.active { color: #fff; border-color: var(--blue, #527b9d); background: var(--blue, #527b9d); }
.timeline { position: relative; padding: 12px 0; }
.timeline::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  background: var(--line-color, #e4d9d1);
  transform: translateX(-50%);
}
.timeline-entry {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 84px minmax(0, 1fr);
  align-items: center;
  min-height: 126px;
}
.timeline-content {
  position: relative;
  max-width: 460px;
  padding: 25px 0 24px;
  border-bottom: 1px solid var(--line-color, #e4d9d1);
}
.entry-left .timeline-content { grid-column: 1; justify-self: end; width: 100%; padding-right: 28px; text-align: right; }
.entry-right .timeline-content { grid-column: 3; width: 100%; padding-left: 28px; text-align: left; }
.entry-left .timeline-content::after,
.entry-right .timeline-content::before {
  content: "";
  position: absolute;
  bottom: -1px;
  width: 28px;
  height: 1px;
  background: var(--line-color, #e4d9d1);
}
.entry-left .timeline-content::after { right: -28px; }
.entry-right .timeline-content::before { left: -28px; }
.timeline-node {
  position: relative;
  z-index: 1;
  grid-column: 2;
  grid-row: 1;
  justify-self: center;
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  color: var(--red, #a34f4a);
  background: var(--surface-story, #fbf8f3);
  border: 1px solid var(--line-color, #d9c9c1);
  border-radius: 50%;
  font-family: Georgia, serif;
  font-size: 11px;
  transition: color .25s ease, background .25s ease, border-color .25s ease, transform .25s ease;
}
.timeline-entry:hover .timeline-node { color: #fff; background: var(--red, #a34f4a); border-color: var(--red, #a34f4a); transform: scale(1.08); }
.entry-date { display: flex; flex-direction: column; gap: 7px; }
.entry-left .entry-date { align-items: flex-end; }
.entry-right .entry-date { align-items: flex-start; }
.entry-date time { color: var(--red, #a34f4a); font-size: 12px; font-weight: 700; letter-spacing: .08em; }
.entry-date small { color: var(--blue, #879cad); font-size: 10px; letter-spacing: .18em; }
.entry-copy { padding-top: 12px; }
.entry-copy h3 { margin: 0 0 8px; font-family: "Songti SC", "Noto Serif SC", serif; font-size: 21px; font-weight: 600; }
.entry-copy p { margin: 0; color: var(--text-muted, #8b7972); font-size: 13px; }
.memory-photo { width: 100%; margin: 18px 0 0; }
.memory-photo-frame {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--photo-surface, #efe7df);
  border: 1px solid rgba(126, 91, 82, .12);
  border-radius: 16px;
  box-shadow: 0 14px 34px rgba(89, 66, 59, .1);
}
.memory-photo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .45s ease;
}
.memory-photo-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-content: center;
  gap: 8px;
  color: var(--blue, #7893a8);
  text-align: center;
  background:
    radial-gradient(circle at 70% 20%, rgba(184, 81, 74, .12), transparent 28%),
    linear-gradient(145deg, var(--photo-surface, #f2e7df), var(--surface-map, #e5edf1));
}
.memory-photo-placeholder span { color: var(--red, #b8514a); font-family: Georgia, serif; font-size: 30px; }
.memory-photo-placeholder p { margin: 0; font-size: 11px; letter-spacing: .14em; }
.memory-photo:hover img { transform: scale(1.025); }
.demo-label {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 10px;
  color: #fff;
  background: color-mix(in srgb, var(--blue-deep, #365d7e) 88%, transparent);
  border: 1px solid rgba(255, 255, 255, .3);
  border-radius: 999px;
  backdrop-filter: blur(8px);
  font-size: 10px;
  letter-spacing: .12em;
}
.memory-photo figcaption {
  margin-top: 10px;
  color: var(--text-muted, #8b7972);
  font-family: "Noto Serif SC", "Songti SC", serif;
  font-size: 12px;
  line-height: 1.7;
}
.entry-left .memory-photo figcaption { text-align: right; }
.entry-right .memory-photo figcaption { text-align: left; }
.expand-button {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 34px auto 0;
  padding: 13px 22px;
  color: var(--blue, #365d7e);
  border: 1px solid color-mix(in srgb, var(--blue, #9fb4c5) 55%, transparent);
  border-radius: 999px;
  background: transparent;
  cursor: pointer;
  transition: color .25s ease, background .25s ease, transform .25s ease;
}
.expand-button:hover { color: #fff; background: var(--blue, #527b9d); transform: translateY(-2px); }

@media (max-width: 800px) {
  .timeline-explorer { margin-top: 42px; }
  .timeline::before { left: 20px; }
  .timeline-entry { grid-template-columns: 52px minmax(0, 1fr); min-height: 118px; }
  .timeline-node { grid-column: 1; width: 40px; height: 40px; }
  .entry-left .timeline-content,
  .entry-right .timeline-content {
    grid-column: 2;
    justify-self: stretch;
    max-width: none;
    width: 100%;
    padding: 22px 0 21px 18px;
    text-align: left;
  }
  .entry-left .timeline-content::after,
  .entry-right .timeline-content::before { left: -12px; right: auto; width: 30px; }
  .entry-left .entry-date,
  .entry-right .entry-date { flex-direction: row; align-items: center; }
  .entry-left .memory-photo figcaption,
  .entry-right .memory-photo figcaption { text-align: left; }
  .entry-copy { padding-top: 8px; }
  .entry-copy h3 { font-size: 18px; }
}
</style>

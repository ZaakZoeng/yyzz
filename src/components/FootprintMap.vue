<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { geoMercator, geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { Topology } from "topojson-specification";
import worldAtlas from "world-atlas/countries-110m.json";

import { cityCoordinates, getCityName, getMemoryCopy, journeyMemories } from "../data/journey";

type MapMode = "china" | "world";

const { t, locale } = useI18n();

const mode = ref<MapMode>("china");
const selectedCity = ref("深圳");
const mapCanvas = ref<HTMLElement>();
const mapHeight = ref(0);
let mapResizeObserver: ResizeObserver | undefined;

const worldFeatureCollection = feature(
  worldAtlas as unknown as Topology,
  (worldAtlas as unknown as Topology).objects.countries,
) as FeatureCollection<Geometry>;
const worldFeatures = worldFeatureCollection.features as Feature<Geometry>[];

const cityStats = computed(() =>
  cityCoordinates
    .map((coordinate) => ({
      ...coordinate,
      visits: journeyMemories.filter((memory) => memory.city === coordinate.city).length,
      latest: [...journeyMemories]
        .reverse()
        .find((memory) => memory.city === coordinate.city),
    }))
    .filter((city) => city.visits > 0)
    .sort((a, b) => b.visits - a.visits),
);

const projection = computed(() => {
  if (mode.value === "world") {
    return geoNaturalEarth1().scale(160).translate([480, 250]);
  }
  return geoMercator().center([115.3, 29.3]).scale(1050).translate([480, 250]);
});

const countryPaths = computed(() => {
  const path = geoPath(projection.value);
  return worldFeatures.map((country) => path(country) || "");
});

const plottedCities = computed(() =>
  cityStats.value.map((city) => {
    const point = projection.value([city.longitude, city.latitude]) || [0, 0];
    return { ...city, x: point[0], y: point[1] };
  }),
);

const selected = computed(
  () => cityStats.value.find((city) => city.city === selectedCity.value) || cityStats.value[0],
);
const selectedMemories = computed(() =>
  journeyMemories
    .filter((memory) => memory.city === selectedCity.value)
    .sort((a, b) => b.date.localeCompare(a.date)),
);
const selectedImages = computed(() =>
  selectedMemories.value.filter((memory) => memory.image),
);

const sidePanelStyle = computed(() =>
  mapHeight.value ? { height: `${mapHeight.value}px` } : undefined,
);

function memoryCopy(memory: (typeof journeyMemories)[number]) {
  return getMemoryCopy(memory, locale.value);
}

function sharedRecords(count: number) {
  return t(count === 1 ? "footprints.sharedRecord" : "footprints.sharedRecords", { count });
}

function markerLabel(city: string, count: number) {
  return t(count === 1 ? "footprints.markerOne" : "footprints.marker", {
    city: getCityName(city, locale.value),
    count,
  });
}

onMounted(() => {
  if (!mapCanvas.value) return;
  mapResizeObserver = new ResizeObserver(([entry]) => {
    mapHeight.value = Math.round(entry.contentRect.height);
  });
  mapResizeObserver.observe(mapCanvas.value);
});

onBeforeUnmount(() => mapResizeObserver?.disconnect());
</script>

<template>
  <div :class="['footprint-layout', { 'has-memories': selectedImages.length }]">
    <aside class="map-detail" :style="sidePanelStyle" aria-live="polite">
      <span class="detail-label">{{ t('footprints.selectedCity') }}</span>
      <strong>{{ getCityName(selected.city, locale) }}</strong>
      <p>{{ sharedRecords(selected.visits) }}</p>
      <small>{{ t('footprints.latest', { date: selected.latest?.displayDate }) }}</small>
      <div class="city-list" :aria-label="t('footprints.cityList')">
        <button
          v-for="city in cityStats"
          :key="city.city"
          type="button"
          :class="{ active: selectedCity === city.city }"
          @click="selectedCity = city.city"
        >
          {{ getCityName(city.city, locale) }} <span>{{ city.visits }}</span>
        </button>
      </div>
      <p class="privacy-copy">{{ t('footprints.privacy') }}</p>
    </aside>

    <div class="map-panel">
      <div ref="mapCanvas" class="map-canvas">
        <div class="map-modes" :aria-label="t('footprints.mapRange')">
          <button type="button" :class="{ active: mode === 'china' }" @click="mode = 'china'">{{ t('footprints.china') }}</button>
          <button type="button" :class="{ active: mode === 'world' }" @click="mode = 'world'">{{ t('footprints.world') }}</button>
        </div>
        <svg viewBox="0 0 960 500" preserveAspectRatio="none" role="img" aria-labelledby="map-title map-description">
          <title id="map-title">{{ t('footprints.mapTitle') }}</title>
          <desc id="map-description">{{ t('footprints.mapDescription') }}</desc>
          <path v-for="(countryPath, index) in countryPaths" :key="index" :d="countryPath" />
        </svg>

        <button
          v-for="city in plottedCities"
          :key="city.city"
          type="button"
          class="city-marker"
          :class="{ selected: selectedCity === city.city }"
          :style="{
            left: `${(city.x / 960) * 100}%`,
            top: `${(city.y / 500) * 100}%`,
            '--marker-size': `${Math.min(20, 9 + Math.sqrt(city.visits) * 2.3)}px`,
          }"
          :aria-label="markerLabel(city.city, city.visits)"
          @click="selectedCity = city.city"
        >
          <span aria-hidden="true">{{ selectedCity === city.city ? '♥' : '' }}</span>
        </button>
      </div>
    </div>

    <aside v-if="selectedImages.length" class="city-memories" :style="sidePanelStyle" aria-live="polite">
      <div class="memory-heading">
        <span class="detail-label">{{ t('footprints.cityMemories') }}</span>
        <small>{{ t('footprints.photos', { count: selectedImages.length }) }}</small>
      </div>

      <div v-if="selectedImages.length" class="memory-list">
        <figure v-for="memory in selectedImages" :key="`${memory.date}-${memory.title}`">
          <div class="memory-frame">
            <img
              :src="memory.image!.src"
              :alt="memoryCopy(memory).alt"
              :style="{ objectPosition: memory.image!.objectPosition || 'center' }"
              loading="lazy"
              decoding="async"
            />
            <span v-if="memory.image!.demo">{{ t('footprints.demoImage') }}</span>
          </div>
          <figcaption>
            <time :datetime="memory.date">{{ memory.displayDate }}</time>
            <strong>{{ memoryCopy(memory).title }}</strong>
          </figcaption>
        </figure>
      </div>

    </aside>
  </div>
</template>

<style scoped>
.footprint-layout { display: grid; grid-template-columns: 230px minmax(0, 1fr); align-items: start; gap: 24px; margin-top: 60px; }
.footprint-layout.has-memories { grid-template-columns: 230px minmax(0, 1fr) 230px; }
.map-panel { min-width: 0; }
.map-modes { position: absolute; z-index: 4; top: 16px; right: 16px; display: flex; padding: 3px; background: color-mix(in srgb, var(--surface-story, #fff) 88%, transparent); border-radius: 999px; box-shadow: 0 8px 24px rgba(54,93,126,.1); backdrop-filter: blur(8px); }
.map-modes button { padding: 7px 15px; color: var(--text-muted, #647987); border: 0; border-radius: 999px; background: transparent; cursor: pointer; transition: color .2s ease, background .2s ease; }
.map-modes button.active { color: #fff; background: var(--blue, #527b9d); }
.map-canvas { position: relative; width: 100%; aspect-ratio: 1.92; overflow: hidden; background: var(--map-canvas, #e9f0f4); border-radius: 4px; transition: background .35s ease; }
.map-canvas::after { content: ""; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(circle at 60% 45%, transparent, rgba(54,93,126,.08)); }
.map-canvas svg { width: 100%; height: 100%; display: block; }
.map-canvas path { fill: var(--map-country, #d4e0e7); stroke: var(--map-stroke, #f5f1eb); stroke-width: .7; vector-effect: non-scaling-stroke; transition: fill .35s ease, stroke .35s ease; }
.city-marker {
  --marker-size: 12px;
  position: absolute;
  z-index: 2;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  transform: translate(-50%, -50%);
  cursor: pointer;
}
.city-marker.selected { z-index: 5; }
.city-marker span { position: absolute; left: 50%; top: 50%; width: var(--marker-size); height: var(--marker-size); display: grid; place-items: center; color: var(--red, #b6544e); border: 3px solid rgba(255,255,255,.88); border-radius: 50%; background: #b6544e; box-shadow: 0 4px 14px rgba(93,45,42,.3); transform: translate(-50%, -50%); transition: transform .2s ease; }
.city-marker:hover span { transform: translate(-50%, -50%) scale(1.2); }
.city-marker.selected span { width: 30px; height: 30px; color: var(--red, #b6544e); border: 0; background: transparent; box-shadow: none; filter: drop-shadow(0 4px 5px rgba(93,45,42,.25)); -webkit-text-stroke: 3px rgba(255,255,255,.94); paint-order: stroke fill; font-family: Georgia, serif; font-size: 27px; line-height: 1; transform: translate(-50%, -50%) scale(1); }
.city-marker.selected:hover span { transform: translate(-50%, -50%) scale(1.15); }
.map-detail { min-width: 0; min-height: 0; padding: 26px 24px; overflow-y: auto; color: #f5f8fa; background: var(--blue-deep, #365d7e); border-radius: 4px; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.35) transparent; transition: background .35s ease, height .2s ease; }
.detail-label { color: #b9cede; font-size: 9px; letter-spacing: .22em; }
.map-detail > strong { display: block; margin: 17px 0 4px; font-family: "Songti SC", serif; font-size: 38px; font-weight: 500; }
.map-detail > p { margin: 0 0 5px; color: #d9e6ef; }
.map-detail > small { color: #a9c2d3; font-size: 11px; }
.city-list { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 28px; }
.city-list button { padding: 7px 10px; color: #d9e6ef; border: 1px solid rgba(255,255,255,.18); border-radius: 999px; background: transparent; font-size: 11px; cursor: pointer; }
.city-list button.active { color: var(--blue-deep, #365d7e); background: #f2f7fa; border-color: #f2f7fa; }
.city-list span { margin-left: 4px; opacity: .6; }
.map-detail .privacy-copy { margin-top: 28px; color: #aac2d2; font-size: 10px; line-height: 1.7; }
.city-memories { min-width: 0; min-height: 0; padding: 24px 16px 24px 24px; display: flex; flex-direction: column; color: var(--text-main, #302725); background: var(--surface-story, #fbf8f3); border: 1px solid color-mix(in srgb, var(--blue, #527b9d) 16%, transparent); border-radius: 4px; transition: color .35s ease, background .35s ease, border-color .35s ease, height .2s ease; }
.memory-heading { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding-bottom: 17px; border-bottom: 1px solid var(--line-color, #e4d9d1); }
.city-memories .detail-label { color: var(--blue, #527b9d); }
.memory-heading small { color: var(--text-muted, #7a6964); font-size: 9px; white-space: nowrap; }
.memory-list { min-height: 0; margin-top: 18px; padding-right: 8px; display: grid; gap: 18px; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; scrollbar-color: color-mix(in srgb, var(--blue, #527b9d) 55%, transparent) transparent; }
.memory-list::-webkit-scrollbar { width: 5px; }
.memory-list::-webkit-scrollbar-track { background: transparent; }
.memory-list::-webkit-scrollbar-thumb { background: color-mix(in srgb, var(--blue, #527b9d) 55%, transparent); border-radius: 999px; }
.memory-list figure { margin: 0; min-width: 0; }
.memory-frame { position: relative; aspect-ratio: 16 / 10; overflow: hidden; background: var(--photo-surface, #efe7df); border-radius: 3px; }
.memory-frame img { width: 100%; height: 100%; display: block; object-fit: cover; transition: transform .35s ease; }
.memory-frame:hover img { transform: scale(1.03); }
.memory-frame > span { position: absolute; top: 8px; right: 8px; padding: 4px 7px; color: #fff; background: rgba(54,93,126,.84); border-radius: 999px; font-size: 8px; }
.memory-list figcaption { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: baseline; gap: 9px; margin-top: 8px; }
.memory-list time { color: var(--red, #b8514a); font-size: 9px; }
.memory-list strong { overflow: hidden; color: var(--text-main, #302725); text-overflow: ellipsis; white-space: nowrap; font-family: "Noto Serif SC", "Songti SC", serif; font-size: 11px; font-weight: 500; }
@media (max-width: 860px) {
  .footprint-layout, .footprint-layout.has-memories { grid-template-columns: 1fr 1fr; gap: 18px; }
  .map-panel { grid-column: 1 / -1; grid-row: 1; }
  .map-detail { display: grid; grid-template-columns: auto 1fr; column-gap: 18px; align-items: end; }
  .detail-label, .city-list, .privacy-copy { grid-column: 1 / -1; }
  .map-detail > strong { margin-bottom: 0; }
  .map-detail > p { margin-bottom: 7px; }
}
@media (max-width: 600px) {
  .footprint-layout, .footprint-layout.has-memories { grid-template-columns: 1fr; margin-top: 40px; }
  .map-panel, .map-detail, .city-memories { grid-column: 1; }
  .map-panel { grid-row: 1; }
  .map-detail { grid-row: 2; }
  .city-memories { grid-row: 3; }
  .map-canvas { aspect-ratio: 1.15; }
  .map-canvas svg { width: 100%; height: 100%; }
  .map-detail { display: block; }
}
</style>

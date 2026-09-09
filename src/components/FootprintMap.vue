<script setup lang="ts">
import { computed, ref } from "vue";
import { geoMercator, geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { Topology } from "topojson-specification";
import worldAtlas from "world-atlas/countries-110m.json";

import { cityCoordinates, journeyMemories } from "../data/journey";

type MapMode = "china" | "world";

const mode = ref<MapMode>("china");
const selectedCity = ref("深圳");

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

const yearCount = new Set(journeyMemories.map((memory) => memory.date.slice(0, 4))).size;
</script>

<template>
  <div class="footprint-layout">
    <div class="map-panel">
      <div class="map-toolbar">
        <p>{{ cityStats.length }} 座城市 · {{ journeyMemories.length }} 个时刻 · {{ yearCount }} 个年份</p>
        <div class="map-modes" aria-label="地图范围">
          <button type="button" :class="{ active: mode === 'china' }" @click="mode = 'china'">中国</button>
          <button type="button" :class="{ active: mode === 'world' }" @click="mode = 'world'">世界</button>
        </div>
      </div>

      <div class="map-canvas">
        <svg viewBox="0 0 960 500" preserveAspectRatio="none" role="img" aria-labelledby="map-title map-description">
          <title id="map-title">ZZ 与 YY 的城市足迹</title>
          <desc id="map-description">仅使用城市中心点绘制，不包含精确位置或实时轨迹。</desc>
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
          :aria-label="`${city.city}，${city.visits} 个记录`"
          @click="selectedCity = city.city"
        >
          <span></span>
        </button>
      </div>
    </div>

    <aside class="map-detail" aria-live="polite">
      <span class="detail-label">SELECTED CITY</span>
      <strong>{{ selected.city }}</strong>
      <p>{{ selected.visits }} 个共同记录</p>
      <small>最近一次 · {{ selected.latest?.displayDate }}</small>
      <div class="city-list" aria-label="足迹城市列表">
        <button
          v-for="city in cityStats"
          :key="city.city"
          type="button"
          :class="{ active: selectedCity === city.city }"
          @click="selectedCity = city.city"
        >
          {{ city.city }} <span>{{ city.visits }}</span>
        </button>
      </div>
      <p class="privacy-copy">仅展示城市级足迹，不保存精确坐标与实时位置。</p>
    </aside>
  </div>
</template>

<style scoped>
.footprint-layout { display: grid; grid-template-columns: minmax(0, 1fr) 260px; gap: 42px; margin-top: 60px; }
.map-panel { min-width: 0; }
.map-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 18px; }
.map-toolbar p { margin: 0; color: var(--blue, #879bad); font-size: 12px; letter-spacing: .06em; }
.map-modes { display: flex; padding: 3px; background: color-mix(in srgb, var(--surface-story, #fff) 68%, transparent); border-radius: 999px; }
.map-modes button { padding: 7px 15px; color: var(--text-muted, #647987); border: 0; border-radius: 999px; background: transparent; cursor: pointer; transition: color .2s ease, background .2s ease; }
.map-modes button.active { color: #fff; background: var(--blue, #527b9d); }
.map-canvas { position: relative; aspect-ratio: 1.92; overflow: hidden; background: var(--map-canvas, #e9f0f4); border-radius: 4px; transition: background .35s ease; }
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
.city-marker span { position: absolute; left: 50%; top: 50%; width: var(--marker-size); height: var(--marker-size); border: 3px solid rgba(255,255,255,.88); border-radius: 50%; background: #b6544e; box-shadow: 0 4px 14px rgba(93,45,42,.3); transform: translate(-50%, -50%); transition: transform .2s ease; }
.city-marker:hover span, .city-marker.selected span { transform: translate(-50%, -50%) scale(1.28); }
.city-marker.selected span { background: var(--blue-deep, #365d7e); }
.map-detail { align-self: stretch; padding: 30px; color: #f5f8fa; background: var(--blue-deep, #365d7e); border-radius: 4px; transition: background .35s ease; }
.detail-label { color: #b9cede; font-size: 9px; letter-spacing: .22em; }
.map-detail > strong { display: block; margin: 17px 0 4px; font-family: "Songti SC", serif; font-size: 38px; font-weight: 500; }
.map-detail > p { margin: 0 0 5px; color: #d9e6ef; }
.map-detail > small { color: #a9c2d3; font-size: 11px; }
.city-list { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 28px; }
.city-list button { padding: 7px 10px; color: #d9e6ef; border: 1px solid rgba(255,255,255,.18); border-radius: 999px; background: transparent; font-size: 11px; cursor: pointer; }
.city-list button.active { color: var(--blue-deep, #365d7e); background: #f2f7fa; border-color: #f2f7fa; }
.city-list span { margin-left: 4px; opacity: .6; }
.map-detail .privacy-copy { margin-top: 28px; color: #aac2d2; font-size: 10px; line-height: 1.7; }

@media (max-width: 860px) {
  .footprint-layout { grid-template-columns: 1fr; gap: 18px; }
  .map-detail { display: grid; grid-template-columns: auto 1fr; column-gap: 18px; align-items: end; }
  .detail-label, .city-list, .privacy-copy { grid-column: 1 / -1; }
  .map-detail > strong { margin-bottom: 0; }
  .map-detail > p { margin-bottom: 7px; }
}
@media (max-width: 600px) {
  .footprint-layout { margin-top: 40px; }
  .map-toolbar { align-items: flex-start; flex-direction: column; }
  .map-canvas { aspect-ratio: 1.15; }
  .map-canvas svg { width: 100%; height: 100%; }
  .map-detail { display: block; }
}
</style>

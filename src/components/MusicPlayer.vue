<template>
  <div class="player">
    <h2 class="playingsongTitle">{{ currentSong?.title || 'No song loaded' }} <br> <span class="currentArtist">{{
        currentSong?.artist }}</span></h2>


    <img v-if="currentSong?.cover" :src="currentCover" alt="Cover" class="cover" style="max-width: 200px; margin-bottom: 16px;" />

    <audio ref="audio" v-if="currentSong" :src="currentAudio" @timeupdate="updateTime" @loadedmetadata="setDuration" />

    <div class="controls" v-if="currentSong">
      <button @click="prevSong" class="playPauseButton" style="width:48px;height:48px;margin-right:12px;">
        <span class="material-symbols-outlined">skip_previous</span>
      </button>
      <button @click="togglePlay" class="playPauseButton">
        <span class="material-symbols-outlined">
          {{ isPlaying ? 'pause' : 'play_arrow' }}
        </span>
      </button>
      <button @click="nextSong" class="playPauseButton" style="width:48px;height:48px;margin-left:12px;">
        <span class="material-symbols-outlined">skip_next</span>
      </button>
    </div>

    <span style="display:block;margin-top:8px;">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>

    <md-slider v-if="currentSong" min="0" :max="duration" step="0.1" .value="currentTime"
      @input="e => { currentTime = e.target.value; seekAudio(); }" style="width: 100%; margin-top: 10px;"></md-slider>

    <div class="playlist">
      <ul class="playlist-list">
        <li
          class="list"
          v-for="(song, index) in songs"
          :key="index"
          @click="selectSong(index)"
          :class="{ selected: currentIndex === index }"
          ref="activeSong"
          style="cursor: pointer; padding: 8px; list-style: none;"
        >
          <img class="coverThumbnail" :src="`${baseUrl}covers/${song.cover}`" :alt="song.title">
          <div class="songDetails">{{ song.title }} <small>{{ song.artist }}</small></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import '@material/web/button/outlined-button.js'
import '@material/web/button/filled-button.js'
import '@material/web/checkbox/checkbox.js'
import '@material/web/slider/slider.js'
import '@material/web/list/list.js'
import '@material/web/list/list-item.js'

import { ref, onMounted, computed, watch, nextTick, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()

const audio = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

const songs = ref([])
const currentIndex = ref(0)
const currentSong = ref(null)
const shouldAutoPlay = ref(false)

const baseUrl = import.meta.env.BASE_URL

const currentCover = computed(() =>
  currentSong.value?.cover ? `${baseUrl}covers/${currentSong.value.cover}` : ''
)
const currentAudio = computed(() =>
  currentSong.value ? `${baseUrl}songs/${currentSong.value.filename}` : ''
)

onMounted(async () => {
  const res = await fetch(`${import.meta.env.BASE_URL}songs.json`)
  songs.value = await res.json()
  currentSong.value = songs.value[0] || null
})

function togglePlay() {
  if (!audio.value) return
  if (isPlaying.value) {
    audio.value.pause()
  } else {
    audio.value.play()
  }
  isPlaying.value = !isPlaying.value
}

function updateTime() {
  currentTime.value = audio.value.currentTime
}

function setDuration() {
  duration.value = audio.value.duration
  // Auto-play when a new song is loaded
  if (shouldAutoPlay.value) {
    audio.value.play()
    isPlaying.value = true
    shouldAutoPlay.value = false
  }
}

function seekAudio() {
  audio.value.currentTime = currentTime.value
}

function selectSong(index) {
  if (currentIndex.value === index) {
    // If the same song is clicked, replay from the start
    audio.value.currentTime = 0
    shouldAutoPlay.value = false
    audio.value.play()
    isPlaying.value = true
    return
  }
  currentIndex.value = index
  currentSong.value = songs.value[index]
  isPlaying.value = false
  shouldAutoPlay.value = true
}

function nextSong() {
  if (songs.value.length === 0) return
  let next = currentIndex.value + 1
  if (next >= songs.value.length) next = 0
  selectSong(next)
}

function prevSong() {
  if (songs.value.length === 0) return
  let prev = currentIndex.value - 1
  if (prev < 0) prev = songs.value.length - 1
  selectSong(prev)
}

function formatTime(time) {
  const min = Math.floor(time / 60)
  const sec = Math.floor(time % 60).toString().padStart(2, '0')
  return `${min}:${sec}`
}

const activeSong = ref([])

watch(currentIndex, async () => {
  await nextTick()
  const el = activeSong.value[currentIndex.value]
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }
})
</script>

<style scoped>
.player {
  width: 500px;
  max-width: 1024px;
  margin: 40px auto;
  text-align: center;
  font-family: 'Roboto', 'Arial', sans-serif;
  border: 1px solid #886ac1;
  border-radius: 40px;
  padding: 32px 16px;
  background: linear-gradient(135deg, #4b256a 0%, #6750a4 100%);
  box-shadow: 0 4px 16px rgba(103,80,164  ,0.2); 
}

.playingsongTitle {
  color: #fff;
  font-size: 24px;
  margin-bottom: 16px;
}

.currentArtist {
  color: #e0e0e0;
  font-size: 12px;
}

.cover {
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1);
}

.controls {
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;  

}

md-slider::part(handle) {
  background: #fff !important;
  /* White knob */
  border: 2px solid #6750a4 !important;
  /* Purple border */
}

.playPauseButton {
  border-radius: 50%;
  width: 80px;
  height: 80px;
  min-width: 40px;
  min-height: 40px;
  padding: 0;
  background: #6750a4;
  border: none;
  color: #fff;
  display: block;
  margin: 0 auto 1rem;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s cubic-bezier(.4,2,.6,1), box-shadow 0.3s;
}

.playPauseButton:hover {
  background: linear-gradient(135deg, #8e7cc3 60%, #b3a6d9 100%);
  transform: scale(1.08) rotate(-3deg);
  box-shadow: 0 8px 24px rgba(103,80,164,0.18);
}

.playlist {
  margin: 20px 40px;
  text-align: left;
}

.playlist-list {
  padding: 0;
  margin: 0;
  list-style: none;
  height: 200px;
  overflow: auto;
  scroll-behavior: smooth;
}

/* Custom scrollbar styling for Webkit browsers */
.playlist-list::-webkit-scrollbar {
  width: 8px;
  background: #4b256a;
  border-radius: 8px;
}

.playlist-list::-webkit-scrollbar-thumb {
  background: #a18cd1;
  border-radius: 8px;
  transition: background 0.3s;
}

.playlist-list::-webkit-scrollbar-thumb:hover {
  background: #6750a4;
}

/* Custom scrollbar for Firefox */
.playlist-list {
  scrollbar-width: thin;
  scrollbar-color: #a18cd1 #4b256a;
}

.playlist-list li {
  cursor: pointer;
  padding: 8px;
  border-top: 1px solid #68499d;
  border-bottom: 1px solid #68499d;
}

.playlist-list li.selected {
  background-color: #f0f0f0;
}

.selected {
  background: #e0e0e0;
  font-weight: bold;
  color: #333;
}

.list {
  display: inline-flex;
  align-items: center;
  flex-direction: row;
  width: 100%;
}

.coverThumbnail {
  height: 50px;
  vertical-align: middle;
  margin-right: 8px;
  border-radius: 5px;
}

.songDetails {
  display: inline-flex;
  flex-direction: column;
}
</style>

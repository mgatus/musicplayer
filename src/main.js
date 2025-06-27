import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import Lenis from "@studio-freight/lenis"

const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

createApp(App).mount('#app')

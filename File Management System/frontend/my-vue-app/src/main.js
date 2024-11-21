import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App);

// Set productionTip
app.config.productionTip = false;

// Mount the app to the DOM
app.mount('#app');
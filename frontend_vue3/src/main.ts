import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';

import './index.css'; // tailwind / global css

const app = createApp(App);
app.use(router);
app.mount('#app');

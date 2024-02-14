import { createApp } from 'vue';
import { createPinia } from 'pinia';

import '@unocss/reset/normalize.css';
import App from './App.vue';
import router from './router';
import drie from '@janvorisek/drie';
import 'uno.css';
import './style.scss';

const app = createApp(App);

app.use(createPinia());
app.use(drie);
app.use(router);

app.mount('#app');

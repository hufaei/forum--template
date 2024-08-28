import { createPinia } from 'pinia';
import { useAppStore } from './app';

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;
export { useAppStore };


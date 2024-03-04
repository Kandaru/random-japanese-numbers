import '../styles/main.scss';
import '@mdi/font/css/materialdesignicons.css';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { mdiEye, mdiEyeOff } from '@mdi/js';

import { createVuetify } from 'vuetify';

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      eye: mdiEye,
      eyeOff: mdiEyeOff
    },
    sets: {
      mdi
    }
  }
});

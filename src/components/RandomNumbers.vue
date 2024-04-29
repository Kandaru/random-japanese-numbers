<template>
  <v-container
    @mousemove.once="(ev: MouseEvent) => {
      randomizer = seedrandom([ev.x, ev.y, Date.now()].join(','), { entropy: true });
    }"
  >
    <v-responsive :max-width="600" class="mx-auto">
      <v-sheet
        border
        :elevation="10"
        min-width="200"
        class="pa-4"
      >
        <v-form @submit.prevent="submit" ref="form">
          <v-container>
            <v-row>
              <v-card-title class="w-100 text-center">
                Случайные числа на японском
              </v-card-title>
            </v-row>

            <template v-if="!$vuetify.display.mobile">
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="min"
                    density="compact"
                    type="number"
                    variant="outlined"
                    :rules="[validationRules.default, validationRules.min]"
                    label="Минимум"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="max"
                    density="compact"
                    type="number"
                    variant="outlined"
                    :rules="[validationRules.default, validationRules.max]"
                    label="Максимум"
                  />
                </v-col>
              </v-row>
            </template>
            <template v-else>
              <v-row>
                <v-text-field
                  v-model="min"
                  density="compact"
                  type="number"
                  variant="outlined"
                  :rules="[validationRules.default, validationRules.min]"
                  label="Минимум"
                />
              </v-row>
              <v-row>
                <v-text-field
                  v-model="max"
                  density="compact"
                  type="number"
                  variant="outlined"
                  :rules="[validationRules.default, validationRules.max]"
                  label="Максимум"
                />
              </v-row>
            </template>

            <v-row>
              <v-btn
                type="submit"
                class="mx-auto"
                :disabled="!form || !form.isValid"
              >
                Сгенерировать
              </v-btn>
            </v-row>
          </v-container>
        </v-form>
      </v-sheet>

      <v-sheet
        v-if="['number', 'string'].includes(typeof generationResult.number)"
        border
        :elevation="10"
        min-width="200"
        class="pa-4 mt-10"
      >
        <v-card-subtitle>
          <span>Число</span>
        </v-card-subtitle>
        <v-card-text>
          <v-text-field
            :append-inner-icon="typesVisibility.number ? '$eye' : '$eyeOff'"
            hide-details
            :type="typesVisibility.number ? 'number' : 'password'"
            max="999999999999"
            variant="solo"
            v-model="generationResult.number"
            @input="parseNumber"
            @click:append-inner="() => typesVisibility.number = !typesVisibility.number"
          />
        </v-card-text>
        <v-card-subtitle>
          <span>Кандзи</span>
        </v-card-subtitle>
        <v-card-text>
          <v-text-field
            :append-inner-icon="typesVisibility.kanji ? '$eye' : '$eyeOff'"
            hide-details
            :type="typesVisibility.kanji ? 'text' : 'password'"
            variant="solo"
            v-model="generationResult.kanji"
            @click:append-inner="() => typesVisibility.kanji = !typesVisibility.kanji"
          />
        </v-card-text>
        <v-card-subtitle>
          <span>Ромадзи</span>
        </v-card-subtitle>
        <v-card-text>
          <v-text-field
            :append-inner-icon="typesVisibility.romaji ? '$eye' : '$eyeOff'"
            hide-details
            :type="typesVisibility.romaji ? 'text' : 'password'"
            variant="solo"
            v-model="generationResult.romaji"
            @click:append-inner="() => typesVisibility.romaji = !typesVisibility.romaji"
          />
        </v-card-text>
      </v-sheet>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
  import { nextTick, reactive, ref } from 'vue';
  import seedrandom from 'seedrandom';

  const form = ref<any>(null);

  const min = ref(0);
  const max = ref(100);

  const generationResult = reactive<{
    number?: number;
    kanji?: string;
    romaji?: string;
  }>({});

  const typesVisibility = reactive<{
    number: boolean;
    kanji: boolean;
    romaji: boolean;
  }>({
    number: true,
    kanji: true,
    romaji: true
  });

  const validationRules = {
    default: (v: any) => v !== "" && !isNaN(v) && v >= 0 && v <= 999999999999 || 'Введённое число должно быть больше -1',
    min: (v: any) => v < max.value || 'Минимальное значение должно быть меньше максимального',
    max: (v: any) => v > min.value || 'Максимальное значение должно быть больше минимального',
  };

  let randomizer: seedrandom.PRNG;

  const chars: Record<string, Record<string, string>> = {
    kanji: {
      0: 'ゼロ | 零',
      1: '一',
      2: 'ニ',
      3: '三',
      4: '四',
      5: '五',
      6: '六',
      7: '七',
      8: '八',
      9: '九',
      10: '十',
      100: '百',
      1000: '千',
      10000: '万',
      100000000: '憶',
    },
    romaji: {
      0: 'zero | rei',
      1: 'ichi',
      2: 'ni',
      3: 'san',
      4: 'yon',
      5: 'go',
      6: 'roku',
      7: 'nana',
      8: 'hachi',
      9: 'kyuu',
      300: 'sambyaku',
      600: 'roppyaku',
      800: 'happyaku',
      3000: 'san zen',
      8000: 'hassen',
    },
    romajiGrades: {
      10: 'jyuu',
      100: 'hyaku',
      1000: 'sen',
      10000: 'man',
      100000000: 'oku',
    }
  };

  async function submit() {
    await nextTick();
    generationResult.number = Math.round(Number(min.value) + randomizer() * (max.value - min.value));

    parseNumber();
  }

  function parseNumber() {
    if (generationResult.number! > 999999999999) {
      generationResult.number! = 999999999999;
    }

    generationResult.kanji = '';
    generationResult.romaji = '';

    if (generationResult.number == 0) {
      generationResult.kanji = chars.kanji[0];
      generationResult.romaji = chars.romaji[0];
      return;
    }

    const numberAsCharArray = generationResult.number!.toString().split('');

    const firstSliceLength = numberAsCharArray!.length % 4 || 4;

    const blocks = [
      numberAsCharArray.splice(0, firstSliceLength).reverse(),
      numberAsCharArray.splice(0, 4).reverse(),
      numberAsCharArray.reverse()
    ].filter(arr => arr?.length).reverse();

    let { kanji, romaji } = parseInner(blocks[0]!);

    if (blocks[1]) {
      const result = parseInner(blocks[1]);
      romaji = `${result.romaji} ${chars.romajiGrades[10000]} ${romaji}`;
      kanji = `${result.kanji}${chars.kanji[10000]}${kanji}`;
    }

    if (blocks[2]) {
      const result = parseInner(blocks[2]);
      romaji = `${result.romaji} ${chars.romajiGrades[100000000]} ${romaji}`;
      kanji = `${result.kanji}${chars.kanji[100000000]}${kanji}`;
    }

    generationResult.kanji = kanji;
    generationResult.romaji = romaji;
  }

  function parseInner(charsArray: string[]) {
    let result = {
      kanji: '',
      romaji: ''
    };

    charsArray.forEach((char, index) => {
      const grade = 10 ** index;

      if (char === '0') {
        return;
      }

      if (grade === 1) {
        result.kanji = chars.kanji[char] + result.kanji;
        result.romaji = `${chars.romaji[char]} ${result.romaji}`;
        return;
      }

      if (char === '1') {
        result.romaji = `${chars.romajiGrades[grade]} ${result.romaji}`;
        result.kanji = chars.kanji[grade] + result.kanji;
        return;
      }

      if (chars.romaji[Number(char) * grade]) {
        result.romaji = `${chars.romaji[Number(char) * grade]} ${result.romaji}`;
      } else {
        result.romaji = `${chars.romaji[char]} ${chars.romajiGrades[grade]} ${result.romaji}`;
      }

      result.kanji = chars.kanji[char] + chars.kanji[grade] + result.kanji;
    });

    result.romaji = result.romaji.split(' ').filter(_ => _).join(' ');

    return result;
  }
</script>

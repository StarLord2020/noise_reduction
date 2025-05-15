import {
  RnnoiseWorkletNode,
  loadRnnoise
} from './web-noise-suppressor/dist/index.js';

document.getElementById('start').addEventListener('click', async () => {
  const ctx = new AudioContext();

  // Подгружаем и регистрируем AudioWorklet
  await ctx.audioWorklet.addModule('./web-noise-suppressor/dist/rnnoise/workletProcessor.js');
 
  // Загружаем WASM бинарь
  const wasmBinary = await loadRnnoise({
    url: '/rnnoise.wasm',
    simdUrl: '/rnnoise_simd.wasm', // можно указать ту же, если SIMD не используешь
  });
  console.log(wasmBinary, 'wasmBinary');
  // Создаём suppressor вручную
  const suppressor = new RnnoiseWorkletNode(ctx, {
    wasmBinary,
    maxChannels: 1,
  });

  // Подключаем микрофон
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mic = ctx.createMediaStreamSource(stream);
  mic.connect(suppressor);
  suppressor.connect(ctx.destination);

  console.log('Noise suppression active!');
});

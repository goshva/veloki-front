<template>
    <div v-if="showScreen">
      <StreamBarcodeReader
        torch
        no-front-cameras
        @decode="onDecode"
        @loaded="onLoaded"
      />
      <h2>Decoded value: {{ decodedText }}</h2>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { StreamBarcodeReader } from '@teckel/vue-barcode-reader';
  
  const decodedText = ref('');
  const emit = defineEmits(['decode']);
  const showScreen = ref(true);
  const onDecode = (result) => {
    decodedText.value = result;
    emit('decode', result);
    showScreen.value = false;
  };
  
  const onLoaded = () => {
    console.log('loaded');
  };
  </script>
  
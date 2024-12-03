<script setup lang="ts">
import Decoder from '../components/Decoder.vue'
import Encoder from '../components/Encoder.vue'
</script>

<template>
  <div class="container">
    <h1>Message Encoder/Decoder</h1>
    <Decoder />
    <hr />
    <Encoder />
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
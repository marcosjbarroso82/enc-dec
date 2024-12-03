<script setup lang="ts">
import Navigation from './components/Navigation.vue';
</script>

<template>
  <Navigation />
  <router-view></router-view>
</template>

<style>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.input-group {
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

input, textarea {
  padding: 0.5rem;
  border: 1px solid #444;
  border-radius: 4px;
  font-size: 1rem;
  background-color: #2a2a2a;
  color: #fff;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

button {
  background-color: #646cff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #535bf2;
}

.result {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #2a2a2a;
  border-radius: 4px;
  border: 1px solid #444;
}

hr {
  margin: 2rem 0;
  border: none;
  border-top: 1px solid #444;
}
</style>
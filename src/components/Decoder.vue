<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { decrypt } from '../utils/crypto';

const route = useRoute();
const encodedMessage = ref('');
const decodePhrase = ref('');
const decodedMessage = ref('');
const error = ref('');

watch(
  () => route.query.message,
  (newMessage) => {
    if (newMessage) {
      encodedMessage.value = newMessage as string;
      if (decodePhrase.value) {
        handleDecode();
      }
    }
  },
  { immediate: true }
);

watch(decodePhrase, () => {
  if (encodedMessage.value && decodePhrase.value) {
    handleDecode();
  }
});

function handleDecode() {
  if (encodedMessage.value && decodePhrase.value) {
    const result = decrypt(encodedMessage.value, decodePhrase.value);
    if (!result.success) {
      error.value = result.error || 'Decryption failed';
      decodedMessage.value = '';
    } else {
      error.value = '';
      decodedMessage.value = result.data || '';
    }
  }
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}
</script>

<template>
  <div class="decoder">
    <h2>Decode Message</h2>
    <div class="input-group">
      <label>Encrypted Message:</label>
      <input
        v-model="encodedMessage"
        type="text"
        placeholder="Enter encrypted message"
      />
    </div>
    <div class="input-group">
      <label>Passphrase:</label>
      <input
        v-model="decodePhrase"
        type="password"
        placeholder="Enter passphrase for decryption"
      />
    </div>
    <div v-if="error" class="error">
      {{ error }}
    </div>
    <div v-if="decodedMessage" class="result">
      <h3>Decrypted Message:</h3>
      <div class="copy-container">
        <textarea 
          readonly 
          :value="decodedMessage" 
          class="decoded-text"
          rows="4"
        ></textarea>
        <button @click="copyToClipboard(decodedMessage)" title="Copy decrypted message">
          Copy Message
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.decoder {
  margin: 2rem 0;
}

.error {
  color: #ff4444;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.copy-container {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  margin-top: 0.5rem;
}

.decoded-text {
  flex: 1;
  padding: 0.5rem;
  background-color: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  margin: 0;
  font-family: monospace;
  color: #fff;
  resize: vertical;
  min-height: 100px;
}
</style>
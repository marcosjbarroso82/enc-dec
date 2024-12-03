<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { decrypt } from '../utils/crypto';

const route = useRoute();
const router = useRouter();
const encodedFields = ref({
  message: '',
  next_url: ''
});
const help = ref('');
const decodePhrase = ref('');
const decodedFields = ref({
  message: '',
  next_url: ''
});
const errors = ref({
  message: '',
  next_url: ''
});

watch(
  () => route.query,
  (newQuery) => {
    encodedFields.value = {
      message: (newQuery.message as string) || '',
      next_url: (newQuery.next_url as string) || ''
    };
    help.value = (newQuery.help as string) || '';
    if (decodePhrase.value) {
      handleDecode();
    }
  },
  { immediate: true }
);

watch([decodePhrase, encodedFields], () => {
  if (decodePhrase.value) {
    handleDecode();
  }
});

function handleDecode() {
  if (decodePhrase.value) {
    Object.entries(encodedFields.value).forEach(([key, value]) => {
      if (value) {
        const result = decrypt(value, decodePhrase.value);
        if (!result.success) {
          errors.value[key] = result.error || 'Decryption failed';
          decodedFields.value[key] = '';
        } else {
          errors.value[key] = '';
          decodedFields.value[key] = result.data || '';
        }
      } else {
        errors.value[key] = '';
        decodedFields.value[key] = '';
      }
    });
  }
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

function navigateToNextUrl() {
  if (decodedFields.value.next_url) {
    // Check if the next_url is an internal path
    if (decodedFields.value.next_url.startsWith('/')) {
      router.push(decodedFields.value.next_url);
    } else {
      // If it's an external URL, use window.location
      window.location.href = decodedFields.value.next_url;
    }
  }
}
</script>

<template>
  <div class="decoder">
    <h2>Decode Message</h2>
    
    <div v-if="help" class="help-section">
      <h3>Help Message:</h3>
      <div class="help-text">{{ help }}</div>
    </div>
    
    <div class="input-group">
      <label>Encrypted Message:</label>
      <textarea
        v-model="encodedFields.message"
        placeholder="Enter encrypted message"
        class="encoded-input"
      ></textarea>
      <div v-if="errors.message" class="error">
        {{ errors.message }}
      </div>
    </div>

    <div class="input-group">
      <label>Encrypted Next URL:</label>
      <textarea
        v-model="encodedFields.next_url"
        placeholder="Enter encrypted next URL"
        class="encoded-input"
      ></textarea>
      <div v-if="errors.next_url" class="error">
        {{ errors.next_url }}
      </div>
    </div>

    <div class="input-group">
      <label>Passphrase:</label>
      <input
        v-model="decodePhrase"
        type="password"
        placeholder="Enter passphrase for decryption"
      />
    </div>

    <div class="result">
      <div class="decoded-section">
        <h3>Decrypted Message:</h3>
        <div class="copy-container">
          <textarea 
            readonly 
            :value="decodedFields.message" 
            class="decoded-text"
            rows="4"
            placeholder="Decrypted message will appear here"
          ></textarea>
          <button 
            @click="copyToClipboard(decodedFields.message)" 
            title="Copy decrypted message"
            :disabled="!decodedFields.message"
          >
            Copy Message
          </button>
        </div>
      </div>

      <div class="decoded-section">
        <h3>Decrypted Next URL:</h3>
        <div class="next-url-container">
          <div class="copy-container">
            <input 
              type="text" 
              readonly 
              :value="decodedFields.next_url" 
              class="decoded-text"
              placeholder="Decrypted URL will appear here"
            />
            <button 
              @click="copyToClipboard(decodedFields.next_url)" 
              title="Copy URL"
              :disabled="!decodedFields.next_url"
            >
              Copy URL
            </button>
          </div>
          <button 
            @click="navigateToNextUrl" 
            class="navigate-button"
            :disabled="!decodedFields.next_url"
          >
            Navigate to {{ decodedFields.next_url?.startsWith('/') ? 'Internal Path' : 'URL' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.decoder {
  margin: 2rem 0;
}

.decoded-section {
  margin-top: 1.5rem;
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
}

textarea.decoded-text {
  resize: vertical;
  min-height: 100px;
}

.next-url-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.navigate-button {
  width: 100%;
  margin-top: 0.5rem;
}

.encoded-input {
  width: 100%;
  min-height: 60px;
  padding: 0.5rem;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #2a2a2a;
  color: #fff;
  font-family: monospace;
  resize: vertical;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.help-section {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #2a2a2a;
  border-radius: 4px;
  border: 1px solid #444;
}

.help-text {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #1a1a1a;
  border-radius: 4px;
  white-space: pre-wrap;
}
</style>
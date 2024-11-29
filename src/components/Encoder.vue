<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { encrypt } from '../utils/crypto';
import { copyImageToClipboard } from '../utils/clipboard';
import QRCode from 'qrcode';

const router = useRouter();
const message = ref('');
const encodePhrase = ref('');
const error = ref('');
const qrCodeDataUrl = ref('');
const copyStatus = ref('');

const encodedMessage = computed(() => {
  if (message.value && encodePhrase.value) {
    const result = encrypt(message.value, encodePhrase.value);
    if (!result.success) {
      error.value = result.error || 'Encryption failed';
      return '';
    }
    error.value = '';
    return result.data;
  }
  return '';
});

const fullUrl = computed(() => {
  if (encodedMessage.value) {
    const url = new URL(window.location.href);
    url.searchParams.set('message', encodedMessage.value);
    return url.toString();
  }
  return '';
});

watch(fullUrl, async (newUrl) => {
  if (newUrl) {
    try {
      qrCodeDataUrl.value = await QRCode.toDataURL(newUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
    } catch (err) {
      console.error('QR Code generation failed:', err);
    }
  } else {
    qrCodeDataUrl.value = '';
  }
});

async function navigateToEncodedMessage() {
  if (encodedMessage.value) {
    try {
      await router.push({
        path: '/',
        query: { message: encodedMessage.value }
      });
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

async function copyQRCode() {
  if (qrCodeDataUrl.value) {
    copyStatus.value = 'Copying...';
    const success = await copyImageToClipboard(qrCodeDataUrl.value);
    copyStatus.value = success ? 'Copied!' : 'Failed to copy';
    setTimeout(() => {
      copyStatus.value = '';
    }, 2000);
  }
}
</script>

<template>
  <div class="encoder">
    <h2>Create Encoded Message</h2>
    <div class="input-group">
      <label>Message:</label>
      <textarea
        v-model="message"
        placeholder="Enter message to encode"
      ></textarea>
    </div>
    <div class="input-group">
      <label>Passphrase:</label>
      <input
        v-model="encodePhrase"
        type="password"
        placeholder="Enter passphrase for encryption"
      />
    </div>
    <div v-if="error" class="error">
      {{ error }}
    </div>
    <div v-if="encodedMessage" class="result">
      <button @click="navigateToEncodedMessage">Update URL with Encoded Message</button>
      
      <div class="encoded-section">
        <h3>Encrypted Message:</h3>
        <div class="copy-container">
          <input type="text" readonly :value="encodedMessage" class="message-display" />
          <button @click="copyToClipboard(encodedMessage)" title="Copy encrypted message">
            Copy Message
          </button>
        </div>
      </div>

      <div class="encoded-section">
        <h3>Shareable URL:</h3>
        <div class="copy-container">
          <a :href="fullUrl" target="_blank" class="url-display">{{ fullUrl }}</a>
          <button @click="copyToClipboard(fullUrl)" title="Copy full URL">
            Copy URL
          </button>
        </div>
      </div>

      <div v-if="qrCodeDataUrl" class="encoded-section qr-section">
        <h3>QR Code:</h3>
        <div class="qr-container">
          <div class="qr-wrapper">
            <img :src="qrCodeDataUrl" alt="QR Code for encrypted message" class="qr-code" />
          </div>
          <div class="qr-actions">
            <button @click="copyQRCode" :disabled="!qrCodeDataUrl">
              {{ copyStatus || 'Copy QR Code' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.encoder {
  margin: 2rem 0;
}

.encoded-section {
  margin-top: 1.5rem;
}

.encoded-section h3 {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.copy-container {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.5rem;
}

.message-display,
.url-display {
  flex: 1;
  padding: 0.5rem;
  background-color: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  font-family: monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #fff;
}

.url-display {
  display: block;
  text-decoration: none;
  color: #646cff;
}

.url-display:hover {
  text-decoration: underline;
}

button {
  white-space: nowrap;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #ff4444;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.qr-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qr-container {
  background-color: #2a2a2a;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.qr-wrapper {
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 4px;
}

.qr-code {
  display: block;
  max-width: 200px;
  height: auto;
}

.qr-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  width: 100%;
}
</style>
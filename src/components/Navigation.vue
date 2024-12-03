<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showLinks = ref(false);

const toggleLinks = () => {
  showLinks.value = !showLinks.value;
};

const navigateToLink = (path: string) => {
  router.push(path);
  showLinks.value = false;
};
</script>

<template>
  <nav class="nav">
    <div class="nav-content">
      <router-link to="/" class="nav-link">Home</router-link>
      <div class="dropdown">
        <button @click="toggleLinks" class="nav-link">
          Internal Links
        </button>
        <div v-if="showLinks" class="dropdown-content">
          <a 
            href="#" 
            @click.prevent="navigateToLink('/?message=U2FsdGVkX1%2BTCSURqHnVEt0ESDBg7htja5pHm8nQaI8%3D&next_url=U2FsdGVkX18Wr2eDiX9WIKEel%2Brcc41dAvu2oKPSfNfFv1MmMkwf9Ep3xT5PwQaDRw00UWyLRZLNaynQZHHYcqBMyeCxX4ltgk%2BRCZOK2g4%3D&help=some+help+message')"
          >
            First
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  background-color: #1a1a1a;
  border-bottom: 1px solid #333;
  z-index: 1000;
  padding: 0.5rem 0;
}

.nav-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  padding: 0.5rem;
  border: none;
  background: none;
  font-size: 1rem;
  cursor: pointer;
}

.nav-link:hover {
  color: #646cff;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #2a2a2a;
  min-width: 160px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  border-radius: 4px;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
}

.dropdown-content a {
  color: #fff;
  padding: 0.5rem 1rem;
  text-decoration: none;
  display: block;
  white-space: nowrap;
}

.dropdown-content a:hover {
  background-color: #3a3a3a;
  color: #646cff;
}
</style>
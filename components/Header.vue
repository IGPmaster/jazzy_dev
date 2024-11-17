<template>
  <nav class="top-menu bg-jazzy-blue fixed z-10 py-4 shadow-lg items-center w-full">
    <div class="w-full md:px-0">
      <div class="container md:mx-auto grid grid-cols-3 items-center">
        <!-- Left Section with Burger Menu -->
        <div class="left">
          <div class="menu-btn items-center" id="menu-btn">
            <img src="../assets/burger.svg" alt="Mobile Menu Button" class="w-12 h-12 pl-4 items-center">
            <div class="menu bg-gray-800 rounded text-left w-36 drop-shadow-[0_15px_15px_rgba(0,0,0,0.50)] 
                        transition duration-300 ease-in-out transform scale-0 origin-top"
                 id="menu">
              <NuxtLink v-for="(item, key) in menuItems" 
                        :key="key"
                        :to="item.path" 
                        class="menu-item hover:bg-slate-700 px-5 text-jazzy-beige font-extrabold">
                {{ msgTranslate[item.label] }}
              </NuxtLink>
              <a :href="regLink" class="menu-item hover:bg-slate-700 px-5 text-jazzy-beige font-extrabold">
                {{ msgTranslate.login }}
              </a>
            </div>
          </div>
        </div>

        <!-- Center Logo -->
        <div class="">
          <NuxtLink class="flex justify-center" to="/">
            <img src="/images/JazzySpins_logo_wh.svg" alt="Jazzy Spins Logo" class="w-[200px] h-auto" />
          </NuxtLink>
        </div>

        <!-- Right Section with Auth Buttons -->
        <div class="right">
          <ul class="hidden lg:flex items-center justify-end gap-4">
            <li>
              <a :href="loginLink" 
                 class="inline-flex items-center px-6 py-2 text-white bg-jazzy-green rounded-md
                        hover:bg-opacity-90 transform hover:-translate-y-0.5 transition-all duration-300
                        font-medium tracking-wide uppercase text-sm">
                <span>{{ msgTranslate.login }}</span>
              </a>
            </li>
            <li>
              <a :href="regLink" 
                 class="inline-flex items-center px-6 py-2 text-white bg-jazzy-red-secondary rounded-md
                        hover:bg-jazzy-red transform hover:scale-105 transition-all duration-300
                        font-medium tracking-wide uppercase text-sm shadow-lg
                        ring-2 ring-transparent hover:ring-jazzy-red/50">
                <span>{{ msgTranslate.sign_up }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </a>
            </li>
          </ul>
          <div class="flex lg:hidden items-center justify-end pr-4">
            <a :href="loginLink" 
               class="inline-flex items-center px-4 py-1.5 text-white bg-jazzy-green rounded
                      hover:bg-opacity-90 transition-all duration-300
                      text-sm font-medium uppercase tracking-wide">
              {{ msgTranslate.login }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { msgTranslate, regLink, loginLink } from '~/composables/globalData';

const menuIsOpen = ref(false);

// Menu items configuration
const menuItems = [
  { path: '/', label: 'home' },
  { path: '/promotions', label: 'promotions' },
  { path: '/compliance', label: 'legal' },
  { path: '/all-games', label: 'all_games' },
  { path: '/popular-games', label: 'popular_games' },
  { path: '/slot-games', label: 'slot_games' },
  { path: '/casino-games', label: 'casino_games' },
  { path: '/jackpot-games', label: 'jackpot_games' },
  { path: '/compliance/contact', label: 'contact' },
];

onMounted(() => {
  const menuBtn = document.getElementById('menu-btn');
  const menu = document.getElementById('menu');
  
  const outsideClickListener = (event) => {
    if (!menu.contains(event.target) && !menuBtn.contains(event.target)) {
      menuIsOpen.value = false;
      updateMenu();
    }
  };

  menuBtn.addEventListener('click', () => {
    menuIsOpen.value = !menuIsOpen.value;
    updateMenu();
  });

  document.addEventListener('click', outsideClickListener);

  onUnmounted(() => {
    document.removeEventListener('click', outsideClickListener);
  });
});

function updateMenu() {
  const menu = document.getElementById('menu');
  menu.style.transform = menuIsOpen.value ? 'scale(1)' : 'scale(0)';
}
</script>

<style scoped>
.menu-btn {
  cursor: pointer;
  display: inline-block;
  position: relative;
}

.menu {
  display: block;
  position: absolute;
  min-width: 250px;
}

.menu-item {
  display: block;
  line-height: 55px;
  font-size: 18px;
  font-weight: 100;
}

.router-link-active {
  color: #FFB300;
}

.right a {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

@keyframes subtle-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.right a:last-child:hover {
  animation: subtle-pulse 2s infinite;
}
</style> 
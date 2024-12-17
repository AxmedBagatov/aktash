<template>
  <header class="header">
    <nav class="nav-routes">
      <!-- Кнопка гамбургера для мобильных устройств -->
      <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle menu">
        <span class="menu-icon" :class="{ 'open': menuVisible }"></span>
      </button>

      <!-- Боковое меню -->
      <div :class="{ 'side-menu': true, 'show': menuVisible }">
        <button class="close-menu" @click="toggleMenu" aria-label="Close menu">X</button>
        <ul class="nav-list">
          <li>
            <NuxtLink to="/" @click.native="closeMenu" class="link_header">Главная</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/shop" @click.native="closeMenu" class="link_header">Каталог</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/galery" @click.native="closeMenu" class="link_header">Галерея</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/contact" @click.native="closeMenu" class="link_header">Контакты</NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Основное меню для больших экранов -->
      <ul class="nav-list main-nav">
        <li>
          <NuxtLink to="/">Главная</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/shop">Каталог</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/galery">Галерея</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/contact">Контакты</NuxtLink>
        </li>
      </ul>
    </nav>
    <div class="search-container">
      <Search />
    </div>
    <hr class="header_undeline">
  </header>

</template>

<script>
import Search from './search.vue';
export default {
  name: 'Header',
  components: { Search },
  data() {
    return {
      menuVisible: false, // Состояние видимости бокового меню
    };
  },
  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible; // Переключение состояния меню
    },
    closeMenu() {
      console.log("закрыто");

      this.menuVisible = false;
    },
  },
};
</script>
<style src="~/assets/css/components/header.css"></style>
<style scoped>

</style>

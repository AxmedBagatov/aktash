<template>
  <header class="header">
    <nav class="nav-routes">
      <!-- Кнопка гамбургера для мобильных устройств -->
      <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle menu">
        <span class="menu-icon" :class="{ open: menuVisible }"></span>
      </button>

      <!-- Боковое меню -->
      <div :class="{ 'side-menu': true, show: menuVisible }">
        <button class="close-menu" @click="toggleMenu" aria-label="Close menu">
          X
        </button>
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
    <button v-if="isLoggedIn" @click="handleLogout" style="margin-left: 50px">
      <font-awesome-icon :icon="['fas', 'user-xmark']" />
    </button>
    <!-- <button style="margin-left: 50px"><font-awesome-icon :icon="['fas', 'user']" /></button> -->
    <NuxtLink to="/login" @click.native="closeMenu" style="margin-left: 20px; text-decoration: none; color:  #c32222;">
      <font-awesome-icon :icon="['fas', 'user']" />
    </NuxtLink>
    <hr class="header_undeline" />
    <div class="header-catalog-items">
      <div v-for="catalog in catalogs" :key="catalog.category_id" class="header-catalog-item">
        <nuxt-link :to="`/shop/${catalog.category_id}`" class="header-catalog-link"> {{ catalog.name }} </nuxt-link>
      </div>
    </div>
  </header>
</template>

<script>
import Search from "./search.vue";
export default {
  name: "Header",
  components: { Search },
  data() {
    return {
      menuVisible: false, // Состояние видимости бокового меню
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.auth.loggedIn;
    },
    catalogs() {
      return this.$store.getters.getCategories;
    },
  },
  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible; // Переключение состояния меню
    },
    async handleLogout() {
      try {
        await this.$store.dispatch("logout");
      } catch (error) {
        console.error("Ошибка при выходе:", error);
      }
    },
    closeMenu() {
      console.log("закрыто");
      this.menuVisible = false;
    },
  },
};
</script>
<style src="~/assets/css/components/header.css"></style>
<style scoped></style>

<template>
  <header class="header">
    <div class="sides_header">
    <nav class="nav-routes">
      <!-- Кнопка гамбургера для мобильных устройств -->
      <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle menu">
        <span class="menu-icon" :class="{'open': menuVisible}"></span>
      </button>

      <!-- Боковое меню -->
      <div :class="{'side-menu': true, 'show': menuVisible}">
        <button class="close-menu" @click="toggleMenu" aria-label="Close menu">X</button>
        <ul class="nav-list">
          <li><NuxtLink to="/" @click.native="closeMenu">Главная</NuxtLink></li>
          <li><NuxtLink to="/shop" @click.native="closeMenu">Каталог</NuxtLink></li>
          <li><NuxtLink to="/galery" @click.native="closeMenu">Галерея</NuxtLink></li>
          <li><NuxtLink to="/contact" @click.native="closeMenu">Контакты</NuxtLink></li>
        </ul>
      </div>

      <!-- Основное меню для больших экранов -->
      <ul class="nav-list main-nav">
        <li><NuxtLink to="/">Главная</NuxtLink></li>
        <li><NuxtLink to="/shop">Каталог</NuxtLink></li>
        <li><NuxtLink to="/galery">Галерея</NuxtLink></li>
        <li><NuxtLink to="/contact">Контакты</NuxtLink></li>
      </ul>
    </nav>
    <div class="search-container">
          <Search />
      </div>
  </div>
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

<style scoped>
/* Основной стиль для хедера */
.header {
  background-color: #c32222;
  color: white;
  padding: var(--header-padding);
  position: relative;
  height: var(--header-height);
}

/* Стили для навигационного списка */
.nav-list {
  list-style: none;
  display: inline-block;
  gap: 15px;
}

.nav-list li a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

.nav-list li a:hover {
  text-decoration: underline;
}

/* Стили для бокового меню */
.side-menu {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 180px;
  background-color: #7e0000;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  transform: translateX(-100%); /* Меню скрыто по умолчанию */
  transition: transform 0.3s ease-in-out;
  z-index: 10; /* Убедитесь, что меню поверх остальных элементов */
}

.side-menu.show {
  transform: translateX(0); /* Меню появляется */
}

.side-menu ul {
  list-style: none;
  padding: 0;
}

.side-menu li {
  margin: 20px 0;
}

.side-menu li a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

/* Кнопка закрытия меню */
.close-menu {
  background-color: transparent;
  border: none;
  color: white;
  font-size: 24px;
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
}

/* Кнопка гамбургера */
.menu-toggle {
  display: block;
  background: transparent;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 20; /* Кнопка всегда поверх бокового меню */
}

.sides_header{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Стили для иконки меню (гамбургер) */
.menu-icon {
  width: 25px;
  height: 3px;
  background-color: white;
  position: relative;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.menu-icon::before,
.menu-icon::after {
  content: '';
  position: absolute;
  width: 25px;
  height: 3px;
  background-color: white;
  left: 0;
  transition: transform 0.3s ease;
}

.menu-icon::before {
  top: -8px;
}

.menu-icon::after {
  top: 8px;
}

/* Когда меню открыто, изменяем гамбургер */
.menu-icon.open {
  background-color: transparent; /* Убираем центральную линию */
}

.menu-icon.open::before {
  transform: rotate(45deg);
  top: 0;
}

.menu-icon.open::after {
  transform: rotate(-45deg);
  top: 0;
}

/* Медиа-запрос для мобильных устройств */
@media (max-width: 768px) {
  /* Скрыть основное меню на мобильных устройствах */
  .nav-list.main-nav {
    display: none;
  }

  /* Показать кнопку гамбургера на мобильных устройствах */
  .menu-toggle {
    display: block;
  }

  /* Показать боковое меню при открытии */
  .side-menu.show {
    transform: translateX(0);
  }
}

@media (min-width: 769px) {
  /* Обычное меню для больших экранов */
  .nav-list.main-nav {
    display: flex;
  }

  /* Скрыть кнопку гамбургера на больших экранах */
  .menu-toggle {
    display: none;
  }

  /* Убираем боковое меню на больших экранах */
  .side-menu {
    display: none;
  }
}
</style>

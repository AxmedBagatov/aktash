<template>
  <div class="search">
    <input
      type="text"
      v-model="searchQuery"
      @input="onSearch"
      placeholder="Искать товары..."
      class="search-input"
    />
    <div class="search-results" v-if="products.length && searchQuery">
      <ul>
        <li v-for="product in products" :key="product.product_id">
          <!-- Ссылка на продукт с очисткой поиска -->
          <nuxt-link
            :to="`/shop/${product.category_id}/${product.product_id}`"
            class="search-result-item"
            @click="clearSearch"
          >
            {{ product.name }} — {{ product.price }} ₽
          </nuxt-link>
        </li>
      </ul>
    </div>
    <p v-else-if="searchQuery">Ничего не найдено</p>
  </div>
</template>

<script>
import debounce from "lodash.debounce";

export default {
  data() {
    return {
      searchQuery: "",
      products: [],
    };
  },
  methods: {
    onSearch: debounce(function () {
      if (this.searchQuery.length > 2) {
        this.$store.dispatch("searchProducts", this.searchQuery);
      } else {
        this.products = [];
      }
    }, 300), // Задержка для уменьшения количества запросов

    // Метод для очистки поиска
    clearSearch() {
      this.searchQuery = ""; // Сбрасываем поисковый запрос
      this.products = []; // Очищаем список продуктов
    },
  },
  watch: {
    // Слушаем изменения в Vuex и обновляем список товаров
    "$store.getters.getSearchResults": {
      handler(newResults) {
        this.products = newResults;
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.search {
  position: relative;
  max-width: 400px;
  margin: 0 auto;
}

.search-input {
  max-height: 30px;
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: white; /* Устанавливаем белый текст */
  background-color: transparent; /* Если фон должен быть прозрачным */
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.966); /* Белый с небольшой прозрачностью */
}

.search-results {
  position: absolute;
  background: #fff;
  border: 1px solid #ddd;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

.search-results ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.search-results li {
  padding: 10px;
  border-bottom: 1px solid #f1f1f1;
}

.search-results li:hover {
  background-color: #f9f9f9;
  cursor: pointer;
}
</style>

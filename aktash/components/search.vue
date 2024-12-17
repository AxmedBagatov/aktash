<template>
  <div class="search">
    <input
      type="text"
      v-model="searchQuery"
      @input="onSearch"
      placeholder="Поиск товаров..."
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
      if (this.searchQuery.length > 1) {
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
<style src="~/assets/css/components/search.css"></style>
<style scoped>

</style>

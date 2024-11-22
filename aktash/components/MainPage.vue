<template>
  <div>
    <h2>Категории</h2>
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-else class="fullscreen-div">
      <div v-for="category in categories" :key="category.category_id" class="product-card">
        <h3>{{ category.name }}</h3>
        <img v-if="category.image_url" :src="category.image_url" :alt="category.name" loading="lazy" class="product-image" />
        <p>{{ category.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductAndCategoryList",
  computed: {
    products() {
      return this.$store.getters.getProducts;
    },
    categories() {
      return this.$store.getters.getCategories;
    },
    errorMessage() {
      return this.$store.getters.getErrorMessage;
    },
    loading() {
      return this.$store.getters.isLoading;
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      // Загружаем одновременно продукты и категории
      await this.$store.dispatch('fetchProducts');
      await this.$store.dispatch('fetchCategories');
    }
  }
};
</script>

<style scoped>
.fullscreen-div {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  min-height: 90vh;
  border: 1px solid black;
  padding: 10px;
}

.product-card {
  width: 100%;
  max-width: 300px; /* Ограничение ширины карточек */
  padding: 20px;
  height: auto;
  max-height: 400px;
  border: 1px solid black;
  border-radius: 5px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.product-card h3 {
  font-size: 18px;
  margin: 10px 0;
}

.product-image{
  width: 200px;
  height: 200px;
}

.product-card p {
  font-size: 14px;
  color: #555;
}

.product-card p:first-child {
  font-weight: bold;
}

.product-card p:last-child {
  color: green;
}

.loading {
  text-align: center;
  font-size: 18px;
  color: #666;
  margin-top: 20px;
  animation: blink 1.5s infinite;
}

@keyframes blink {
  50% {
    opacity: 0.5;
  }
}

.error {
  color: red;
  text-align: center;
  font-size: 18px;
}
</style>

<template>
  <div class="fullscreen-div">
    <!-- Отображение индикатора загрузки -->
    <div v-if="loading" class="loading">Загрузка...</div>
    
    <!-- Сообщение об ошибке -->
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <!-- Цикл по продуктам -->
    <div v-else v-for="product in products" :key="product.product_id" class="product-card">
      <h3>{{ product.name }}</h3>
      <img :src="product.image_url" :alt="product.name" loading="lazy" class="product-image" />
      <p>{{ product.description }}</p>
      <p>Цена: {{ product.price }}₽</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductList",
  computed: {
    products() {
      return this.$store.getters.getProducts;
    },
    errorMessage() {
      return this.$store.getters.getErrorMessage;
    },
    loading() {
      return this.$store.getters.isLoading;
    }
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      await this.$store.dispatch('fetchProducts');
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
  height: 300px;
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

<template>
  <div class="catalog-details">
    <div>
      <nuxt-link :to="`/`" class="breadcrumb">Главная</nuxt-link>
      <nuxt-link :to="`/shop/`" class="breadcrumb">/ Каталог</nuxt-link>
    </div>
    
    <!-- Поле сортировки -->
    <div class="sorting-container">
      <h1>{{ categoryName }}</h1>
      <select v-model="sortCriteria" @change="sortProducts">
        <option value="price_asc">Цена (по возрастанию)</option>
        <option value="price_desc">Цена (по убыванию)</option>
        <option value="name_asc">По имени (A-Z)</option>
        <option value="name_desc">По имени (Z-A)</option>
      </select>
    </div>

    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-else>
      <ul class="product-list">
        <li v-for="product in sortedProducts" :key="product.product_id" class="product-item">
          <nuxt-link :to="`/shop/${catalogId}/${product.product_id}`" class="product-link">
            <img :src="product.image_url" alt="Product image" class="product-image" />
            <div class="product-info">
              <h2>{{ product.name }}</h2>
              <p>{{ product.description }}</p>
              <p class="product-price">{{ product.price }} ₽</p>
            </div>
          </nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "CatalogDetails",
  data() {
    return {
      sortCriteria: 'price_asc', // Значение по умолчанию
    };
  },
  async asyncData({ params, store }) {
    const categoryId = params.catalogId;

    try {
      if (!store.getters.getCategories.length) {
        await store.dispatch("fetchCategories");
      }

      await store.dispatch("fetchProductsByCategory", categoryId);

      return { catalogId: categoryId };
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
      return {
        catalogId: categoryId,
        errorMessage: "Не удалось загрузить данные. Попробуйте позже.",
      };
    }
  },
  computed: {
    products() {
      return this.$store.getters.getProducts;
    },
    errorMessage() {
      return this.$store.getters.getErrorMessage;
    },
    loading() {
      return this.$store.getters.isLoading;
    },
    categoryName() {
      const categories = this.$store.getters.getCategories;
      const category = categories.find((cat) => cat.category_id == this.catalogId);

      return category ? category.name : "Неизвестная категория";
    },
    // Отсортированные товары на основе выбранного критерия
    sortedProducts() {
      let sorted = [...this.products]; // Создаем копию массива товаров для сортировки

      if (this.sortCriteria === 'price_asc') {
        sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      } else if (this.sortCriteria === 'price_desc') {
        sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      } else if (this.sortCriteria === 'name_asc') {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
      } else if (this.sortCriteria === 'name_desc') {
        sorted.sort((a, b) => b.name.localeCompare(a.name));
      }

      return sorted;
    }
  },
  methods: {
    sortProducts() {
      // Сортировка выполняется автоматически при изменении значения в поле сортировки
    }
  }
};
</script>

<style scoped>
.catalog-details {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.breadcrumb {
  font-size: 14px;
  color: #007bff;
  text-decoration: none;
  margin-bottom: 10px;
  display: inline-block;
}

.breadcrumb:hover {
  text-decoration: underline;
}

h1 {
  margin-bottom: 20px;
  font-size: 24px;
}

.loading,
.error {
  font-size: 18px;
  color: #ff0000;
}

.sorting-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.sorting-container select {
  padding: 5px 10px;
  font-size: 14px;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  list-style: none;
  padding: 0;
}

.product-item {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: calc(33.333% - 20px);
  text-align: center;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.product-link {
  color: inherit;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 15px;
}

.product-info h2 {
  margin: 0 0 10px;
  font-size: 18px;
  color: #333;
}

.product-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.product-price {
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #000;
}
</style>

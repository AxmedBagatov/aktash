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
            <div class="carousel" @mouseenter="startCarousel(product.product_id)" @mouseleave="stopCarousel(product.product_id)">
              <!-- Блок с каруселью -->
              <div class="carousel-wrapper">
                <div
                  class="carousel-images"
                  :style="{ transform: `translateX(-${currentSlide[product.product_id] * 100}%)` }"
                >
                  <img
                    v-for="(image, index) in product.images"
                    :key="index"
                    :src="image.url"
                    alt="Product image"
                    class="carousel-image"
                  />
                </div>
              </div>
            </div>
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

<script>export default {
  name: "CatalogDetails",
  data() {
    return {
      sortCriteria: "price_asc", // Значение по умолчанию
      currentSlide: {}, // Объект для хранения текущего слайда для каждого товара
      carouselInterval: {}, // Для хранения интервала переключения слайдов
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
    sortedProducts() {
      let sorted = [...this.products];

      if (this.sortCriteria === "price_asc") {
        sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      } else if (this.sortCriteria === "price_desc") {
        sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      } else if (this.sortCriteria === "name_asc") {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
      } else if (this.sortCriteria === "name_desc") {
        sorted.sort((a, b) => b.name.localeCompare(a.name));
      }

      return sorted;
    },
  },
  methods: {
    sortProducts() {
      // Сортировка выполняется автоматически
    },
    startCarousel(productId) {
      if (this.carouselInterval[productId]) return;

      this.carouselInterval[productId] = setInterval(() => {
        this.nextSlide(productId);
      }, 3000); // Меняет слайд каждые 3 секунды
    },
    stopCarousel(productId) {
      clearInterval(this.carouselInterval[productId]);
      this.carouselInterval[productId] = null;
    },
    nextSlide(productId) {
      if (!this.currentSlide[productId]) this.currentSlide[productId] = 0;
      const totalSlides = this.products.find((p) => p.product_id === productId).images.length;
      this.currentSlide[productId] = (this.currentSlide[productId] + 1) % totalSlides;
    },
  },
};

</script>


<style scoped>.catalog-details {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.carousel-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.carousel-images {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-link {
  display: block;
  position: relative;
}

.product-info {
  padding: 15px;
  flex-grow: 1; /* Для равномерного распределения пространства */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

.product-item {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: calc(33.333% - 20px);
  text-align: center;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.product-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  list-style: none;
  padding: 0;
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

.product-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

</style>

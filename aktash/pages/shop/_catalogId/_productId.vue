<template>
  <div class="product-details">
    <div class="routes_catalog">
      <nuxt-link :to="`/`" class="breadcrumb">Главная</nuxt-link>
      <nuxt-link :to="`/shop/`" class="breadcrumb">/ Каталог</nuxt-link>
      <nuxt-link :to="`/shop/${catalogId}`" class="breadcrumb">/ {{ categoryName }}</nuxt-link>
    </div>

    <h1>Продукт: {{ product.name }}</h1>

    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-else>
      <div class="product-info">
        <div class="carousel-wrapper">
          <div
            class="carousel-images"
            :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
          >
            <!-- Перебор изображений и отображение каждого -->
            <img
              v-for="(image, index) in product.images"
              :key="index"
              :src="image.url"
              alt="Image of product"
              class="carousel-image"
            />
          </div>
        </div>
        <div class="product-description">
          <p><strong>Описание:</strong> {{ product.description }}</p>
          <p><strong>Цена:</strong> {{ product.price }} ₽</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentSlide: 0, // Текущий слайд в карусели
      carouselInterval: null, // Для хранения интервала переключения слайдов
    };
  },
  async asyncData({ params, store }) {
    const productId = params.productId;
    const catalogId = params.catalogId;

    try {
      // Запрашиваем данные категорий, если они еще не загружены
      if (!store.getters.getCategories.length) {
        await store.dispatch("fetchCategories");
      }

      // Запрашиваем данные продукта
      await store.dispatch("fetchProductById", productId);
      await store.dispatch("fetchProductsByCategory", catalogId);

      const product = store.getters.getSelectedProduct;

      return {
        catalogId,
        product,
      };
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
      return {
        catalogId,
        product: null,
        errorMessage: "Не удалось загрузить данные. Попробуйте позже.",
      };
    }
  },
  computed: {
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
    product() {
      return this.$store.getters.getSelectedProduct;
    },
  },
  methods: {
    startCarousel() {
      this.carouselInterval = setInterval(() => {
        this.nextSlide();
      }, 3000); // Меняет слайд каждые 3 секунды
    },
    stopCarousel() {
      clearInterval(this.carouselInterval);
      this.carouselInterval = null;
    },
    nextSlide() {
      if (!this.product.images || this.product.images.length === 0) return;
      this.currentSlide = (this.currentSlide + 1) % this.product.images.length;
    },
  },
};
</script>

<style scoped>
.product-details {
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

.routes_catalog {
  font-size: 14px;
  color: #007bff;
  margin-bottom: 20px;
}

.routes_catalog nuxt-link {
  margin-right: 5px;
}

.routes_catalog nuxt-link:hover {
  text-decoration: underline;
}

h1 {
  margin-bottom: 20px;
  font-size: 28px;
  color: #333;
}

.loading,
.error {
  font-size: 18px;
  color: #ff0000;
}

.product-info {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.product-image {
  max-width: 100%;
  width: 400px;
  height: auto;
  object-fit: cover;
}

.product-description {
  max-width: 600px;
}

.product-description p {
  font-size: 16px;
  color: #333;
  margin: 10px 0;
}

.product-description strong {
  font-weight: bold;
}

.product-price {
  font-size: 20px;
  color: #000;
  font-weight: bold;
}
</style>

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
        <!-- Loop through product images -->
        <div v-if="product.images && product.images.length">
          <img
            v-for="(image, index) in product.images"
            :key="index"
            :src="`/shop/${image.url}`" 
            :alt="`Image of ${product.name} - ${index + 1}`"
            class="product-image"
          />
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
  async asyncData({ params, store }) {
    const productId = params.productId; // ID продукта
    const catalogId = params.catalogId; // ID каталога

    try {
      // Запрашиваем данные категорий, если они еще не загружены
      if (!store.getters.getCategories.length) {
        await store.dispatch("fetchCategories");
      }

      // Запрашиваем данные продукта
      await store.dispatch("fetchProductById", productId);
      await store.dispatch("fetchProductsByCategory", catalogId);

      // Получаем данные продукта
      const product = store.getters.getSelectedProduct;
      console.log(product);
      
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
      const categories = this.$store.getters.getCategories; // Получаем категории из хранилища
      // Ищем категорию по `id`, который должен совпадать с `this.catalogId`
      const category = categories.find(
        (cat) => cat.category_id == this.catalogId
      );

      // Логирование для отладки
      console.log(
        `Вывод имени категории: ${category ? category.name : "Не найдено"}`
      );

      // Возвращаем имя категории или 'Неизвестная категория'
      return category ? category.name : "Неизвестная категория";
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

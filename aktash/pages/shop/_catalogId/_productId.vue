<template>
  <div class="product-details">
    <div>
      <p v-if="isLoggedIn">Welcome, {{ user.username }}!</p>
      <p v-else>Please log in to access this page.</p>
    </div>
    <div class="routes_catalog">
      <nuxt-link :to="`/`" class="breadcrumb">Главная / </nuxt-link>
      <nuxt-link :to="`/shop/`" class="breadcrumb">Каталог / </nuxt-link>
      <nuxt-link :to="`/shop/${catalogId}`" class="breadcrumb_last">
        {{ categoryName }}</nuxt-link
      >
    </div>

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
          <div class="product_main_text_div">
            <h1 class="product_main_text">{{ categoryName }}: {{ product.name }}</h1>
          </div>
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
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    user() {
      return this.$store.getters.getUser;
    },
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

<style src="~/assets/css/pages/Product/Product.css"></style>
<style src="~/assets/css/components/breadcrumb.css"></style>
<style scoped></style>

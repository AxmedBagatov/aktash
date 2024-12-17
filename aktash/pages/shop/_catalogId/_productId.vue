<template>
  <div class="product-details">
    <!-- <div>
      <p v-if="isLoggedIn">Welcome, {{ user.username }}!</p>
      <p v-else>Please log in to access this page.</p>
    </div> -->
    <div>
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
        <!--     
    
        <div v-if="product.images && product.images.length" class="product-carousel">
          <img
            v-for="(image, index) in product.images"
            :key="index"
            :src="`/shop/${image.url}`"
            :alt="`Image of ${product.name} - ${index + 1}`"
            class="product-image"
          />
        </div> -->

        <!-- saiudasdiouyasoidusyadiyasoiduasydoiausydoiausydoaisuydoaisudyoasuidyaosiduyasoiduyasoidu -->
        <div v-if="product.images && product.images.length" class="product-slider">
          <!-- Основной карусель -->
          <div class="carousel">
            <div class="carousel-inner">
              <div
                v-for="(image, index) in product.images"
                :key="index"
                :class="['item', index === activeIndex ? 'active' : '']"
              >
                <img
                  :src="`/shop/${image.url}`"
                  :alt="`Image of ${product.name} - ${index + 1}`"
                />
              </div>
            </div>

            <!-- Контролы для переключения слайдов -->
            <button class="prev" @click="prevSlide">Prev</button>
            <button class="next" @click="nextSlide">Next</button>
          </div>

          <!-- Карусель с миниатюрами -->
          <div class="thumbcarousel">
            <div class="carousel-inner">
              <div
                class="item"
                v-for="(image, index) in product.images"
                :key="index"
              >
                <div
                  class="thumb"
                  @click="setActiveSlide(index)"
                >
                  <img
                    :src="`/shop/${image.url}`"
                    :alt="`Thumbnail for ${product.name} - ${index + 1}`"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- аоврпваорпвалпрлавопрвалпорвалпорвалпрвлаопрлваорплвоапрлваопрвалопрвалопрвалопрвалпор -->

        <div class="product-description">
          <div class="product_main_text_div">
            <h1 class="product_main_text">
              {{ categoryName }}: {{ product.name }}
            </h1>
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
      if (!store.getters.getCategories.length) {
        await store.dispatch("fetchCategories");
      }

      await store.dispatch("fetchProductById", productId);
      await store.dispatch("fetchProductsByCategory", catalogId);

      const product = store.getters.getSelectedProduct;
      console.log(product);

      return {
        activeIndex: 0,
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
  methods: {
    // Метод для установки активного слайда
    setActiveSlide(index) {
      this.activeIndex = index;
    },
    // Метод для перехода на следующий слайд
    nextSlide() {
      if (this.activeIndex < this.product.images.length - 1) {
        this.activeIndex++;
      } else {
        this.activeIndex = 0; // Переходим на первый слайд
      }
    },
    // Метод для перехода на предыдущий слайд
    prevSlide() {
      if (this.activeIndex > 0) {
        this.activeIndex--;
      } else {
        this.activeIndex = this.product.images.length - 1; // Переходим на последний слайд
      }
    },
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
      const categories = this.$store.getters.getCategories;
      const category = categories.find(
        (cat) => cat.category_id == this.catalogId
      );
      return category ? category.name : "Неизвестная категория";
    },
  },
};
</script>




<style src="~/assets/css/pages/Product/Product.css"></style>
<style src="~/assets/css/components/breadcrumb.css"></style>

<style scoped>


.product-slider {
  min-width: 800px;
  width: auto;
  padding-left: 0;
  position: relative;
}

.product-slider .carousel-inner {
  position: relative;
}

.product-slider .carousel .item {
  display: none;
}

.product-slider .carousel .item.active {
  display: block;
}

.product-slider .thumbcarousel {
  margin-top: 15px;
  text-align: center;
}

.product-slider .thumbcarousel .thumb {
  display: inline-block;
  margin: 0 10px;
  cursor: pointer;
}

.product-slider .thumbcarousel .thumb img {
  width: 60px;
  height: 60px;
  object-fit: cover;
}

.product-slider button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 20px;
}

.product-slider .prev {
  left: 10px;
}

.product-slider .next {
  right: 10px;
}

.carousel {
  position: relative;
  width: 100%;
  height: 400px;
}

.carousel-inner {
  display: flex;
  justify-content: center;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.carousel .item {
  flex: 1 0 100%;  /* Каждое изображение занимает 100% ширины контейнера */
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel img {
  width: 100%;  /* Заставляем картинку заполнять всю ширину */
  height: 100%;  /* Заставляем картинку заполнять всю высоту */
  object-fit: cover;  /* Картинка будет масштабироваться с сохранением пропорций, заполняя контейнер */
}
</style>

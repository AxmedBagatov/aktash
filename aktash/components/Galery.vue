<template>
  <div class="carousel-container">
    <!-- Индикатор загрузки -->
    <div v-if="loading" class="loading">Загрузка...</div>

    <!-- Левая часть -->
    <div class="carousel-text" v-for="(slide, index) in slides" :key="index" v-show="currentIndex === index">
      <p class="line1">{{ slide.line1 }}</p>
      <p class="line2">{{ slide.line2 }}</p>
      <button class="btn-details">подробнее</button>
      <!-- <div class="button_carousel">
        <button class="arrow left" @click="prevSlide">←</button>
        <button class="arrow right" @click="nextSlide">→</button>
      </div> -->
    </div>

    <!-- Правая часть (слайдер изображений) -->
    <div class="carousel-images">
      <div class="image-slider" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div class="slide" v-for="(product, index) in formattedProducts" :key="product.id">
          <div class="img-container">
            <img class="images_123" :src="`/shop/${product.image_url}`" :alt="product.name" />
          </div>
        </div>
      </div>

      <!-- Индикаторы -->
      <div class="indicators">
        <span v-for="(product, index) in formattedProducts" :key="index" class="indicator"
          :class="{ active: index === currentIndex }" @click="goToSlide(index)"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentIndex: 0,
      autoScrollInterval: null,
      slides: [
        { line1: "Текст1", line2: "Микротекст1" },
        { line1: "Текст2", line2: "Микротекст2" },
        { line1: "Текст3", line2: "Микротекст3" },
        { line1: "Текст4", line2: "Микротекст4" },
      ],
    };
  },

  computed: {
    // Получаем продукты из Vuex
    products() {
      return this.$store.getters.getProducts.slice(0, 4);
    },

    // Форматируем продукты для карусели
    formattedProducts() {
      return this.products.map((product) => {
        const firstImage = product.images?.[0]?.url || "default-image.png"; // Берём первый URL или дефолтное изображение
        return {
          ...product,
          image_url: firstImage, // Добавляем ожидаемое поле image_url
        };
      });
    },

    // Проверка на загрузку продуктов
    loading() {
      return this.$store.getters.isLoading;
    },
  },

  methods: {
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.formattedProducts.length;
    },

    prevSlide() {
      this.currentIndex =
        (this.currentIndex - 1 + this.formattedProducts.length) % this.formattedProducts.length;
    },

    goToSlide(index) {
      this.currentIndex = index;
    },

    startAutoScroll() {
      this.autoScrollInterval = setInterval(this.nextSlide, 3000); // Переключаем каждые 3 секунды
    },

    stopAutoScroll() {
      clearInterval(this.autoScrollInterval); // Останавливаем автопрокрутку
    },

    // Метод для загрузки продуктов, если они еще не загружены
    async loadProductsIfNeeded() {
      if (this.products.length === 0 && !this.loading) {
        await this.$store.dispatch("fetchProducts");
      }
    },
  },

  mounted() {
    this.loadProductsIfNeeded(); // Загружаем продукты, если они не загружены
    this.startAutoScroll(); // Запускаем автопрокрутку при загрузке
  },

  beforeDestroy() {
    this.stopAutoScroll(); // Очищаем таймер при уничтожении компонента
  },
};
</script>


<style scoped>

.carousel-container {
  /* z-index: -2; */
  /* position: absolute; */
  /* top: 0; */
  /* left: 0; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: calc((100vh - (var(--header-height) + var(--header-padding))) + var(--footer-padding));
  margin: auto;
  background-color: antiquewhite;
}

.carousel-text {
  position: absolute;
  color: black;
  z-index: 1;
  bottom: 0;
  left: 20vw;
  bottom: 20vh;
  /* width: 40%;
  height: 40%;
  margin-inline-start: 50px; */
}

.carousel-images {
  overflow: hidden;
  width: 100%;
  /* height: auto; */
  height: 100%;
  
}

.images_123 {
  /* position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  object-fit: none; */
  /* width: 100%;
  /* aspect-ratio: 16 / 9; */
  width: 100%;
}

.img-container {
  width: 100%;
  height: 100%;
  object-fit:cover;
}

.line1 {
  font-size: clamp(1.5rem, 5vw, 3rem);
  font-weight: bold;
  font-family: "Roboto", sans-serif;
  /* Шрифт для первой строки */
  margin-bottom: 10px;
}

.line2 {
  font-size: clamp(1rem, 3vw, 2rem);
  color: gray;
  font-family: "Times New Roman", serif;
  /* Шрифт для второй строки */
}

.button_carousel {
  display: flex;
  /* margin-top: 100px; */
}

.carousel-text p {
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}



.btn-details {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: black;
  background-color: transparent;
  border: 2px solid black;
  border-radius: 5px;
  cursor: pointer;
}

.btn-details:hover {
  color: white;
  /* Изменение цвета текста */
  background-color: black;
  /* Изменение фона */
  border-color: black;
  /* Сохранение контура */
  scale: 0.95;
}

.btn-details .arrow {
  margin-left: 0.5rem;
}



.image-slider {
  display: flex;
  transition: transform 0.5s ease-in-out;
  min-width: 100%;
  height: 100%;
}

.slide {
  min-width: 100%;
  /* Каждое изображение будет занимать 100% ширины слайда */
  height: 100%;
  /* Устанавливаем высоту слайда, чтобы изображение занимало всю область */
}

.slide img {
  /* width: 100%;
  height: 100%; */
  /* Растягиваем изображение по высоте */
  /* object-fit: fill; */
  /* Сохраняем пропорции и растягиваем изображение на весь контейнер */
}

.indicators {
  position: absolute;
  /* bottom: 10px; */
  right: 30px;
  bottom: 10px;
  transform: translateX(-50%);
  display: flex;
  gap: 5px;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: gray;
  cursor: pointer;
  border: 1px solid white;
}

.indicator.active {
  background-color: black;
}

.arrow {
  background-color: transparent;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}

/* Стиль для левой стрелки */
.arrow.left {
  margin-right: 20px;
}

/* Стиль для правой стрелки */
.arrow.right {
  margin-left: 30px;
}
</style>

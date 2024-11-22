<template>
  <div class="carousel-container">
    <!-- Левая часть -->
    <div class="carousel-text"
      v-for="(slide, index) in slides"
      :key="index"
      v-show="currentIndex === index"
    >
      <p class="line1">{{ slide.line1 }}</p>
      <p class="line2">{{ slide.line2 }}</p>
      <button class="btn-details">подробнее</button>
      <div class="button_carousel">
        <button class="arrow left" @click="prevSlide">←</button>
        <button class="arrow right" @click="nextSlide">→</button>
      </div>
    </div>

    <!-- Правая часть -->
    <div class="carousel-images">
      <div
        class="image-slider"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
          class="slide"
          v-for="(product, index) in products"
          :key="product.id"
        >
          <img
            class="images_123"
            :src="product.image_url"
            :alt="product.name"
          />
        </div>
      </div>

      <!-- Индикаторы -->
      <div class="indicators">
        <span
          v-for="(product, index) in products"
          :key="index"
          class="indicator"
          :class="{ active: index === currentIndex }"
          @click="goToSlide(index)"
        ></span>
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
  },
  methods: {
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.products.length;
    },
    prevSlide() {
      this.currentIndex =
        (this.currentIndex - 1 + this.products.length) % this.products.length;
    },
    goToSlide(index) {
      this.currentIndex = index;
    },
  },
};
</script>

<style scoped>
.carousel-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  height: 40%;
  margin: auto;
  background-color: antiquewhite;
}

.carousel-text {
  width: 40%;
  height: 40%;
  margin-inline-start: 50px;
}

.line1 {
  font-size: clamp(1.5rem, 5vw, 3rem);
  font-weight: bold;
  font-family: "Roboto", sans-serif; /* Шрифт для первой строки */
  margin-bottom: 10px;
}

.line2 {
  font-size: clamp(1rem, 3vw, 2rem);
  color: gray;
  font-family: "Times New Roman", serif; /* Шрифт для второй строки */
}

.button_carousel {
  display: flex;
  margin-top: 100px;
}

.carousel-text p {
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.images_123 {
  width: 100%;
  height: 100%;
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
  color: white; /* Изменение цвета текста */
  background-color: black; /* Изменение фона */
  border-color: black; /* Сохранение контура */
  scale: 0.95;
}

.btn-details .arrow {
  margin-left: 0.5rem;
}

.carousel-images {
  position: relative;
  width: 60%;
  height: 60%;
  overflow: hidden;
}

.image-slider {
  display: flex;
  transition: transform 0.5s ease-in-out;
  min-width: 100%; /* Каждое изображение будет занимать 100% ширины слайда */
  height: 100%; 
}

.slide {
  min-width: 100%; /* Каждое изображение будет занимать 100% ширины слайда */
  height: 100%; /* Устанавливаем высоту слайда, чтобы изображение занимало всю область */
}

.slide img {
  width: 100%;
  height: 100%; /* Растягиваем изображение по высоте */
  object-fit: fill; /* Сохраняем пропорции и растягиваем изображение на весь контейнер */
}

.indicators {
  position: absolute;
  bottom: 10px;
  left: 50%;
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

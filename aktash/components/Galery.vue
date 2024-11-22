<template>
  <div class="carousel-container">
    <!-- Левая часть -->
    <div class="carousel-text">
      <h2>Успей обновить интерьер со скидкой</h2>
      <p>До 30 ноября скидка до 65%</p>
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
        <img class="carousel_image"
          v-for="(product, index) in products"
          :key="product.id"
          :src="product.image_url"
          :alt="product.name"
        />
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
    };
  },

  computed: {
    // Получаем продукты из Vuex
    products() {
      return this.$store.getters.getProducts;
    },
  },
  methods: {
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    },
    prevSlide() {
      this.currentIndex =
        (this.currentIndex - 1 + this.images.length) % this.images.length;
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
  margin: auto;
  background-color: antiquewhite;
}

.carousel-text {
  width: 40%;
}

.carousel-text h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.button_carousel {
  display: flex;
}

.carousel_image{
width: 100%;
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

.btn-details .arrow {
  margin-left: 0.5rem;
}

.carousel-images {
  position: relative;
  width: 50%;
  overflow: hidden;
}

.image-slider {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.slide {
  min-width: 100%;
}

.slide img {
  width: 100%;
  object-fit: cover;
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

/* Стиль для кнопок переключения */
.carousel-buttons {
  display: flex;
  justify-content: center;
  margin-top: 10px; /* Отступ сверху, чтобы кнопки не слипались с кнопкой "Подробнее" */
}

.arrow {
  background-color: transparent;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  /* z-index: 2;
  padding: 10px;
  margin: 0 10px;

  position: absolute; 
  top: 100%; */
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

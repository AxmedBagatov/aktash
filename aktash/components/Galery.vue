<template>
  <div class="carousel-container">
    <!-- Левая часть -->
    <div class="carousel-text">
      <h2>Успей обновить интерьер со скидкой</h2>
      <p>До 30 ноября скидка до 65%</p>
      <button class="btn-details">
        подробнее
      <button class="arrow left" @click="prevSlide">←</button>
      <button class="arrow right" @click="nextSlide">→</button>
      </button>
    </div>

    <!-- Правая часть -->
    <div class="carousel-images">
      <div class="image-slider" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div class="slide" v-for="(image, index) in images" :key="index">
          <img :src="image.url" :alt="image.alt" />
        </div>
      </div>

      <!-- Индикаторы -->
      <div class="indicators">
        <span
          v-for="(image, index) in images"
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
      images: [
        { url: "https://picsum.photos/500/300?random=1", alt: "Slide 1" },
        { url: "https://picsum.photos/500/300?random=2", alt: "Slide 2" },
        { url: "https://picsum.photos/500/300?random=3", alt: "Slide 3" },
      ],
    };
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
}

.carousel-text {
  width: 40%;
}

.carousel-text h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
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
  z-index: 2;
  padding: 10px;
  margin: 0 10px;
  
  position: absolute;  /* Устанавливаем абсолютное позиционирование */
  
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

<template>
  <div class="carousel-container-gallery">
    <!-- Индикатор загрузки -->
    <div v-if="loading" class="loading">Загрузка...</div>

    <!-- Левая часть -->
    <div class="carousel-text-gallery" v-for="(slide, index) in slides" :key="index" v-show="currentIndex === index">
      <div class="line"></div>
      <div class="column">
        <div class="line1-gallery">{{ slide.line1 }}</div>
        <div class="line2-gallery">{{ slide.line2 }}</div>
      </div>
      <!-- <div class="right-button"> -->
      <button class="right-button">подробнее</button>
      <!-- </div> -->
      <!-- <div class="button_carousel">
        <button class="arrow left" @click="prevSlide">←</button>
        <button class="arrow right" @click="nextSlide">→</button>
      </div> -->
    </div>

    <!-- Правая часть (слайдер изображений) -->
    <div class="carousel-images-gallery">
      <div class="image-slider-gallery" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div class="slide-gallery" v-for="(product, index) in formattedProducts" :key="product.id">
          <div class="img-container-gallery">
            <img class="images_123-gallery" :src="`/shop/${product.image_url}`" :alt="product.name" />
          </div>
        </div>
      </div>

      <!-- Индикаторы -->
      <div class="indicators-gallery">
        <span v-for="(product, index) in formattedProducts" :key="index" class="indicator-gallery"
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
        { line1: "Смарт-часы \"TimePro X\"", line2: "Ультратонкие смарт-часы с AMOLED-дисплеем, измерением пульса, уровня кислорода в крови и поддержкой уведомлений. Идеальны для активного образа жизни и деловых встреч." },
        { line1: "Робот-пылесос \"CleanBot 360\"", line2: "Интеллектуальный робот-пылесос с функцией влажной уборки, мощным всасыванием и управлением через мобильное приложение. Подходит для всех типов полов." },
        { line1: "Беспроводные наушники \"SoundMax Air\"", line2: "Легкие наушники с активным шумоподавлением и высоким качеством звука. До 24 часов работы от батареи. Комфортное использование даже при длительном ношении." },
        { line1: "Электрогриль \"GrillMaster Pro\"", line2: "Компактный электрогриль с антипригарным покрытием и регулировкой температуры. Идеален для приготовления стейков, овощей и бутербродов в домашних условиях." },
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
.carousel-container-gallery {
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

.line {
  /* color: black;
  z-index: -1;
  position: relative;
  left: 900px;
  bottom: -110px;
  backdrop-filter: blur(19.5px);
  -webkit-backdrop-filter: blur(19.5px);
  height: 100px;
  width: 100vw; */
}

.carousel-text-gallery {
  position: absolute;
  color: black;
  z-index: 1;
  bottom: 0;
  padding-left: 0;
  padding-right: 10%;
  margin-bottom: 10%;
  width: 100%;
  height: fit-content;
  transition: 0.5s;
  display: flex;
  justify-content: space-between;
  /* Ensures space between the two groups */
  align-items: flex-start;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  /* background-color: rgba(255, 255, 255, 0.5); */
  /* background-color: black; */
  /* backdrop-filter: blur(19.5px); */
  /* -webkit-backdrop-filter: blur(19.5px); */
  flex-wrap: wrap;
  /* width: 40%;
  height: 40%;
  margin-inline-start: 50px; */
}

.column {
  display: flex;
  flex-direction: column;
  /* Stack items vertically */
  gap: 10px;
  /* Optional: Space between items */
}

/* .carousel-text-gallery:hover {
  background-color: black;
} */

.carousel-images-gallery {
  overflow: hidden;
  width: 100%;
  /* height: auto; */
  height: 100%;

}

.images_123-gallery {
  /* position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  object-fit: none; */
  /* width: 100%;
  /* aspect-ratio: 16 / 9; */
  width: 100%;
}

.img-container-gallery {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.line1-gallery {
  border: 2px solid white;
  padding: 5px;
  background-color: black;
  font-size: clamp(1.5rem, 5vw, 3rem);
  font-weight: bold;
  color: white;
  flex: 50%
    /* font-family: "Roboto", sans-serif; */
    /* Шрифт для первой строки */
    /* margin-bottom: 10px; */
}

.line2-gallery {
  background-color: black;
  font-size: clamp(0.5rem, 3vw, 1rem);
  color: gray;
  border: 2px solid white;
  padding: 5px;
  flex: 50%
}

/* .button_carousel { */
/* display: flex; */
/* margin-top: 100px; */
/* } */

/* .carousel-text-gallery p {
  font-size: 1.2rem;
} */

/* .right-button {
  height: 100%;
  align-self: center
} */

.right-button {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-size: 20px;
  letter-spacing: 0.1em;
  cursor: pointer;
  align-self: center;
  color: white;
  background-color: black;
  border: 2px solid white;
  padding-left: 10px;
  padding-right: 10px;
  padding: 20px;
  transition: 0.5s;
  /* flex: 1;
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: black;
  background-color: transparent;
  border: 2px solid black;
  border-radius: 5px;
  cursor: pointer; */
}

.right-button:hover {
  color: aqua;
  background-color: rgb(54, 54, 54);
  /* border-color: rgb(54, 54, 54); */
  /* scale: 0.95; */
}

/* .btn-details-gallery .arrow {
  margin-left: 0.5rem;
} */



.image-slider-gallery {
  display: flex;
  transition: transform 0.5s ease-in-out;
  min-width: 100%;
  height: 100%;
}

.slide-gallery {
  min-width: 100%;
  /* Каждое изображение будет занимать 100% ширины слайда */
  height: 100%;
  /* Устанавливаем высоту слайда, чтобы изображение занимало всю область */
}

.indicators-gallery {
  position: absolute;
  /* bottom: 10px; */
  right: 30px;
  bottom: 30px;
  transform: translateX(-50%);
  display: flex;
  gap: 5px;
}

.indicator-gallery {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: gray;
  cursor: pointer;
  border: 1px solid white;
}

.indicator-gallery.active {
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

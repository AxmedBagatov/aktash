<template>
  <div class="catalog-details">
    <div style="margin-left: 10%">
      <nuxt-link :to="`/`" class="breadcrumb">Главная / </nuxt-link>
      <nuxt-link :to="`/shop/`" class="breadcrumb_last">Каталог</nuxt-link>
    </div>

    <!-- Поле сортировки -->
    <div class="CategoryName_main_div">
      <h1 class="CategoryName_main_text">{{ categoryName }}</h1>
    </div>
    <div class="sorting-container">
      <div
        class="sorting-option"
        @click="setSortCriteria('price_asc')"
        :class="{ active: sortCriteria === 'price_asc' }"
      >
        Цена (по возрастанию)
      </div>
      <div
        class="sorting-option"
        @click="setSortCriteria('price_desc')"
        :class="{ active: sortCriteria === 'price_desc' }"
      >
        Цена (по убыванию)
      </div>
    </div>

    <div v-if="isLoggedIn">
      <button
        v-if="isLoggedIn"
        @click="openCreateProductModal"
        class="create-product-btn"
      >
        Создать товар
      </button>
    </div>

    <div v-if="showCreateModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Создать товар</h2>
        <form @submit.prevent="createProduct">
          <div class="product_modal_own_card">
            <div class="left-side">
              <div>
                <input type="hidden" v-model="newProduct.category_id" />
              </div>
              <div>
                <label for="productName">Название</label>
                <input
                  type="text"
                  v-model="newProduct.name"
                  id="productName"
                  required
                />
              </div>
              <div>
                <label for="productPrice">Цена</label>
                <input
                  type="number"
                  v-model="newProduct.price"
                  id="productPrice"
                  required
                />
              </div>
              <div>
                <label for="productDescription">Описание</label>
                <textarea
                  v-model="newProduct.description"
                  id="productDescription"
                  required
                ></textarea>
              </div>

              <!-- Поле для загрузки изображений -->
              <div>
                <label for="productImages">Фотографии</label>
                <input
                  type="file"
                  id="productImages"
                  @change="handleFileUpload"
                  multiple
                  accept="image/*"
                />
              </div>
            </div>

            <div v-if="newProduct.images.length" class="rightside">
              <h4>Загруженные изображения:</h4>
              <vuedraggable
                v-model="newProduct.images"
                :options="{ handle: '.drag-handle' }"
                @end="updateImageIndexes"
              >
                <div
                  v-for="(image, index) in newProduct.images"
                  :key="index"
                  class="image-item"
                >
                  <!-- Здесь изображение становится перетаскиваемым -->
                  <div
                    class="drag-handle"
                    :style="{ backgroundImage: `url(${getImageUrl(image)})` }"
                  >
                    <span class="image-number">{{ index + 1 }}</span>
                    <span class="drag-handle-icon">☰</span>

                    <!-- Иконка для перетаскивания -->
                  </div>

                  <img
                    :src="getImageUrl(image)"
                    :alt="image.name"
                    class="preview-image"
                  />
                  <!-- Отображаем номер изображения в массиве -->
                </div>
              </vuedraggable>
            </div>
          </div>
          <button type="submit">Создать</button>
          <button @click="closeCreateProductModal" type="button">
            Закрыть
          </button>
        </form>
      </div>
    </div>

    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-else>
      <ul class="product-list">
        <li
          v-for="product in sortedProducts"
          :key="product.product_id"
          class="product-item"
        >
          <nuxt-link
            :to="`/shop/${catalogId}/${product.product_id}`"
            class="product-link"
          >
            <div
              class="carousel"
              @mouseenter="startCarousel(product.product_id)"
              @mouseleave="stopCarousel(product.product_id)"
            >
              <!-- Блок с каруселью -->
              <div class="carousel-wrapper">
                <div
                  class="catalog-carousel-images"
                  :style="{
                    transform: `translateX(-${
                      currentSlide[product.product_id] * 100
                    }%)`,
                  }"
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
              <div class="carousel-indicators">
                <div
                  v-for="(image, index) in product.images"
                  :key="index"
                  class="carousel-indicator"
                  :class="{ active: currentSlide[product.product_id] === index }"
                  @mouseover="handleIndicatorHover(index, image)"
                ></div>
              </div>
            </div>
            <div class="product-info">
              <h2>{{ product.name }}</h2>
              <p>{{ product.description }}</p>
              <p class="product-price">{{ product.price }} ₽</p>
            </div>
          </nuxt-link>
          <!-- Delete Button for Logged-In Users -->
          <div v-if="isLoggedIn">
            <button
              @click="deleteProduct(product.product_id)"
              class="delete-btn"
            >
              Удалить
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// Не забудьте импортировать vuedraggable
import draggable from "vuedraggable";

export default {
  name: "CatalogDetails",
  components: {
    draggable,
  },
  data() {
    return {
      sortCriteria: "price_asc", // Default value
      currentSlide: {},
      carouselInterval: {},
      showCreateModal: false,
      newProduct: {
        name: "",
        price: "",
        description: "",
        images: [],
        category_id: this.$route.params.catalogId,
      }, // Добавлено свойство images
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
    isLoggedIn() {
      // Печатаем состояние в консоль, чтобы убедиться, что оно актуально
      console.log("User logged in:", this.$store.getters.isLoggedIn);
      return this.$store.getters.isLoggedIn;
    },
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
      const category = categories.find(
        (cat) => cat.category_id == this.catalogId
      );

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
    getImageUrl(image) {
      if (image && image.file instanceof File) {
        // Проверяем, что это файл
        return URL.createObjectURL(image.file); // Генерация URL для изображений в браузере
      }
      return ""; // Возвращаем пустую строку, если код выполняется на сервере или объект некорректный
    },
    updateImageIndexes() {
      this.newProduct.images.forEach((image, index) => {
        image.index = index + 1; // Обновляем индекс каждого изображения
      });
    },
    setSortCriteria(criteria) {
    this.sortCriteria = criteria;
  },
    handleFileUpload(event) {
      const files = event.target.files;
      this.newProduct.images = Array.from(files).map((file, index) => ({
        file, // само изображение
        index: index + 1, // индекс изображения (начинаем с 1)
      }));
    },
    openCreateProductModal() {
      this.showCreateModal = true;
    },
    closeCreateProductModal() {
      this.showCreateModal = false;
    },
    handleIndicatorHover(index, image) {
      // Устанавливаем текущий слайд при наведении на индикатор
      console.log(index, image)
      this.currentSlide[this.productId] = index;
    },

    async createProduct() {
      try {
        // Добавляем category_id в newProduct, используя catalogId
        const productData = {
          ...this.newProduct,
          category_id: this.catalogId, // Используем catalogId, так как это правильное имя переменной
        };

        // Загружаем изображения
        const upload_images = await this.uploadImages();
        console.log(
          "Полученные изображения внутри createProduct:",
          upload_images
        );

        // Обновляем список изображений в productData
        productData.images = upload_images;

        // Логируем данные
        console.log(productData);

        // Отправляем данные на сервер
        await this.$store.dispatch("createProduct", productData);

        // Закрываем модальное окно и сбрасываем данные
        this.closeCreateProductModal();
        this.newProduct = {
          name: "",
          price: "",
          description: "",
          images: [],
          category_id: this.catalogId, // Обязательно сбрасываем category_id
        };
      } catch (error) {
        console.error("Ошибка при создании товара с изображениями:", error);
      }
    },
    async uploadImages() {
      try {
        const formData = new FormData();

        // Преобразуем изображения в объект с индексами
        this.newProduct.images.forEach((imageObj) => {
          formData.append("images[]", imageObj.file);
          formData.append("indexes[]", imageObj.index);
        });

        // Укажите путь к папке, где нужно сохранить изображения
        formData.append("path", "static/shop/Article/"); // Пример пути

        // Отправляем FormData в Vuex
        const response = await this.$store.dispatch("setImages", formData);

        // Проверяем и логируем полученные изображения
        console.log("Ответ от сервера с изображениями:", response);

        // Извлекаем значения из реактивных объектов
        if (response && response.data && Array.isArray(response.data.images)) {
          return response.data.images; // Просто возвращаем полученный массив
        } else {
          console.error(
            "Ошибка: Некорректная структура данных в ответе:",
            response
          );
          return []; // Возвращаем пустой массив в случае ошибки
        }
      } catch (error) {
        console.error("Ошибка при загрузке изображений:", error);
        throw error;
      }
    },

    deleteProduct(productId) {
      if (window.confirm("Вы точно хотите удалить этот товар?")) {
        // Находим товар по ID и собираем изображения для удаления
        const product = this.sortedProducts.find(
          (product) => product.product_id === productId
        );

        // Собираем изображения для удаления
        const imagesToDelete = product.images.map((image) => ({
          url: image.url, // Путь к изображению
          product_id: productId,
        }));

        // Отправляем запрос через Vuex для удаления изображений и товара
        this.$store
          .dispatch("deleteProduct", { productId, imagesToDelete })
          .then(() => {
            console.log("Товар и изображения успешно удалены");
          })
          .catch((error) => {
            console.error("Ошибка при удалении товара:", error);
          });
      }
    },
    startCarousel(productId) {
      console.log(productId )
      if (this.carouselInterval[productId]) return;
      this.carouselInterval[productId] = setInterval(() => {
        this.nextSlide(productId);
        console.log("next")
      }, 3000);
    },
    stopCarousel(productId) {
      clearInterval(this.carouselInterval[productId]);
      this.carouselInterval[productId] = null;
    },
    nextSlide(productId) {
      if (!this.currentSlide[productId]) this.currentSlide[productId] = 0;
      const product = this.products.find((p) => p.product_id === productId);
      if (product && product.images) {
        const totalSlides = product.images.length;
        this.currentSlide[productId] =
          (this.currentSlide[productId] + 1) % totalSlides;
      } else {
        console.error(
          `Продукт с ID ${productId} не найден или не имеет изображений.`
        );
      }
    },
  },
};
</script>

<style src="~/assets/css/pages/CatalogView/CatalogView_sort.css"></style>
<style src="~/assets/css/pages/CatalogView/CatalogView.css"></style>
<style src="~/assets/css/pages/CatalogView/CatalogView_admin.css"></style>
<style src="~/assets/css/components/breadcrumb.css"></style>
<style scoped>




.create-product-btn {
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 10px;
}

.create-product-btn:hover {
  background: #0056b3;
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.carousel-indicator {
  width: 10px;
  height: 10px;
  margin: 0 5px;
  background-color: gray;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.carousel-indicator.active {
  background-color: black;
}


.loading,
.error {
  font-size: 18px;
  color: #ff0000;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  list-style: none;
  padding: 0;
}

.product-item {
  /* background: #f9f9f9; */
  /* border: 1px solid #ddd; */
  /* border-radius: 8px; */
  width: calc(33.333% - 20px);
  text-align: center;
  overflow: hidden;
  /* box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  z-index: 1;
}

.product-item:hover {
  /* transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); */
}

.product-link {
  color: inherit;
  text-decoration: none;
}

.carousel-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.catalog-carousel-images {
  display: flex;
  transition: transform 0.3s ease;
  /* object-fit: cover; */

}

.carousel-image {
  min-width: 100%;
  /* height: 100%; */
  object-fit: fill;

}

.product-info {
  text-align: left;
  /* align-self: left; */
  padding: 15px;
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
  font-weight: bold;
  color: #333;
}

.delete-btn {
  background: #dc3545;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn:hover {
  background: #c82333;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 70%;
  max-width: 90%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-height: 90vh;
}

.modal-content h2 {
  margin-bottom: 20px;
}

.modal-content form input,
.modal-content form textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-content button {
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
}


.modal-content button:hover {
  background: #007bff;
  color: white;
}

.product_modal_own_card {
  display: flex;
}

.rightside {
  margin-inline: 10%;
}

.image-item {
  position: relative;
  display: inline-block;
  margin: 10px;
  width: 150px; /* Ширина изображения */
  height: 150px; /* Высота изображения */
  overflow: hidden; /* Чтобы изображение не выходило за пределы контейнера */
}

/* Контейнер для перетаскиваемого изображения */
.drag-handle {
  width: 100%;
  height: 100%;
  background-size: contain; /* Ожидаем, что изображение будет уменьшаться, сохраняя соотношение сторон */
  background-repeat: no-repeat;
  background-position: center;
  cursor: move;
  position: absolute;
  top: 0;
  left: 0;
}

/* Превью изображения */
.preview-image {
  width: 100%; /* Устанавливаем ширину изображения в 100% от родительского контейнера */
  height: 100%; /* Устанавливаем высоту изображения в 100% от родительского контейнера */
  object-fit: contain; /* Сохраняем соотношение сторон и масштабируем изображение */
  border-radius: 5px; /* Скругление углов (по желанию) */
  object-fit: cover;
}
.image-number {
  position: absolute;
  top: 10px; /* Расположение сверху */
  left: 10px; /* Расположение слева */
  background-color: rgba(0, 0, 0, 0.5); /* Полупрозрачный фон */
  color: white; /* Белый цвет текста */
  padding: 5px; /* Немного отступов */
  border-radius: 50%; /* Круглая форма */
  font-weight: bold;
}
</style>

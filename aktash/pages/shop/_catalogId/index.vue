<template>
  <div class="catalog-details">
    <div class="breadcrumbs">
      <nuxt-link :to="`/`" class="breadcrumb">Главная</nuxt-link>
      <div>/</div>
      <nuxt-link :to="`/shop/`" class="breadcrumb">Каталог</nuxt-link>
      <div>/</div>
      <p class="breadcrumb_last">{{ categoryName }}</p>
    </div>

    <!-- Поле сортировки -->
    <div class="category-name-container">
      <div class="category-name">
        {{ categoryName }}
      </div>
      <div class="category-product-count">({{ products.length }})</div>
    </div>
    <div class="category-name-sort-buttons">
      <!-- <div class="CategoryName_main_div">
        {{ categoryName }}
      </div> -->
      <div class="sorting-container">
        <div class="sorting-text">Отсортировать товары:</div>
        <div
          class="sorting-option"
          @click="setSortCriteria('price_asc')"
          :class="{ active: sortCriteria === 'price_asc' }"
        >
          сначала дешевле
        </div>
        <div
          class="sorting-option"
          @click="setSortCriteria('price_desc')"
          :class="{ active: sortCriteria === 'price_desc' }"
        >
          сначала дороже
        </div>
      </div>
    </div>

    <div v-if="isLoggedIn">
      <button
        v-if="isLoggedIn"
        @click="openCreateProductModal"
        class="adminButtons"
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
      <div class="product-list-wrapper">

        <div
          v-bind:class="
            products.length < 3 ? 'product-list-less-than-two' : 'product-list'
          "
        >
          <div
            v-for="product in sortedProducts"
            :key="product.product_id"
            class="product-item"
          >
            <nuxt-link
              :to="`/shop/${catalogId}/${product.product_id}`"
              class="product-link"
            >
              

              <div class="catalog-carousel">
                <!-- Блок с каруселью -->
                <div
                  class="catalog-carousel-wrapper"
                  @mousemove="
                    handleMouseMove(product.product_id, $event, product)
                  "
                  @mouseleave="resetSlide(product.product_id)"
                >
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
                  <div class="catalog-carousel-indicators">
                    <div
                      v-for="(image, index) in product.images"
                      :key="index"
                      class="catalog-carousel-indicator"
                      :class="{
                        active: currentSlide[product.product_id] === index,
                      }"
                    ></div>
                  </div>
                </div>
              </div>
              <div class="catalog-product-info">
                <div class="catalog-product-name-info">
                  <div class="catalog-product-name">{{ product.name }}</div>
                  <div class="catalog-product-order-info">Под заказ</div>
                </div>

                <div class="catalog-product-price">{{ product.price }} ₽</div>
              </div>
              <div class="line"></div>
              <div class="button-container">
                <button class="to-cart">В корзину</button>
              </div>
            </nuxt-link>

            <div v-if="isLoggedIn">
              <button
                @click="deleteProduct(product.product_id)"
                class="adminButtons"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      </div>
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
      sorted.forEach((item) => {
        this.$set(this.currentSlide, item.product_id, 0);
      });
      console.log("sorted here...");
      console.log(sorted);
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
    handleIndicatorHover(productId, index) {
      if (!this.currentSlide[productId]) {
        this.$set(this.currentSlide, productId, index); // Обеспечивает реактивность
      } else {
        this.currentSlide[productId] = index; // Обновляем индекс
      }
    },
    resetSlide(productId) {
      this.currentSlide[productId] = 0;
    },

    handleMouseMove(productId, event, product) {
      const carouselWrapper = event.currentTarget;
      const rect = carouselWrapper.getBoundingClientRect(); // Получаем размеры элемента
      const mouseX = event.clientX - rect.left; // Позиция мыши относительно элемента
      const width = rect.width; // Ширина элемента
      // console.log(product)
      const totalImages = product.images.length; // Количество изображений

      // Вычисляем индекс на основе позиции мыши
      const newIndex = Math.floor((mouseX / width) * totalImages);

      // Если индекс изменился, обновляем его
      if (
        newIndex >= 0 &&
        newIndex < totalImages &&
        this.currentSlide[productId] !== newIndex
      ) {
        this.$set(this.currentSlide, productId, newIndex); // Устанавливаем текущий индекс слайда
      }
    },
    async createProduct() {
      try {
        const productData = {
          ...this.newProduct,
          category_id: this.catalogId, // Используем catalogId
        };

        // Загружаем изображения
        const upload_images = await this.uploadImages();
        productData.images = upload_images;

        // Отправляем данные на сервер
        await this.$store.dispatch("createProduct", productData);

        // Повторно загружаем продукты из категории
        await this.$store.dispatch("fetchProductsByCategory", this.catalogId);

        // Закрываем модальное окно и сбрасываем данные
        this.closeCreateProductModal();
        this.newProduct = {
          name: "",
          price: "",
          description: "",
          images: [],
          category_id: this.catalogId,
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

.catalog-carousel-indicators {
  position: absolute;
  /* Position the indicators over the image */
  bottom: 10px;
  /* Adjust to your preference */
  left: 50%;
  /* Center horizontally */
  transform: translateX(-50%);
  /* Center alignment */
  display: flex;
  justify-content: center;
  gap: 10px;
  /* Space between indicators */
  z-index: 5;
}

/* .catalog-carousel {
  height: 400px;
} */

.catalog-carousel-indicator {
  width: 30px;
  height: 2px;
  margin: 0 5px;
  background-color: gray;
  /* border-radius: 50%; */
  cursor: pointer;
  transition: background-color 0.3s ease;
  z-index: 10;
}

.catalog-carousel-indicator.active {
  background-color: #c32222;
}

.loading,
.error {
  font-size: 18px;
  color: #ff0000;
}

.product-list-wrapper {
  display: flex;
  justify-items: center;
}

.category-name-container {
  font-family: Geologica;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.category-name {
  font-size: 60px;
  /* font-weight: bold; */
}

.category-product-count {
  font-size: 25px;
  color: #c32222;
}

.product-list {
  margin: 0 auto;
  /* width: 80%; */
  width: 100%;
  overflow: hidden;
  margin-top: 20px;
  margin-bottom: 20px;
  display: grid;
  /* place-items: center; */
  /* justify-items: center; */
  /* place-self: center; */
  justify-content: space-between;
  justify-items: center;
  align-content: space-around;
  align-items: center;
  /* gap: calc( (80% - 600px * 3 ) / 3); */
  grid-template-columns: repeat(auto-fit, minmax(550px, 30px));
  grid-template-rows: auto;
  gap: 30px;
}

.product-list-less-than-two {
  margin: 0 auto;
  width: 100%;
  overflow: hidden;
  margin-top: 20px;
  margin-bottom: 20px;
  display: grid;
  /* place-items: center; */
  /* justify-items: center; */
  /* place-self: center; */
  justify-content: start;
  justify-items: center;
  align-content: space-around;
  align-items: center;
  /* gap: calc( (80% - 600px * 3 ) / 3); */
  grid-template-columns: repeat(auto-fit, minmax(600px, 30px));
  grid-template-rows: auto;
  gap: 60px;
}

/* .product-list {
  margin-inline: 10%;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  list-style: none;
  padding: 0;
} */

.product-item {
  /* background: #f9f9f9; */
  /* border: 1px solid #ddd; */
  /* border-radius: 8px; */
  /* width: calc(33.333% - 20px); */
  width: 100%;
  text-align: center;
  overflow: hidden;
  /* box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  z-index: 1;
}

/* .product-item:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
} */

.product-link {
  color: inherit;
  text-decoration: none;
}

.catalog-carousel-wrapper {
  position: relative;
  height: 320px;
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
  object-fit: cover;
}

.catalog-product-info {
  font-family: Geologica;
  text-align: left;
  /* align-self: left; */
  padding: 10px 0 10px 0;
}

.catalog-product-name {
  /* margin: 0 0 10px; */
  color: #333;
}

.catalog-product-description {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.catalog-product-order-info {
  font-size: 14px;
  padding: 5px;
  color: black;
  background-color: goldenrod;
}

.catalog-product-name-info {
  display: flex;
  margin-bottom: 10px;
  /* font-size: 20px; */
  justify-content: space-between;
  align-items: center;
}

.catalog-product-price {
  font-size: 30px;
  /* font-weight: bold; */
  color: #333;
}

.line {
  background-color: black;
  width: 100%;
  height: 1px;
}

.to-cart {
  font-family: Geologica;
  font-size: 20px;
  color: white;
  /* visibility: hidden; */
  opacity: 0;
  margin-top: 10px;
  padding: 20px;
  width: 100%;
  text-align: center;
  background-color: black;
  transition: 0.5s;
}

.product-link:hover .to-cart {
  transition: 0.5s;
  opacity: 1;
  /* visibility: visible; */
  /* background-color: #007bff; */
}

.to-cart:hover {
  background-color: goldenrod;
  color: black;
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
  width: 150px;
  /* Ширина изображения */
  height: 150px;
  /* Высота изображения */
  overflow: hidden;
  /* Чтобы изображение не выходило за пределы контейнера */
}

/* Контейнер для перетаскиваемого изображения */
.drag-handle {
  width: 100%;
  height: 100%;
  background-size: contain;
  /* Ожидаем, что изображение будет уменьшаться, сохраняя соотношение сторон */
  background-repeat: no-repeat;
  background-position: center;
  cursor: move;
  position: absolute;
  top: 0;
  left: 0;
}

/* Превью изображения */
.preview-image {
  width: 100%;
  /* Устанавливаем ширину изображения в 100% от родительского контейнера */
  height: 100%;
  /* Устанавливаем высоту изображения в 100% от родительского контейнера */
  object-fit: contain;
  /* Сохраняем соотношение сторон и масштабируем изображение */
  border-radius: 5px;
  /* Скругление углов (по желанию) */
  object-fit: cover;
}

.image-number {
  position: absolute;
  top: 10px;
  /* Расположение сверху */
  left: 10px;
  /* Расположение слева */
  background-color: rgba(0, 0, 0, 0.5);
  /* Полупрозрачный фон */
  color: white;
  /* Белый цвет текста */
  padding: 5px;
  /* Немного отступов */
  border-radius: 50%;
  /* Круглая форма */
  font-weight: bold;
}
</style>

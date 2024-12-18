<template>
  <div class="product-details">
    <div>
      <button @click="showEditProductModal">Редактировать продукт</button>
    </div>

    <div>
      <nuxt-link :to="`/`" class="breadcrumb">Главная / </nuxt-link>
      <nuxt-link :to="`/shop/`" class="breadcrumb">Каталог / </nuxt-link>
      <nuxt-link :to="`/shop/${catalogId}`" class="breadcrumb">
        {{ categoryName }} / </nuxt-link
      >
      <p class="breadcrumb_last"> {{ product.name  }}</p>
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
        <div
          v-if="product.images && product.images.length"
          class="product-slider"
        >
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
            <button class="prev" @click="prevSlide">
              <font-awesome-icon
                :icon="['fas', 'arrow-left']"
                style="font-size: 30px"
              />
            </button>
            <button class="next" @click="nextSlide">
              <font-awesome-icon
                :icon="['fas', 'arrow-right']"
                style="font-size: 30px"
              />
            </button>
          </div>

          <!-- Карусель с миниатюрами -->
          <div class="thumbcarousel">
            <div class="carousel-inner">
              <div
                class="thumb"
                v-for="(image, index) in product.images"
                :key="index"
                @click="setActiveSlide(index)"
                :class="{ active: index === activeIndex }"
              >
                <img
                  :src="`/shop/${image.url}`"
                  :alt="`Thumbnail for ${product.name} - ${index + 1}`"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="product-description">
          <div class="product_main_text_div">
            <!-- <h1 class="product_main_text">
              {{ categoryName }}
            </h1> -->
            <h1 class="product_main_text">
              {{ product.name }}
            </h1>
          </div>
          <p><strong>Описание:</strong> {{ product.description }}</p>
          <p><strong>Цена:</strong> {{ product.price }} ₽</p>
        </div>
      </div>
    </div>

    <div v-if="editProduct" class="update-product-modal">
      <div class="modal-window-update-product">
        <div>
          <h2>Редактирование продукта</h2>

          <form @submit.prevent="updateProduct" class="product-edit-form">
            <div class="product-edit-form_flex">
            <div class="product-edit-form__left">
              <!-- Название продукта -->
              <label for="product_name" class="product-edit-form__label"
                >Название продукта:</label
              >
              <input
                type="text"
                id="product_name"
                v-model="editProductData.name"
                placeholder="Введите название продукта"
                required
                class="product-edit-form__input"
              />

              <!-- Описание продукта -->
              <label for="product_description" class="product-edit-form__label"
                >Описание продукта:</label
              >
              <textarea
                id="product_description"
                v-model="editProductData.description"
                placeholder="Введите описание продукта"
                required
                class="product-edit-form__textarea"
              ></textarea>

              <!-- Цена продукта -->
              <label for="product_price" class="product-edit-form__label"
                >Цена продукта:</label
              >
              <input
                type="number"
                id="product_price"
                v-model="editProductData.price"
                placeholder="Введите цену"
                required
                class="product-edit-form__input"
              />
            </div>

            <div class="product-edit-form__right">
              <!-- Текущие изображения -->
              <div
                v-if="editProductData.images.length > 0"
                class="product-edit-form__images"
              >
                <p class="product-edit-form__images-title">
                  Текущие изображения:
                </p>
                <div class="product-edit-form__image-gallery">
                  <div
                    v-for="(image, index) in editProductData.images"
                    :key="index"
                    class="product-edit-form__image-item"
                  >
                    <img
                      :src="`/shop/${image.url}`"
                      alt="Preview"
                      class="product-edit-form__preview-image"
                    />
                    <button
                      type="button"
                      @click="removeImage(index)"
                      class="product-edit-form__remove-image"
                    >
                      Удалить изображение
                    </button>
                  </div>
                </div>
              </div>

              <!-- Загрузка нового изображения -->
              <div
                v-if="editProductData.images.length < 5"
                class="product-edit-form__file-upload"
              >
                <label for="product_image" class="product-edit-form__label"
                  >Новое изображение:</label
                >
                <input
                  id="product_image"
                  type="file"
                  accept="image/*"
                  @change="onFileChange"
                  multiple
                  class="product-edit-form__file-input"
                />
              </div>
            </div>
          </div>

            <div class="product-edit-form__modal-actions">
              <button type="submit" class="product-edit-form__submit-btn">
                Сохранить изменения
              </button>
              <button
                type="button"
                @click="cancelEditProduct"
                class="product-edit-form__cancel-btn"
              >
                Отмена
              </button>
            </div>
          </form>

          <button @click="closeEditProductModal">Закрыть без сохранения</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editProductData: {
        name: "",
        description: "",
        price: 0,
        images: [],
      },
    };
  },
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
        editProduct: false,
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
    showEditProductModal() {
      this.editProductData = {
        name: this.product.name,
        description: this.product.description,
        price: this.product.price,
        images: this.product.images || [],
      };
      this.editProduct = true;
    },
    cancelEditProduct() {
      this.editProduct = false;
    },
    closeEditProductModal() {
      this.editProduct = false;
      console.log(this.editProduct);
    },

    async updateProduct() {
      try {
        const updatedProduct = {
          name: this.editProductData.name,
          description: this.editProductData.description,
          price: this.editProductData.price,
          image_url: this.editProductData.image_url, // Логика обработки изображения (если нужно)
        };

        // Отправка данных на сервер
        await this.$store.dispatch("updateProduct", updatedProduct);

        this.closeEditProductModal();
        console.log("Продукт успешно обновлён");
      } catch (error) {
        console.error("Ошибка обновления продукта:", error);
      }
    },
    removeImage(index) {
      this.editProductData.images.splice(index, 1); // Удаление изображения по индексу
    },
    onFileChange(event) {
      const files = event.target.files;
      if (files.length > 0) {
        // Обрабатываем каждый файл и добавляем в массив изображений
        for (let file of files) {
          this.editProductData.images.push({
            url: URL.createObjectURL(file),
            file: file, // Храним сам файл для отправки на сервер
          });
        }
      }
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
<style src="~/assets/css/pages/Product/Product_admin.css"></style>
<style src="~/assets/css/components/breadcrumb.css"></style>

<style scoped>

/* Основной стиль формы */
.product-edit-form {
  
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  margin: 20px auto;
  max-width: 1200px;
}

.product-edit-form_flex{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

/* Левая часть с полями ввода */
.product-edit-form__left {
  flex: 1;
  min-width: 300px;
}

.product-edit-form__label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.product-edit-form__input,
.product-edit-form__textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.product-edit-form__input[type="number"] {
  -moz-appearance: textfield; /* Для Firefox, чтобы не было стрелок */
}

.product-edit-form__textarea {
  min-height: 150px;
}

/* Правая часть с изображениями */
.product-edit-form__right {
  flex: 0 0 320px;
  min-width: 300px;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #ddd;
}

.product-edit-form__images-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.product-edit-form__image-gallery {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.product-edit-form__image-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-edit-form__preview-image {
  max-width: 80px;
  max-height: 80px;
  object-fit: cover;
  border-radius: 5px;
}

.product-edit-form__remove-image {
  background-color: #ff4d4d;
  border: none;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.product-edit-form__remove-image:hover {
  background-color: #e03e3e;
}

.product-edit-form__file-upload input[type="file"] {
  margin-top: 10px;
  font-size: 14px;
}

/* Стили для кнопок */
.product-edit-form__modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.product-edit-form__submit-btn,
.product-edit-form__cancel-btn {
  padding: 10px 20px;
  border: none;
  background-color: #4CAF50;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.product-edit-form__submit-btn:hover {
  background-color: #45a049;
}

.product-edit-form__cancel-btn {
  background-color: #f44336;
}

.product-edit-form__cancel-btn:hover {
  background-color: #d32f2f;
}
</style>

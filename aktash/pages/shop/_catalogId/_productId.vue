<template>
  <div class="product-details">
    <div>
      <button v-if="isLoggedIn" @click="showEditProductModal">
        Редактировать продукт
      </button>
    </div>
    <div>
      <div class="breadcrumbs">
        <nuxt-link :to="`/`" class="breadcrumb">Главная</nuxt-link>
        <div>/</div>
        <nuxt-link :to="`/shop/`" class="breadcrumb">Каталог</nuxt-link>
        <div>/</div>
        <nuxt-link :to="`/shop/${catalogId}`" class="breadcrumb">{{
          categoryName
        }}</nuxt-link>
        <div>/</div>
        <p class="breadcrumb_last">{{ product.name }}</p>
      </div>
    </div>

    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-else>
      <div class="product-info">
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
                  class="product-carousel-main-images"
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
          <div class="product-attributes-title">Характеристики</div>
          <div class="product-attributes-grid" v-if="product.attributes">
            <div class="product-attributes" v-for="attr in product.attributes">
              <div class="prduct-attributes-container">
                <!-- <div v-for="(key, value) in attr"> -->
                  <div class="product-attribute-key">{{ beautifyText(attr.key) }}</div>
                  <div class="product-attribute-value">{{ beautifyText(attr.value) }}</div>
                <!-- </div> -->
              </div>
              <div class="product-attribute-underline"></div>
            </div>
          </div>
        </div>

        <div class="product-description">
          <div class="product-main-text-div">
            <!-- <h1 class="product_main_text">
              {{ categoryName }}
            </h1> -->
            <h1 class="product-main-text">
              {{ product.name }}
            </h1>
          </div>
          <div class="product-price">{{ fancyPrice(product.price) }} ₽</div>
          <div class="product-description-underline"></div>
          <div class="product-article-number-wrapper">
            <div class="product-article-number-info">Артикул товара:</div>
            <div class="product-article-number">{{ productId }}</div>
          </div>
          <div class="product-button-to-cart-wrapper">
            <button class="product-button-to-cart">В корзину</button>
          </div>
          <div class="one-click-button-wrapper">
            <button class="one-click-button">
              Купить товар в 1 клик
              <div class="one-click-button-underline"></div>
            </button>
          </div>

          <p>{{ product.description }}</p>
        </div>
      </div>
      <!-- <div class="product-attributes-grid" v-if="product.attributes">
        <h2>Характеристики</h2>
        <div class="product-attributes" v-for="attr in product.attributes">
          <div v-for="(key, value) in attr">{{ (key, value) }}</div>
        </div>
      </div> -->
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
                <label
                  for="product_description"
                  class="product-edit-form__label"
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

                <div class="product-stock-label">
                  <label
                    for="productStock"
                    style="width: auto; min-width: 150px"
                  >
                    В наличии
                  </label>
                  <input
                    type="checkbox"
                    v-model="editProductData.stock"
                    id="productStock"
                    class="product-stock-checkbox"
                  />
                </div>

                <div>
                  <h4>Характеристики (ключ-значение)</h4>
                  <div
                    v-for="(attribute, index) in editProductData.attributes"
                    :key="index"
                    style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 10px;
                    "
                  >
                    <label>Ключ:</label>
                    <input
                      type="text"
                      v-model="attribute.key"
                      placeholder="Ключ"
                      required
                    />
                    <label>Значение:</label>
                    <input
                      type="text"
                      v-model="attribute.value"
                      placeholder="Значение"
                      required
                    />
                    <button type="button" @click="removeAttribute(index)">
                      Удалить
                    </button>
                  </div>
                  <button type="button" @click="addAttribute">
                    Добавить характеристику
                  </button>
                </div>
              </div>

              <div class="product-edit-form__right">
                <!-- Текущие изображения -->
                <div v-if="images.length > 0" class="product-edit-form__images">
                  <p class="product-edit-form__images-title">Изображения:</p>
                  <vuedraggable
                    v-model="images"
                    group="images"
                    class="product-edit-form__image-gallery"
                    @end="handleDrop"
                  >
                    <div
                      v-for="(image, index) in visibleImages"
                      :key="`image-${index}`"
                      class="product-edit-form__image-item"
                    >
                      <img
                        :src="image.preview || `/shop/${image.url}`"
                        alt="Preview"
                        class="product-edit-form__preview-image"
                      />
                      <p class="image-index">Индекс: {{ index + 1 }}</p>
                      <button
                        type="button"
                        @click="removeImage(index)"
                        class="product-edit-form__remove-image"
                      >
                        Удалить
                      </button>
                    </div>
                  </vuedraggable>
                </div>

                <!-- Загрузка нового изображения -->
                <div
                  v-if="editProductData.images.length < 15"
                  class="product-edit-form__file-upload"
                >
                  <label for="product_image" class="product-edit-form__label"
                    >Новое изображение:</label
                  >
                  <input
                    id="product_image"
                    type="file"
                    accept="image/*"
                    @change="addImage"
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
import Draggable from "vuedraggable";
export default {
  components: {
    Draggable,
  },
  data() {
    return {
      images: [],
      editProductData: {
        catalogId: "",
        productId: "",
        name: "",
        description: "",
        price: 0,
        images: [],
        stock: true,
        attributes: [],
      },
      dragStartIndex: null,
      productId: "",
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
        productId,
        product,
        editProduct: false,
      };
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
      return {
        catalogId,
        productId,
        product: null,
        errorMessage: "Не удалось загрузить данные. Попробуйте позже.",
      };
    }
  },
  methods: {
    setActiveSlide(index) {
      this.activeIndex = index;
    },
    handleDragStart(index) {
      this.dragStartIndex = index;
    },
    addAttribute() {
      // Убедитесь, что attributes — это массив
      if (!Array.isArray(this.editProductData.attributes)) {
        this.editProductData.attributes = [];
      }
      this.editProductData.attributes.push({ key: "", value: "" });
    },
    removeAttribute(index) {
      this.editProductData.attributes.splice(index, 1);
    },
    nextSlide() {
      if (this.activeIndex < this.product.images.length - 1) {
        this.activeIndex++;
      } else {
        this.activeIndex = 0;
      }
    },

    prevSlide() {
      if (this.activeIndex > 0) {
        this.activeIndex--;
      } else {
        this.activeIndex = this.product.images.length - 1;
      }
    },

    showEditProductModal() {
      this.images = [
        ...this.product.images.map((image) => ({
          ...image,
          isNew: false,
          isDelete: false,
        })),
      ];

      this.editProductData = {
        name: this.product.name,
        description: this.product.description,
        price: this.product.price,
        stock: this.product.stock !== undefined ? this.product.stock : true,
        attributes: Array.isArray(this.product.attributes)
          ? [...this.product.attributes]
          : [],
        images: this.images,
      };
      this.updateImageIndexes();
      this.editProduct = true;
    },
    cancelEditProduct() {
      this.editProduct = false;
    },
    closeEditProductModal() {
      this.editProduct = false;
    },
    beautifyText(text) {
      try {
        return text.charAt(0).toUpperCase()+ text.toLowerCase().slice(1)
      } catch {
        return text
      }
    },
    fancyPrice(price) {
      return Math.round(price)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      // return Math.round(price);
    },
    addImage(event) {
      const files = Array.from(event.target.files);
      const newImages = [];

      files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = {
            id: null,
            preview: e.target.result,
            url: "",
            file,
            isNew: true,
            isDelete: false,
            index: this.images.length + index + 1, // Присваиваем индекс новому изображению
          };

          newImages.push(newImage);

          if (newImages.length === files.length) {
            // Обновляем массив изображений, включая новые с индексами
            this.images = [...this.images, ...newImages];
            this.editProductData.images = [...this.images];
            this.updateImageIndexes(); // Обновление индексов в editProductData
          }
        };
        reader.readAsDataURL(file);
      });
    },
    removeImage(index) {
      const visibleImage = this.visibleImages[index];
      const realIndex = this.images.findIndex(
        (image) => image === visibleImage
      );

      if (realIndex >= 0) {
        if (!this.images[realIndex].isNew) {
          this.images[realIndex].isDelete = true;
          // Перемещаем удалённое изображение в конец
          const [deletedImage] = this.images.splice(realIndex, 1);
          this.images.push(deletedImage);
        } else {
          this.images.splice(realIndex, 1);
        }
      }
      this.updateImageIndexes();
    },
    handleDrop() {
      this.updateImageIndexes();
      console.log("Текущий массив", this.images);
    },
    updateImageIndexes() {
      this.images.forEach((image, index) => {
        image.index = index + 1;
      });
    },
    async updateProduct() {
      this.editProductData.attributes = JSON.stringify(
        this.editProductData.attributes
      );
      this.editProductData.images.forEach((image) => {
        if (image.isNew) {
          image.preview = null;
        }
      });
      this.editProductData.productId = this.productId;
      this.editProductData.catalogId = this.catalogId;
      console.log("Отправляемые данные", this.editProductData);

      try {
        const updatedProduct = await this.$store.dispatch(
          "updateProduct",
          this.editProductData
        );
        console.log("Продукт успешно обновлен:", updatedProduct);
      } catch (error) {
        console.error("Ошибка при обновлении продукта:", error);
      }
      this.closeEditProductModal();
    },
  },
  computed: {
    visibleImages() {
      return this.images.filter((image) => !image.isDelete);
    },
    allImages() {
      // Объединяем старые и новые изображения в один массив
      return [
        ...(this.editProductData.images || []), // Если images undefined, заменим на пустой массив
        ...(this.editProductData.newImages || []), // Если newImages undefined, заменим на пустой массив
      ];
    },
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

.product-edit-form_flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

/* Левая часть с полями ввода */
.product-edit-form__left {
  flex: 1;
  min-width: 100px;
  width: auto;
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

/* .product-edit-form__input[type="number"] {
  -moz-appearance: textfield;
} */

.product-edit-form__textarea {
  min-height: 150px;
}

/* Правая часть с изображениями */
.product-edit-form__right {
  width: auto;
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
  background-color: #4caf50;
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

.product-edit-form__image-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
}

.image-index {
  margin-top: 5px;
  font-size: 14px;
  color: #666;
}

.product-carousel-main-images {
  object-fit: contain;
}
</style>

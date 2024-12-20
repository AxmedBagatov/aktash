<template>
  <div>
    <div v-if="isLoggedIn" class="admin-controls">
      <button @click="showAddCategoryForm">Add Category</button>
    </div>

    <div class="catalogs-category-text">Категории</div>
    <!-- <div style="margin-left: 10%">
      <nuxt-link class="breadcrumb" :to="`/`">Главная</nuxt-link>
    </div> -->

    <!-- Updated loading and error display -->
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>

    <div v-else>
      <div class="product-list-wrapper">
        <div v-if="catalogs.length > 0" class="product-list">
          <div v-for="catalog in catalogs" :key="catalog.category_id" class="catalog-item">
            <nuxt-link :to="`/shop/${catalog.category_id}`" class="catalog-link">
              <div class="image-container">
                <img v-if="catalog.image_url" :src="`/${catalog.image_url}`" :alt="catalog.name"
                  class="catalog-image" />
              </div>
              <div class="catalog-info">
                <h2>{{ catalog.name }}</h2>
                <p>{{ catalog.description }}</p>
              </div>
            </nuxt-link>

            <div v-if="isLoggedIn" class="admin-actions">
              <button @click="showEditCategoryForm(catalog.category_id)">
                Edit
              </button>
              <button @click="confirmDelete(catalog.category_id)">Delete</button>
            </div>
          </div>
        </div>
        <!-- Message if there are no catalogs -->
        <p v-else>Категорий пока нет</p>
      </div>
    </div>

    <!-- Модальное окно для добавления категории -->
    <div v-if="showAddForm" class="modal-overlay">
      <div class="modal-content">
        <h3>Add New Category</h3>
        <form @submit.prevent="addCategory">
          <input v-model="newCategory.name" placeholder="Category Name" required />
          <textarea v-model="newCategory.description" placeholder="Category Description" required></textarea>
          <input type="file" accept="image/*" @change="onFileChange" />
          <div class="modal-actions">
            <button type="submit">Add Category</button>
            <button @click="cancelAddCategory">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Модальное окно для редактирования категории -->
    <div v-if="showEditForm" class="modal-overlay">
      <div class="modal-content">
        <h3>Edit Category</h3>
        <form @submit.prevent="updateCategory">
          <label for="category_id">Category ID:</label>
          <input type="text" id="category_id" v-model="editCategoryData.category_id" readonly />
          <input v-model="editCategoryData.name" placeholder="Category Name" required />
          <textarea v-model="editCategoryData.description" placeholder="Category Description" required></textarea>

          <!-- If there is an image -->
          <div v-if="editCategoryData.image_url">
            <p>Current Image:</p>
            <img :src="`/${editCategoryData.image_url}`" alt="Preview" class="preview-image" />
            <button type="button" @click="removeImage">Remove Image</button>
          </div>

          <!-- If there is no image, show the file input -->
          <input v-if="!editCategoryData.image_url" type="file" accept="image/*" @change="onFileChange" />

          <div class="modal-actions">
            <button type="submit">Update Category</button>
            <button type="button" @click="cancelEditCategory">Cancel</button>
          </div>
        </form>
      </div>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductAndCategoryList",
  data() {
    return {
      showAddForm: false,
      showEditForm: false,
      newCategory: {
        name: "",
        description: "",
        image_url: "",
        category_id: null, // Добавленное поле для хранения ID
      },
      editCategoryData: {
        name: "",
        description: "",
        image_url: "",
        category_id: null,
      },
      editingCategoryId: null,
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    user() {
      return this.$store.getters.getUser;
    },
    catalogs() {
      return this.$store.getters.getCategories;
    },
    errorMessage() {
      return this.$store.getters.getErrorMessage;
    },
    loading() {
      return this.$store.getters.isLoading;
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    showNotification(message) {
      alert(message); // Замените на кастомный компонент уведомления, если нужно
    },
    async fetchData() {
      try {
        await this.$store.dispatch("fetchCategories"); // Загрузить все категории
        console.log(this.catalogs);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    },

    // Показать форму добавления категории
    showAddCategoryForm() {
      this.showAddForm = true;
      this.newCategory = { name: "", description: "", image_url: "" }; // Очистить поля
    },

    // Закрыть форму
    cancelAddCategory() {
      this.showAddForm = false;
    },

    cancelEditCategory() {
      this.showEditForm = false;
    },

    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        console.log(this.selectedFile);
        this.selectedFile = file; // Сохраняем выбранный файл
      }
    },
    async renameImage(newPath) {
      try {
        const updatedPath = await this.$store.dispatch("renameFile", {
          oldPath: this.newCategory.image_url,
          newPath,
        });
        this.newCategory.image_url = updatedPath; // Обновляем путь в форме
      } catch (error) {
        console.error("Ошибка переименования файла:", error);
      }
    },

    async uploadImage(formData) {
      if (!formData) return; // Если нет данных для отправки, выходим
      try {
        // Загружаем файл, передавая formData в экшн store
        const fileData = await this.$store.dispatch("uploadFile", formData);
        console.log("Файл успешно загружен:", fileData); // Выводим данные о файле, если нужно
      } catch (error) {
        console.error("Ошибка загрузки файла:", error); // Логируем ошибку, если что-то пошло не так
      }
    },

    // Метод для добавления новой категории
    async addCategory() {
      try {
        if (this.selectedFile) {
          console.log(this.selectedFile);
          const categoryName = this.newCategory.name;
          const description = this.newCategory.description;

          // Формируем FormData для загрузки файла
          const formData = new FormData();
          formData.append("file", this.selectedFile); // Добавляем файл

          // Загружаем файл
          const fileData = await this.$store.dispatch("uploadFile", formData);
          console.log("Файл успешно загружен:", fileData);

          // Формируем данные для создания категории
          const categoryData = {
            categoryName: categoryName,
            description: description,
            filePath: fileData.filePath, // Передаем путь к файлу
          };

          // Создаем категорию
          const categoryResult = await this.$store.dispatch(
            "createCategory",
            categoryData
          );
          console.log("Категория успешно создана:", categoryResult);

          // Сбрасываем форму
          this.showAddForm = false;
          this.newCategory = { name: "", description: "", image_url: "" };
          this.fetchData(); // Обновление данных
        }
      } catch (error) {
        console.error("Ошибка при добавлении категории:", error);
      }
    },

    showEditCategoryForm(categoryId) {
      this.showEditForm = true;
      // console.log(this.catalogs);
      const category = this.catalogs.find((c) => c.category_id === categoryId);
      // console.log(category);
      // console.log(category.image_url);
      this.editCategoryData = {
        category_id: category.category_id,
        name: category.name,
        description: category.description,
        image_url: category.image_url,
      }; // Заполняем поля формы данными категории
      this.editingCategoryId = categoryId;
    },

    // Метод для обновления категории
    async updateCategory() {
      try {
        const categoryId = this.editCategoryData.category_id;
        const categoryName = this.editCategoryData.name;
        const description = this.editCategoryData.description;

        // Если выбрали новый файл
        let filePath = this.editCategoryData.filePath; // Путь файла, если не обновляется, оставляем старый

        if (this.selectedFile) {
          console.log(this.selectedFile);
          const formData = new FormData();
          formData.append("file", this.selectedFile); // Добавляем новый файл
          const fileData = await this.$store.dispatch("uploadFile", formData);
          filePath = fileData.filePath; // Обновляем путь к файлу
          console.log("Файл успешно загружен:", fileData);
        }

        // Создание данных для обновления категории
        const categoryData = {
          categoryId,
          categoryName,
          description,
          filePath, // Путь к файлу
        };

        // Обновляем категорию
        const updateResult = await this.$store.dispatch(
          "updateCategory",
          categoryData
        );
        console.log("Категория успешно обновлена:", updateResult);

        // Сбрасываем форму
        this.showEditForm = false;
        this.editCategoryData = { name: "", description: "", image_url: "" }; // Сброс формы
        this.fetchData(); // Обновление данных
      } catch (error) {
        console.error("Ошибка при обновлении категории:", error);
      }
    },

    // Удалить категорию
    async deleteCategory(categoryId) {
      try {
        // Отправляем запрос на удаление категории
        await this.$store.dispatch("deleteCategory", categoryId);

        // Если удаление прошло успешно, обновляем список категорий
        await this.fetchData();
      } catch (error) {
        // Если ошибка с кодом 400
        if (error.response && error.response.status === 400) {
          // Уведомляем пользователя о причине невозможности удаления
          this.$store.commit(
            "setErrorMessage",
            error.response.data.message || "Невозможно удалить категорию"
          );

          // Вызываем метод для показа уведомления
          this.showNotification("Ошибка: " + error.response.data.message);
        } else {
          // Обрабатываем общие ошибки
          console.error("Ошибка при удалении категории:", error);
          this.$store.commit("setErrorMessage", "Ошибка сети или сервера");
          this.showNotification("Ошибка: невозможно связаться с сервером.");
        }
      }
    },
    async removeImage() {
      const categoryId = this.editCategoryData.category_id;
      const imagesPath = `static/${this.editCategoryData.image_url}`;
      console.log(imagesPath);

      if (!this.editCategoryData.image_url) return;

      try {
        await this.$store.dispatch("deleteImage", {
          filePath: imagesPath,
          categoryId: categoryId,
        });

        // console.log("в запросе",imagesPath);
        this.editCategoryData.image_url = null; // Убираем URL
        this.selectedFile = null;
      } catch (error) {
        console.error("Ошибка при удалении изображения:", error);
      }
    },
    confirmDelete(categoryId) {
      // Отображаем предупреждение
      const confirmed = confirm("Подтвердить удаление категории?");
      if (confirmed) {
        this.deleteCategory(categoryId);
      }
    },
  },
};
</script>

<style src="~/assets/css/pages/Catalogs/Catalogs.css"></style>
<style src="~/assets/css/pages/Catalogs/Catalogs_admin.css"></style>
<style src="~/assets/css/components/breadcrumb.css"></style>
<style scoped></style>

<template>
  <div class="catalogs">
    <div v-if="isLoggedIn" class="admin-controls">
      <button @click="showAddCategoryForm">Add Category</button>
    </div>

    <nuxt-link class="breadcrumb" :to="`/`">Главная</nuxt-link>
    <h1>Категории</h1>

    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-else>
      <ul class="catalog-list">
        <li
          v-for="catalog in catalogs"
          :key="catalog.category_id"
          class="catalog-item"
        >
          <nuxt-link :to="`/shop/${catalog.category_id}`" class="catalog-link">
            <img
              v-if="catalog.image_url"
              :src="`/${catalog.image_url}`"
              :alt="catalog.name"
              class="catalog-image"
            />
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
        </li>
      </ul>
    </div>

    <!-- Модальное окно для добавления категории -->
    <div v-if="showAddForm" class="modal-overlay">
      <div class="modal-content">
        <h3>Add New Category</h3>
        <form @submit.prevent="addCategory">
          <input
            v-model="newCategory.name"
            placeholder="Category Name"
            required
          />
          <textarea
            v-model="newCategory.description"
            placeholder="Category Description"
            required
          ></textarea>
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
          <input
            type="text"
            id="category_id"
            v-model="editCategoryData.category_id"
            readonly
          />
          <input
            v-model="editCategoryData.name"
            placeholder="Category Name"
            required
          />
          <textarea
            v-model="editCategoryData.description"
            placeholder="Category Description"
            required
          ></textarea>

          <!-- Если есть изображение -->
          <div v-if="editCategoryData.image_url">
            <p>Current Image:</p>
            <img
              :src="`/${editCategoryData.image_url}`"
              alt="Preview"
              class="preview-image"
            />
            <button type="button" @click="removeImage">Remove Image</button>
          </div>

          <!-- Поле для загрузки файла отображается только если image_url пустой -->
          <input
            v-if="!editCategoryData.image_url"
            type="file"
            accept="image/*"
            @change="onFileChange"
          />

          <div class="modal-actions">
            <button type="submit">Update Category</button>
            <button type="button" @click="cancelEditCategory">Cancel</button>
          </div>
        </form>
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
        category_id: null, // Добавленное поле для хранения ID
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
    async fetchData() {
      try {
        await this.$store.dispatch("fetchCategories"); // Загрузить все категории
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
          console.log("Category Name:", categoryName);
          console.log("id:", this.newCategory.category_id);
          const formData = new FormData();
          formData.append("file", this.selectedFile); // Добавляем файл
          formData.append("description", description);
          formData.append("categoryName", categoryName); // Добавляем имя категории в FormData
          await this.uploadImage(formData); // Передаем formData в uploadImage
        }

        // await this.$store.dispatch("addCategory", this.newCategory); // Отправляем данные категории
        this.showAddForm = false;
        this.newCategory = { name: "", description: "", image_url: "" }; // Сброс формы
        this.fetchData(); // Обновление данных
      } catch (error) {
        console.error("Ошибка при добавлении категории:", error);
      }
    },

    async removeImage() {
      const imagesPath = `images/${this.editCategoryData.image_url}`;
      console.log(imagesPath);

      if (!this.editCategoryData.image_url) return;

      try {
        await this.$store.dispatch("deleteImage", imagesPath);

        console.log("в запросе",imagesPath);
        this.editCategoryData.image_url = null; // Убираем URL
      } catch (error) {
        console.error("Ошибка при удалении изображения:", error);
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
        // console.log(this.editCategoryData.category_id);
        // console.log(this.editCategoryData.name);
        // console.log(this.editCategoryData.description);
        // console.log(this.editCategoryData.image_url);
        // if (this.selectedFile) {
        //   await this.uploadImage(); // Загружаем и переименовываем файл перед обновлением категории
        // }
        // await this.$store.dispatch("updateCategory", {
        //   id: this.editCategoryData.category_id,
        //   name: this.editCategoryData.name,
        //   description: this.editCategoryData.description,
        //   image_url: this.editCategoryData.image_url,
        // });
        // this.editCategoryData = {
        //   name: "",
        //   description: "",
        //   image_url: "",
        //   category_id: null,
        // }; // Сброс формы
        this.fetchData(); // Обновление данных
      } catch (error) {
        console.error("Ошибка при обновлении категории:", error);
      }
    },
    // Удалить категорию
    async deleteCategory(categoryId) {
      try {
        await this.$store.dispatch("deleteCategory", categoryId);
        await this.fetchData(); // Обновить список категорий
      } catch (error) {
        console.error("Ошибка при удалении категории:", error);
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

<style scoped>
.catalogs {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.preview-image {
  width: 100%;
  height: auto;
  max-height: 300px;
}

.breadcrumb {
  font-size: 14px;
  color: #007bff;
  text-decoration: none;
  margin-bottom: 10px;
  display: inline-block;
}

.breadcrumb:hover {
  text-decoration: underline;
}

h1 {
  margin-bottom: 20px;
  font-size: 24px;
}

.loading,
.error {
  font-size: 18px;
  color: #ff0000;
}

.catalog-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  list-style: none;
  padding: 0;
}

.catalog-item {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: calc(33.333% - 20px);
  text-align: center;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.catalog-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.catalog-link {
  color: inherit;
  text-decoration: none;
}

.catalog-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.catalog-info {
  padding: 15px;
}

.catalog-info h2 {
  margin: 0 0 10px;
  font-size: 18px;
  color: #333;
}

.catalog-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.admin-controls {
  margin-top: 20px;
}

.admin-actions {
  margin-top: 10px;
}

.admin-actions button {
  background: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  margin: 5px;
  cursor: pointer;
}

.admin-actions button:hover {
  background: #0056b3;
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
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.modal-content h3 {
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

.modal-content .modal-actions {
  display: flex;
  justify-content: space-between;
}

.modal-content .modal-actions button {
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
}

.modal-content .modal-actions button:hover {
  background: #007bff;
  color: white;
}
</style>

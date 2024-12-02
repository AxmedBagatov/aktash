<template>
  <div class="catalogs">
    <!-- <div>
      <p v-if="isLoggedIn">Welcome, {{ user.username }}!</p>
      <p v-else>Please log in to access this page.</p>
    </div> -->

    <!-- Отображаем кнопки для добавления и редактирования категорий только для авторизованных пользователей -->
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

          <!-- Кнопки для редактирования и удаления только для авторизованных пользователей -->
          <div v-if="isLoggedIn" class="admin-actions">
            <button @click="editCategory(catalog.category_id)">Edit</button>
            <button @click="deleteCategory(catalog.category_id)">Delete</button>
          </div>
        </li>
      </ul>
    </div>

    <!-- Модальное окно для добавления и редактирования категории -->
    <div v-if="showAddForm" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ isEditMode ? "Edit Category" : "Add New Category" }}</h3>
        <form @submit.prevent="isEditMode ? updateCategory() : addCategory">
          <div v-if="isEditMode">
            <label for="category_id">Category ID:</label>
            <input
              type="text"
              id="category_id"
              v-model="newCategory.category_id"
              placeholder="Category ID"
              readonly
            />
          </div>
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
          <div v-if="newCategory.image_url">
            <p>Current Image:</p>
            <img
              :src="newCategory.image_url"
              alt="Preview"
              class="preview-image"
            />
            <button @click="removeImage">Remove Image</button>
          </div>
          <div class="modal-actions">
            <button type="submit">
              {{ isEditMode ? "Update" : "Add" }} Category
            </button>
            <button @click="cancelAddCategory">Cancel</button>
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
      isEditMode: false,
      newCategory: {
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
      this.isEditMode = false;
      this.newCategory = { name: "", description: "", image_url: "" }; // Очистить поля
    },

    // Показать форму редактирования категории
    editCategory(categoryId) {
      this.showAddForm = true;
      this.isEditMode = true;
      const category = this.catalogs.find((c) => c.category_id === categoryId);
      this.newCategory = { ...category }; // Заполняем поля формы данными категории
      this.editingCategoryId = categoryId;
    },

    // Закрыть форму
    cancelAddCategory() {
      this.showAddForm = false;
    },

    // Метод для добавления новой категории
    async addCategory() {
      try {
        await this.$store.dispatch("addCategory", this.newCategory);
        this.showAddForm = false;
        this.newCategory = { name: "", description: "", image_url: "" };
        await this.fetchData(); // Обновить список категорий
      } catch (error) {
        console.error("Ошибка при добавлении категории:", error);
      }
    },

    // Метод для обновления категории
    async updateCategory() {
      try {
        await this.$store.dispatch("updateCategory", {
          id: this.newCategory.category_id, // Используем category_id из newCategory
          name: this.newCategory.name,
          description: this.newCategory.description,
          image_url: this.newCategory.image_url,
        });
        this.showAddForm = false;
        this.newCategory = {
          name: "",
          description: "",
          image_url: "",
          category_id: null,
        }; // Очистить все поля
        await this.fetchData(); // Обновить список категорий
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
  },
};
</script>

<style scoped>
.catalogs {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.preview-image{
  max-width: 400px;
  max-height: 400px;
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

<template>
  <div class="catalogs">
    <div>
      <p v-if="isLoggedIn">Welcome, {{ user.username }}!</p>
      <p v-else>Please log in to access this page.</p>
    </div>

    <!-- Отображаем кнопки для добавления, редактирования и удаления категорий только для авторизованных пользователей -->
    <div v-if="isLoggedIn" class="admin-controls">
      <button @click="showAddCategoryForm">Add Category</button>
    </div>

    <nuxt-link class="breadcrumb" :to="`/`">Главная</nuxt-link>
    <h1>Категории</h1>

    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-else>
      <ul class="catalog-list">
        <li v-for="catalog in catalogs" :key="catalog.category_id" class="catalog-item">
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

    <!-- Форма для добавления новой категории -->
    <div v-if="showAddForm" class="add-category-form">
      <h3>Add New Category</h3>
      <form @submit.prevent="addCategory">
        <input v-model="newCategory.name" placeholder="Category Name" required />
        <textarea v-model="newCategory.description" placeholder="Category Description" required></textarea>
        <input v-model="newCategory.image_url" placeholder="Image URL" />
        <button type="submit">Add Category</button>
        <button @click="cancelAddCategory">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductAndCategoryList",
  data() {
    return {
      showAddForm: false,
      newCategory: {
        name: '',
        description: '',
        image_url: '',
      },
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
        await this.$store.dispatch("fetchCategories");
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    },

    // Показать форму добавления категории
    showAddCategoryForm() {
      this.showAddForm = true;
    },

    // Скрыть форму добавления категории
    cancelAddCategory() {
      this.showAddForm = false;
    },

    // Метод для добавления новой категории
    async addCategory() {
      try {
        await this.$store.dispatch("addCategory", this.newCategory);
        this.showAddForm = false; // Закрыть форму
        this.newCategory = { name: '', description: '', image_url: '' }; // Очистить поля формы
      } catch (error) {
        console.error("Ошибка при добавлении категории:", error);
      }
    },

    // Редактировать категорию
    editCategory(categoryId) {
      this.$router.push(`/edit-category/${categoryId}`);
    },

    // Удалить категорию
    async deleteCategory(categoryId) {
      try {
        await this.$store.dispatch("deleteCategory", categoryId);
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
</style>

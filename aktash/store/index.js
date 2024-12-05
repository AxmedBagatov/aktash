// const BASE_URL = 'http://192.168.62.129:4000';
const BASE_URL = 'http://10.30.74.229:4000';
export const state = () => ({
  products: [],
  categories: [],
  searchResults: [],
  selectedProduct: null,
  errorMessage: '',
  loading: false,
  auth: {
    loggedIn: false,   // Флаг для проверки авторизован ли пользователь
    user: null,        // Данные пользователя
  },
});
export const mutations = {
  // Продукты
  setProducts(state, products) {
    state.products = products;
  },
  setCategories(state, categories) {
    state.categories = categories;
  },
  setLoading(state, isLoading) {
    state.loading = isLoading;
  },
  setErrorMessage(state, message) {
    state.errorMessage = message;
  },
  setSelectedProduct(state, product) {
    state.selectedProduct = product;
  },
  setSearchResults(state, results) {
    state.searchResults = results;
  },

  // Авторизация
  setUser(state, user) {
    state.auth.loggedIn = true;
    state.auth.user = user;
  },
  logout(state) {
    state.auth.loggedIn = false;
    state.auth.user = null;
  },
};

export const actions = {
  // Продукты
  async fetchProducts({ commit }) {
    try {
      commit('setLoading', true);
      const response = await fetch(`${BASE_URL}/api/products`);
      if (response.ok) {
        const data = await response.json();
        console.log("проверка даты", data);
        commit('setProducts', data);
      } else {
        commit('setErrorMessage', 'Ошибка при получении данных продуктов');
        console.error('Ошибка при получении данных продуктов');
      }
    } catch (error) {
      commit('setErrorMessage', 'Ошибка сети: ' + error.message);
      console.error('Ошибка сети:', error);
    } finally {
      commit('setLoading', false);
    }
  },
// Добавление категории
// async addCategory({ commit, state }, { name, description, image_url }) {
//   try {
//     commit('setLoading', true);
//     const response = await fetch(`${BASE_URL}/api/categories`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ name, description, image_url }),
//       credentials: 'include',
//     });

//     if (response.ok) {
//       const data = await response.json();
//       commit('setCategories', [...state.categories, data]); // Добавляем категорию
//     } else {
//       commit('setErrorMessage', 'Ошибка при добавлении категории');
//       console.error('Ошибка при добавлении категории');
//     }
//   } catch (error) {
//     commit('setErrorMessage', 'Ошибка сети: ' + error.message);
//     console.error('Ошибка сети:', error);
//   } finally {
//     commit('setLoading', false);
//   }
// },


// Редактирование категории
async updateCategory({ commit, state }, { id, name, description, image_url }) {
  try {
    commit('setLoading', true);
    const response = await fetch(`${BASE_URL}/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, image_url }),
      credentials: 'include',
    });

    if (response.ok) {
      const updatedCategory = await response.json();
      const updatedCategories = state.categories.map(category =>
        category.category_id === updatedCategory.category_id ? updatedCategory : category
      );
      commit('setCategories', updatedCategories); // Обновляем категорию в списке
    } else {
      commit('setErrorMessage', 'Ошибка при обновлении категории');
      console.error('Ошибка при обновлении категории');
    }
  } catch (error) {
    commit('setErrorMessage', 'Ошибка сети: ' + error.message);
    console.error('Ошибка сети:', error);
  } finally {
    commit('setLoading', false);
  }
},

// Удаление категории
async deleteCategory({ commit, state }, id) {
  try {
    commit('setLoading', true);
    const response = await fetch(`${BASE_URL}/api/categories/${id}`, {
      method: 'DELETE',
      credentials: 'include', // Включаем cookies
    });

    if (response.ok) {
      const filteredCategories = state.categories.filter(category => category.category_id !== id);
      commit('setCategories', filteredCategories); // Удаляем категорию из списка
    } else {
      commit('setErrorMessage', 'Ошибка при удалении категории');
      console.error('Ошибка при удалении категории');
    }
  } catch (error) {
    commit('setErrorMessage', 'Ошибка сети: ' + error.message);
    console.error('Ошибка сети:', error);
  } finally {
    commit('setLoading', false);
  }
},
  async fetchCategories({ commit }) {
    try {
      commit('setLoading', true);
      const response = await fetch(`${BASE_URL}/api/categories`);
      if (response.ok) {
        const data = await response.json();
        commit('setCategories', data);
      } else {
        commit('setErrorMessage', 'Ошибка при получении данных категорий');
        console.error('Ошибка при получении данных категорий');
      }
    } catch (error) {
      commit('setErrorMessage', 'Ошибка сети: ' + error.message);
      console.error('Ошибка сети:', error);
    } finally {
      commit('setLoading', false);
    }
  },

  async fetchProductsByCategory({ commit }, categoryId) {
    try {
      commit('setLoading', true);
      const response = await fetch(`${BASE_URL}/api/products?category_id=${categoryId}`);
      if (response.ok) {
        const data = await response.json();
        commit('setProducts', data);
      } else {
        commit('setErrorMessage', 'Ошибка при загрузке продуктов для категории');
        console.error('Ошибка при загрузке продуктов для категории');
      }
    } catch (error) {
      commit('setErrorMessage', 'Ошибка сети: ' + error.message);
      console.error('Ошибка сети:', error);
    } finally {
      commit('setLoading', false);
    }
  },

  async fetchProductById({ commit }, productId) {
    try {
      commit('setLoading', true);
      const response = await fetch(`${BASE_URL}/api/products?product_id=${productId}`);
      if (response.ok) {
        const data = await response.json();
        commit('setSelectedProduct', data); // Сохраняем данные одного продукта
      } else {
        commit('setErrorMessage', 'Ошибка при загрузке данных продукта');
        console.error('Ошибка при загрузке данных продукта');
      }
    } catch (error) {
      commit('setErrorMessage', 'Ошибка сети: ' + error.message);
      console.error('Ошибка сети:', error);
    } finally {
      commit('setLoading', false);
    }
  },

  async searchProducts({ commit }, query) {
    try {
      commit('setLoading', true);
      const response = await fetch(`${BASE_URL}/api/products?search=${query}`);
      if (response.ok) {
        const data = await response.json();
        commit('setSearchResults', data); // Сохраняем результаты поиска
      } else {
        commit('setErrorMessage', 'Ошибка при выполнении поиска');
        console.error('Ошибка при выполнении поиска');
      }
    } catch (error) {
      commit('setErrorMessage', 'Ошибка сети: ' + error.message);
      console.error('Ошибка сети:', error);
    } finally {
      commit('setLoading', false);
    }
  },
// Действие для загрузки файла
async uploadFile({ commit }, formData) {
  try {
    const response = await fetch(`${BASE_URL}/api/files/uploadFile`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return data; // Возвращаем данные о файле, включая путь
    } else {
      commit('setErrorMessage', 'Ошибка при загрузке файла');
      console.error('Ошибка при загрузке файла');
    }
  } catch (error) {
    commit('setErrorMessage', 'Ошибка сети: ' + error.message);
    console.error('Ошибка сети:', error);
    throw error;
  }
},

// Действие для создания категории
async createCategory({ commit }, categoryData) {
  try {
    const response = await fetch(`${BASE_URL}/api/categories/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });

    if (response.ok) {
      const data = await response.json();
      return data; // Возвращаем данные о категории
    } else {
      commit('setErrorMessage', 'Ошибка при создании категории');
      console.error('Ошибка при создании категории');
    }
  } catch (error) {
    commit('setErrorMessage', 'Ошибка сети: ' + error.message);
    console.error('Ошибка сети:', error);
    throw error;
  }
},

  
  // Удаление файла
  async deleteImage({ commit }, { filePath, categoryId }) {
    // console.log("Запрос на удаление файла и ID категории");
    
    try {
      // console.log("Удаление изображения с пути:", filePath);
      // console.log("ID категории:", categoryId);
  
      const response = await fetch(`${BASE_URL}/api/files/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath, categoryId }),  // Передаем как путь к изображению, так и ID категории
      });
  
      if (!response.ok) {
        commit('setErrorMessage', 'Ошибка при удалении изображения');
        console.error('Ошибка при удалении изображения');
      } else {
        console.log('Изображение успешно удалено');
      }
    } catch (error) {
      commit('setErrorMessage', 'Ошибка сети: ' + error.message);
      console.error('Ошибка сети:', error);
      throw error;
    }
  },
  
  // Переименование файла

  
  // Action для переименования файла
  async renameFile({ commit }, { oldPath, newPath }) {
    try {
      const response = await fetch(`${BASE_URL}/api/files/rename`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPath, newPath }),
      });
  
      if (response.ok) {
        return (await response.json()).path; // Возвращаем обновленный путь
      } else {
        throw new Error("Ошибка при переименовании файла");
      }
    } catch (error) {
      commit("setErrorMessage", error.message);
      throw error;
    }
  },
  async renameImage(newPath) {
    try {
      const updatedPath = await this.$store.dispatch("renameFile", {
        oldPath: this.newCategory.image_url,
        newPath,
      });
      this.newCategory.image_url = updatedPath;
    } catch (error) {
      console.error("Ошибка переименования файла:", error);
    }
  },
  // Авторизация
  async login({ commit }, { username, password }) {
    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // Включаем cookies
      });

      if (response.ok) {
        const user = await response.json();
        commit('setUser', user);
      } else {
        commit('setErrorMessage', 'Ошибка при входе');
        console.error('Ошибка при входе');
      }
    } catch (error) {
      commit('setErrorMessage', 'Ошибка сети: ' + error.message);
      console.error('Ошибка сети:', error);
    }
  },

  async logout({ commit }) {
    try {
      const response = await fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include', // Включаем cookies
      });

      if (response.ok) {
        commit('logout');
      } else {
        commit('setErrorMessage', 'Ошибка при выходе');
        console.error('Ошибка при выходе');
      }
    } catch (error) {
      commit('setErrorMessage', 'Ошибка сети: ' + error.message);
      console.error('Ошибка сети:', error);
    }
  },
};

export const getters = {
  // Продукты
  getProducts(state) {
    return state.products;
  },
  getCategories(state) {
    return state.categories;
  },
  getSelectedProduct(state) {
    return state.selectedProduct;
  },
  getErrorMessage(state) {
    return state.errorMessage;
  },
  isLoading(state) {
    return state.loading;
  },
  getSearchResults(state) {
    return state.searchResults;
  },
  getProductsByCategory: (state) => (categoryId) => {
    return state.products.filter(product => product.category_id === parseInt(categoryId));
  },

  // Авторизация
  isLoggedIn(state) {
    return state.auth.loggedIn;
  },
  getUser(state) {
    return state.auth.user;
  },
};

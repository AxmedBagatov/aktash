// const BASE_URL = 'http://192.168.62.129:4000';
//const BASE_URL = 'http://10.30.74.229:4000';
const BASE_URL = "http://10.30.74.112:4000";
export const state = () => ({
  products: [],
  create_products: [],
  galleryImages: [],
  categories: [],
  searchResults: [],
  selectedProduct: null,
  galleryImages: [],
  errorMessage: "",
  loading: false,
  images: [],
  auth: {
    loggedIn: false, // Флаг для проверки авторизован ли пользователь
    user: null, // Данные пользователя
  },
});
export const mutations = {
  setSelectedProduct(state, product) {
    state.selectedProduct = product;
  },
  updateProduct(state, updatedProduct) {
    const index = state.products.findIndex(product => product.id === updatedProduct.id);
    if (index !== -1) {
      state.products.splice(index, 1, updatedProduct);
    }
  },
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
  setGalleryImages(state, images) {
    state.galleryImages = images;
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
  SET_PRODUCTS(state, create_products) {
    state.create_products = create_products;
  },
  SET_IMAGES(state, images) {
    state.images = images;
  },
  REMOVE_PRODUCT(state, productId) {
    state.products = state.products.filter((product) => product.product_id !== productId);
  }
};

export const actions = {
  // Продукты
  async fetchProducts({ commit }) {
    try {
      commit("setLoading", true);
      const response = await fetch(`${BASE_URL}/api/products`);
      if (response.ok) {
        const data = await response.json();
        console.log("проверка даты", data);
        commit("setProducts", data);
      } else {
        commit("setErrorMessage", "Ошибка при получении данных продуктов");
        console.error("Ошибка при получении данных продуктов");
      }
    } catch (error) {
      commit("setErrorMessage", "Ошибка сети: " + error.message);
      console.error("Ошибка сети:", error);
    } finally {
      commit("setLoading", false);
    }
  },

  async updateCategory({ commit }, categoryData) {
    try {
      const response = await fetch(`${BASE_URL}/api/categories/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        const data = await response.json();
        return data; // Возвращаем данные об обновленной категории
      } else {
        commit("setErrorMessage", "Ошибка при обновлении категории");
        console.error("Ошибка при обновлении категории");
      }
    } catch (error) {
      commit("setErrorMessage", "Ошибка сети: " + error.message);
      console.error("Ошибка сети:", error);
      throw error;
    }
  },

  // Удаление категории
  async deleteCategory({ commit, state }, id) {
    try {
      commit("setLoading", true);
  
      // Запрос на удаление категории
      const response = await fetch(`${BASE_URL}/api/categories/${id}`, {
        method: "DELETE",
        credentials: "include", // Включаем cookies
      });
  
      if (response.ok) {
        // Если удаление прошло успешно, фильтруем удаленную категорию из списка
        const filteredCategories = state.categories.filter(
          (category) => category.category_id !== id
        );
        commit("setCategories", filteredCategories); // Обновляем список категорий
      } else if (response.status === 400) {
        // Если ошибка 400, передаем ошибку в состояние
        const errorMessage = await response.text();
        commit("setErrorMessage", errorMessage);
      } else {
        // В случае других ошибок
        commit("setErrorMessage", "Ошибка при удалении категории");
        console.error("Ошибка при удалении категории");
      }
    } catch (error) {
      // Если ошибка сети, отправляем соответствующее сообщение
      commit("setErrorMessage", "Ошибка сети: " + error.message);
      console.error("Ошибка сети:", error);
    } finally {
      commit("setLoading", false);
    }
  },  
  async fetchCategories({ commit }) {
    try {
      commit("setLoading", true);
      const response = await fetch(`${BASE_URL}/api/categories`);
      if (response.ok) {
        const data = await response.json();
        commit("setCategories", data);
      } else {
        commit("setErrorMessage", "Ошибка при получении данных категорий");
        console.error("Ошибка при получении данных категорий");
      }
    } catch (error) {
      commit("setErrorMessage", "Ошибка сети: " + error.message);
      console.error("Ошибка сети:", error);
    } finally {
      commit("setLoading", false);
    }
  },

  async fetchProductsByCategory({ commit }, categoryId) {
    try {
      commit("setLoading", true);
      const response = await fetch(
        `${BASE_URL}/api/products?category_id=${categoryId}`
      );
      if (response.ok) {
        const data = await response.json();
        commit("setProducts", data);
      } else {
        commit(
          "setErrorMessage",
          "Ошибка при загрузке продуктов для категории"
        );
        console.error("Ошибка при загрузке продуктов для категории");
      }
    } catch (error) {
      commit("setErrorMessage", "Ошибка сети: " + error.message);
      console.error("Ошибка сети:", error);
    } finally {
      commit("setLoading", false);
    }
  },

  async fetchProductById({ commit }, productId) {
    try {
      commit("setLoading", true);
      const response = await fetch(
        `${BASE_URL}/api/products?product_id=${productId}`
      );
      if (response.ok) {
        const data = await response.json();
        commit("setSelectedProduct", data); // Сохраняем данные одного продукта
      } else {
        commit("setErrorMessage", "Ошибка при загрузке данных продукта");
        console.error("Ошибка при загрузке данных продукта");
      }
    } catch (error) {
      commit("setErrorMessage", "Ошибка сети: " + error.message);
      console.error("Ошибка сети:", error);
    } finally {
      commit("setLoading", false);
    }
  },

  async searchProducts({ commit }, query) {
    try {
      commit("setLoading", true);
      const response = await fetch(`${BASE_URL}/api/products?search=${query}`);
      if (response.ok) {
        const data = await response.json();
        commit("setSearchResults", data); // Сохраняем результаты поиска
      } else {
        commit("setErrorMessage", "Ошибка при выполнении поиска");
        console.error("Ошибка при выполнении поиска");
      }
    } catch (error) {
      commit("setErrorMessage", "Ошибка сети: " + error.message);
      console.error("Ошибка сети:", error);
    } finally {
      commit("setLoading", false);
    }
  },
  // Действие для загрузки файла
  async uploadFile({ commit }, formData) {
    try {
      const response = await fetch(`${BASE_URL}/api/files/uploadFile`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data; // Возвращаем данные о файле, включая путь
      } else {
        commit("setErrorMessage", "Ошибка при загрузке файла");
        console.error("Ошибка при загрузке файла");
      }
    } catch (error) {
      commit("setErrorMessage", "Ошибка сети: " + error.message);
      console.error("Ошибка сети:", error);
      throw error;
    }
  },

  // Действие для создания категории
  async createCategory({ commit }, categoryData) {
    try {
      const response = await fetch(`${BASE_URL}/api/categories/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        const data = await response.json();
        return data; // Возвращаем данные о категории
      } else {
        commit("setErrorMessage", "Ошибка при создании категории");
        console.error("Ошибка при создании категории");
      }
    } catch (error) {
      commit("setErrorMessage", "Ошибка сети: " + error.message);
      console.error("Ошибка сети:", error);
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
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath, categoryId }), // Передаем как путь к изображению, так и ID категории
      });

      if (!response.ok) {
        commit("setErrorMessage", "Ошибка при удалении изображения");
        console.error("Ошибка при удалении изображения");
      } else {
        console.log("Изображение успешно удалено");
      }
    } catch (error) {
      commit("setErrorMessage", "Ошибка сети: " + error.message);
      console.error("Ошибка сети:", error);
      throw error;
    }
  },

  // Переименование файла
  async updateProduct({ commit }, productData) {
    try {
      const formData = new FormData();
      formData.append("productId", productData.productId);
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("stock", productData.stock);
      formData.append("attributes", productData.attributes);
      formData.append("categoryId", productData.catalogId);
  
      // Добавляем новые изображения в formData
      productData.images.forEach((image) => {
        if (image.isNew && !image.isDelete) {
          formData.append('newImages', image.file);
          formData.append('newImagesIndexes', image.index);
        }
        if (!image.isNew && image.isDelete) {
          formData.append('deletedImages', image.id); 
          formData.append('deletedcurrentImagesUrls', image.url);
        }
        if (!image.isNew && !image.isDelete){
          formData.append('currentImagesIds', image.id);
          formData.append('currentImagesIndexes', image.index);
          formData.append('currentImagesUrls', image.url);
        };
      });
  
      // Отправляем запрос с использованием axios
      const response = await this.$axios.$patch(`/products/${productData.productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
  
      // Теперь сразу работаем с response, это уже разобранный объект
      if (response.message) {
        commit("setSelectedProduct", response);
        console.log("Продукт успешно обновлен");
        return response; // Возвращаем обновленные данные продукта
      } else {
        const errorMessage = response.message || "Ошибка при обновлении продукта";
        commit("setErrorMessage", errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Ошибка при обновлении продукта:", error);
      commit("setErrorMessage", "Ошибка при обновлении продукта: " + error.message);
      throw error;
    }
  },
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include", // Включаем cookies
      });

      if (response.ok) {
        const user = await response.json();
        commit("setUser", user);
      } else {
        commit("setErrorMessage", "Ошибка при входе");
        console.error("Ошибка при входе");
      }
    } catch (error) {
      commit("setErrorMessage", "Ошибка сети: " + error.message);
      console.error("Ошибка сети:", error);
    }
  },

  async logout({ commit }) {
    try {
      const response = await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        credentials: "include", // Включаем cookies
      });

      if (response.ok) {
        commit("logout");
      } else {
        commit("setErrorMessage", "Ошибка при выходе");
        console.error("Ошибка при выходе");
      }
    } catch (error) {
      commit("setErrorMessage", "Ошибка сети: " + error.message);
      console.error("Ошибка сети:", error);
    }
  },
  async fetchGalleryImages({ commit }, { galleryId, search } = {}) {
    commit("setLoading", true);
    try {
      const params = new URLSearchParams();
      if (galleryId) params.append("gallery_id", galleryId);
      if (search) params.append("search", search);

      const response = await fetch(
        `${process.env.BASE_URL}/api/gallery-images?${params.toString()}`
      );
      if (response.ok) {
        const data = await response.json();
        commit("setGalleryImages", data);
      } else {
        const error = await response.json();
        commit("setErrorMessage", error.error || "Ошибка загрузки изображений");
      }
    } catch (error) {
      commit("setErrorMessage", `Ошибка сети: ${error.message}`);
    } finally {
      commit("setLoading", false);
    }
  },
  async createProduct({ commit, state }, productData) {
    try {
      // Запрос на сервер для создания нового продукта
      const response = await this.$axios.post("/create-products", productData);
      console.log("проверка данных перед итерацией", response.data);
  
      // Используем push для добавления нового продукта в массив
      const updatedProducts = [...state.create_products];
      updatedProducts.push(response.data);
  
      commit("SET_PRODUCTS", updatedProducts);
  
      return response.data; // Возвращаем созданный продукт
    } catch (error) {
      console.error("Ошибка при создании товара:", error);
      throw error;
    }
  },
  async setImages({ commit }, formData) {
  
    try {
      const response = await this.$axios.post("/upload-images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      // Логируем полный ответ от сервера для проверки структуры
      console.log("Ответ от сервера в Vuex:", response);
  
      // Проверяем структуру данных перед коммитом
      if (response && response.data && Array.isArray(response.data.images)) {
        console.log("Изображения:", response.data.images);
        commit("SET_IMAGES", response.data.images);
        return { data: { images: response.data.images } };
      } else {
        console.error("Ошибка: Некорректная структура данных в ответе:", response);
        return { data: { images: [] } };  // Возвращаем пустой массив в случае ошибки
      }
    } catch (error) {
      console.error("Ошибка при загрузке изображений:", error);
      throw error;
    }
  },
  
  async deleteProduct({ commit }, { productId, imagesToDelete }) {
    try {
      const response = await this.$axios.post("/products/delete", {
        productId: productId,
        images: imagesToDelete, // Массив объектов { url, product_id }
      });
  
      if (response.status === 200) {
        console.log("Продукт и его изображения успешно удалены");
        
        // Обновляем состояние Vuex, удалив продукт из store
        commit("REMOVE_PRODUCT", productId); // Мутация для удаления продукта из состояния
      } else {
        console.error("Ошибка при удалении товара и изображений:", response);
        throw new Error("Не удалось удалить товар и изображения");
      }
    } catch (error) {
      console.error("Ошибка при удалении товара и изображений:", error);
      throw error;
    }
  },
};

export const getters = {
  // Продукты
  getProducts: (state) => state.products,
  getCreateProducts: (state) => state.create_products,
  getImages: (state) => state.images,
  // getProducts(state) {
  //   return state.products;
  // },
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
    return state.products.filter(
      (product) => product.category_id === parseInt(categoryId)
    );
  },
  getGalleryImages(state) {
    return state.galleryImages;
  },
  // Авторизация
  isLoggedIn(state) {
    return state.auth.loggedIn;
  },
  getUser(state) {
    return state.auth.user;
  },
};

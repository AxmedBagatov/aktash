export const state = () => ({
  products: [],
  categories: [],
  errorMessage: '',
  loading: false,
});

export const mutations = {
  setProducts(state, products) {
    state.products = products;
  },
  setCategories(state, categories) {
    state.categories = categories;
  },
  setErrorMessage(state, message) {
    state.errorMessage = message;
  },
  setLoading(state, loading) {
    state.loading = loading;
  }
};

  export const actions = {
    async fetchProducts({ commit }) {
      try {
        commit('setLoading', true);
        const response = await fetch('http://192.168.62.129:4000/api/products');
        if (response.ok) {
          const data = await response.json();
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

    async fetchCategories({ commit }) {
      try {
        commit('setLoading', true);
        const response = await fetch('http://192.168.62.129:4000/api/categories');
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
        const response = await fetch(`http://192.168.62.129:4000/api/products?category_id=${categoryId}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(data);  // Проверка данных
          commit('setProducts', data);  // Сохраняем данные в хранилище
        } else {
          commit('setErrorMessage', 'Ошибка при загрузке продуктов для категории');
          console.error('Ошибка при загрузке продуктов для категории');
        }
      } catch (error) {
        commit('setErrorMessage', 'Ошибка сети: ' + error.message);
        console.error('Ошибка сети:', error);
      } finally {
        commit('setLoading', false);  // Останавливаем загрузку
      }
    }
  };

export const getters = {
  getProducts(state) {
    return state.products;
  },
  getCategories(state) {
    return state.categories;
  },
  getErrorMessage(state) {
    return state.errorMessage;
  },
  isLoading(state) {
    return state.loading;
  },
  getProductsByCategory: (state) => (categoryId) => {
    return state.products.filter(product => product.category_id === parseInt(categoryId));
  }
};

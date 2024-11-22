// store/index.js
export const state = () => ({
    products: [],  // Хранение данных о продуктах
    errorMessage: '',  // Сообщения об ошибке
    loading: false,  // Флаг загрузки
  });
  
  export const mutations = {
    setProducts(state, products) {
      state.products = products;  
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
        commit('setLoading', true);  // Устанавливаем флаг загрузки
        const response = await fetch('http://10.30.74.198:4000/api/products');
        if (response.ok) {
          const data = await response.json();
          commit('setProducts', data);
        } else {
          commit('setErrorMessage', 'Ошибка при получении данных');
          console.error('Ошибка при получении данных');
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
    getErrorMessage(state) {
      return state.errorMessage;
    },
    isLoading(state) {
      return state.loading;
    }
  };
  
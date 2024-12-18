<template>
  <div class="login-container">
    <h1 class="login-title">Авторизация</h1>
    <form @submit.prevent="login" class="login-form">
      <input v-model="username" type="text" placeholder="Логин" class="input-field" />
      <input v-model="password" type="password" placeholder="Пароль" class="input-field" />
      <button type="submit" class="submit-button">Авторизоваться</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        await this.$auth.loginWith('local', {
          data: {
            username: this.username,
            password: this.password,
          },
        });
        this.$router.push('/shop');
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
  background-color: #f8f8f8;
  padding: 20px;
}

.login-title {
  font-size: 2rem;
  color: #c32222;
  margin-bottom: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.input-field {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #c32222;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
}

.input-field:focus {
  border-color: #c32222;
  box-shadow: 0 0 5px rgba(195, 34, 34, 0.5);
}

.submit-button {
  padding: 10px;
  font-size: 1rem;
  color: white;
  background-color: #c32222;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #a61e1e;
}

.submit-button:active {
  background-color: #9a1818;
}
</style>

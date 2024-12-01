<template>
  <div>
    <h1>Protected Page</h1>
    <p>Welcome, {{ user.username }}</p>
  </div>
</template>

<script>
export default {
  middleware: 'auth', // Используем middleware для защиты этой страницы
  computed: {
    user() {
      return this.$auth.user; // Предполагается, что у вас есть авторизация через $auth
    }
  }
};
</script>

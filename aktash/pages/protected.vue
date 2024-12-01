<template>
  <div>
    <h1>Protected Page</h1>
    <p v-if="user">Welcome, {{ user.username }}</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$auth.user;
    },
  },
  methods: {
    async logout() {
      await this.$auth.logout();
      this.$router.push('/login');
    },
  },
};
</script>

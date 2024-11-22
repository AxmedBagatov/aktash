<template>
    <div>
      <Header />
      <main>
        <Nuxt />
      </main>
    </div>
  </template>
  
  <script>
  import Header from '~/components/Header.vue';
  
  export default {
    components: {
      Header,
    },
  };
  </script>
  
  <style>
  /* Глобальные стили */
  body {
    margin: 0;
    font-family: Arial, sans-serif;
  }
  
  main {
    padding: 0px;
  }
  </style>
  
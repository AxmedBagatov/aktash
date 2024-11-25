<template>
    <div>
      <Header />
      <main>
        <Nuxt />
      </main>
      <Footer />
    </div>
  </template>
  
  <script>
  import Header from '~/components/Header.vue';
  import Footer from '~/components/Footer.vue';
  export default {
    components: {
      Header,
      Footer,
    },
  };
  </script>
  
  <style>
  /* Глобальные стили */
  body html{
    margin: 0;
    font-family: Arial, sans-serif;
  }
  
  main {
    padding: 0px;
  }
  </style>
  
<template>
  <div class="page-container">
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

:root {
  --header-height: 60px;
  --header-padding: 10px;
  --footer-padding: 20px;
}

body html {
  margin: 0;
  /* font-family: Arial, sans-serif; */
  /* font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; */
  font-family: 'Courier New', Courier, monospace;
}

main {
  padding: 0px;
  flex: 1 0 auto;
  min-height: auto;
}

body {
  min-height: 100vh;
}

div#__nuxt,
div#__layout {
  min-height: 100vh;
}


.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

</style>
<template>
    <div id="app">
      <search />
      <Galery />
    </div>
  </template>
  
  <script>
  import search from "../components/search.vue";
  import Galery from "../components/Galery.vue";
  
  export default {
    name: "App",
    components: {
      Galery,
      search
    },
  };
  </script>
  
  <style>
  </style>
  
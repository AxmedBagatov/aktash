<template>
  <div id="app">
    <div class="first_card">
      <!-- <v-carousel
        height="400"
        show-arrows="hover"
        cycle
        hide-delimiter-background
      >
        <v-carousel-item v-for="(slide, i) in slides" :key="i">
          <v-sheet :color="colors[i]" height="100%">
            <div class="d-flex fill-height justify-center align-center">
              <div class="text-h2">{{ slide }} Slide</div>
            </div>
          </v-sheet>
        </v-carousel-item>
      </v-carousel> -->
    </div>
    <div class="second_card"></div>
    <div class="third_card"></div>
  </div>
</template>

<script>
  
</script>

<style>
.first_card {
  height: 60vh;
  width: 100%;
}

.second_card {
  height: 50vh;
  background-color: #7e0000;
}

.third_card {
  height: 60vh;
  background-color: #000000;
}
</style>

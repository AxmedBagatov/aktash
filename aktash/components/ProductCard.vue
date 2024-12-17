<template>
  <div class="card">
    <h2 class="card-title">Название карточки</h2>
    
    <!-- Карусель -->
    <MyPrefixCarousel :perPage="1" loop>
      <MyPrefixSlide>
        <img src="https://via.placeholder.com/300x200?text=Image+1" alt="Image 1" />
      </MyPrefixSlide>
      <MyPrefixSlide>
        <img src="https://via.placeholder.com/300x200?text=Image+2" alt="Image 2" />
      </MyPrefixSlide>
      <MyPrefixSlide>
        <img src="https://via.placeholder.com/300x200?text=Image+3" alt="Image 3" />
      </MyPrefixSlide>
    </MyPrefixCarousel>

    <p class="card-description">
      Описание карточки с текстом. Здесь можно описать продукт, услугу или что-то другое.
    </p>
  </div>
</template>

<script setup>
// Здесь можно добавить дополнительную логику для карточки, если нужно
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  max-width: 320px;
  margin: 20px auto;
  text-align: center;
}
.card-title {
  font-size: 1.5em;
  margin-bottom: 10px;
}
.card-description {
  font-size: 1em;
  color: #555;
}
.carousel__slide img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}



</style>
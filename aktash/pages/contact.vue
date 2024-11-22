<template>
  <div id="contact">
    <div class="about_flex">
      <div class="about_text">
        <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum non quos fugiat natus quas. Dolores voluptates excepturi ullam quia voluptate optio numquam sint, modi perferendis exercitationem in illo facere iure.</h1>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reiciendis laudantium et enim totam eveniet placeat accusamus inventore aut, accusantium nesciunt aliquid asperiores libero aliquam facilis minima corporis officia voluptatum sint.</p>
        <div>
          <ul class="social_media">
            <li class="social_media_elements">instagramm</li>
            <li class="social_media_elements">wathsapp</li>
            <li class="social_media_elements">telegramm</li>
            <li class="social_media_elements">youtube</li>
          </ul>
        </div>
      </div>
      <div class="about_map">
        <!-- <script
          type="text/javascript"
          charset="utf-8"
          async
          src="https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A71fc67dbea922f269a5ba099510d07cde50799516e65c4c677d386413063de78&amp;width=100%25&amp;height=600&amp;lang=ru_RU&amp;scroll=true"
        ></script> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>
<style>
.about_flex {
  display: flex;
}

.about_text {
  width: 40%;
}
.social_media{
  display: flex;
  list-style: none;
  gap: 15px;
}
.about_map {
  width: 60%;
  margin-left: 50px;
}

.social_media_elements{
  padding-inline-start: 10px;
}

/* Адаптивные стили для мобильных устройств */
@media (max-width: 768px) { /* Ширина экрана 768px или меньше */
  .about_flex {
    display: inline-block;
    text-align: center; /* Центровка содержимого для inline-block */
  }

  .about_text, .about_map {
    width: 100%; /* Элементы занимают всю ширину экрана */
    margin-left: 0; /* Убираем отступы для мобильных */
  }

  .about_map {
    margin-top: 20px; /* Добавляем отступ сверху для разделения блоков */
  }
}
</style>

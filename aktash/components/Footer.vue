<template>
    <footer class="main-footer">
      <div class="footer-underline"></div>
      <div class="footer-container">
        <div class="footer-section">
          <h4>О нас</h4>
          <p>Краткая информация о компании.</p>
        </div>
        <div class="footer-section">
          <h4>Контакты</h4>
          <ul>
            <li>Email: example@example.com</li>
            <li>Телефон: +1234567890</li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Социальные сети</h4>
          <ul>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Instagram</a></li>
          </ul>
        </div>
      </div>
    </footer>
  </template>
  

<style>


/* Контейнер для всего контента */



.main-content {
  flex-grow: 1;                 /* Этот элемент растягивается, заполняя оставшееся пространство */
  padding: 20px;                /* Внутренние отступы для контента */
}

.footer-underline {
  background-color: lightgray;
  height: 1px;
}

/* Футер */
footer.main-footer {
  color: black;                /* Цвет текста */
  padding-top: var(--footer-padding);              /* Внутренние отступы сверху и снизу */
  padding-bottom: var(--footer-padding);              /* Внутренние отступы сверху и снизу */
  width: 100%;                  /* Полная ширина */
  text-align: center;           /* Центрируем текст */
}

.footer-container {
  max-width: 1200px;            /* Ограничиваем ширину для центрирования */
  margin: 0 auto;               /* Центрируем блок */
  display: flex;                /* Флекс-контейнер */
  justify-content: space-between; /* Равномерное распределение секций */
  flex-wrap: wrap;              /* Адаптация на маленьких экранах */
  gap: 20px;                    /* Расстояние между секциями */
}

.footer-section {
  flex: 1 1 300px;              /* Адаптивная ширина секций */
  margin: 10px;                 /* Внешние отступы */
}

.footer-section h4 {
  font-size: 1.2rem;            /* Размер заголовков секций */
  margin-bottom: 10px;          /* Отступ после заголовка */
}

.footer-section ul {
  list-style: none;             /* Убираем маркеры списка */
  padding: 0;                   /* Убираем отступы */
  margin: 0;                    /* Убираем внешние отступы */
}

.footer-section ul li {
  margin: 5px 0;                /* Отступы между пунктами списка */
}

.footer-section ul li a {
  color: black;
  text-decoration: none;        /* Убираем подчеркивание */
  transition: 0.1s;  /* Анимация наводки */
}

.footer-section ul li a:hover {
  color: #c32222;             /* Изменение цвета при наведении */
}

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;  /* Расположение секций в колонку */
    text-align: center;      /* Центрируем текст */
  }
}


</style>
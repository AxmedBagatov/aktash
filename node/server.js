const express = require('express');       // Импортируем Express для создания сервера
const { connectDB, queryDB } = require('./db');  // Импортируем функции из db.js
const app = express();
const port = 4000;
const cors = require('cors');
app.use(cors());
// Подключаемся к базе данных
connectDB();

// Обработка GET-запроса для получения всех товаров
app.get('/api/products', async (req, res) => {
  try {
    const categoryId = req.query.category_id; // Получаем параметр category_id из query-параметров

    // SQL-запрос для объединения товаров и их изображений с фильтрацией по category_id
    let query = `
      SELECT 
        p.product_id,
        p.name,
        p.description,
        p.price,
        i.image_url
      FROM 
        products p
      LEFT JOIN 
        images i ON p.product_id = i.entity_id AND i.entity_type = 'product'
    `;

    // Если передан category_id, добавляем фильтрацию по категории
    if (categoryId) {
      query += ` WHERE p.category_id = ${categoryId}`;
    }

    // Выполняем запрос к базе данных
    const productsWithImages = await queryDB(query);

    // Отправляем результат в формате JSON
    res.json(productsWithImages);
  } catch (err) {
    console.error('Error fetching products with images:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/categories', async (req, res) => {
  try {
    // SQL-запрос для объединения категорий и их изображений
    const query = `
      SELECT 
          c.category_id,
          c.name,
          c.description,
          i.image_url,
          i.image_order
      FROM 
          categories c
      LEFT JOIN 
          images i 
      ON 
          c.category_id = i.entity_id AND i.entity_type = 'category'
      ORDER BY 
          c.category_id, i.image_order;
    `;
    
    // Выполняем запрос к базе данных
    const categoriesWithImages = await queryDB(query);

    // Отправляем результат в формате JSON
    res.json(categoriesWithImages);
  } catch (err) {
    console.error('Error fetching categories with images:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

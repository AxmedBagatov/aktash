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
    // SQL-запрос для объединения товаров и их изображений
    const query = `
      SELECT 
        p.product_id,
        p.name,
        p.description,
        p.price,
        i.image_url
      FROM 
        products p
      LEFT JOIN 
        images i 
      ON 
        p.product_id = i.product_id;
    `;
    
    // Выполняем запрос к базе данных
    const productsWithImages = await queryDB(query);

    // Отправляем результат в формате JSON
    res.json(productsWithImages);
  } catch (err) {
    console.error('Error fetching products with images:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Запуск сервера
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

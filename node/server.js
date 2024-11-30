const express = require('express');       // Импортируем Express для создания сервера
const { connectDB, queryDB } = require('./db');  // Импортируем функции из db.js
const app = express();
const port = 4000;
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const JWT_SECRET = 'cristianomessi';  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const bcrypt = require('bcrypt');

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ['http://192.168.62.129', 'http://localhost:80'];
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Этот параметр важен для работы с cookies
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Подключаемся к базе данных
connectDB();
app.use(cookieParser());


// login start

// login end



// Обработка GET-запроса для получения всех товаров
app.get('/api/products', async (req, res) => {
  try {
    const { category_id: categoryId, product_id: productId, search } = req.query;

    // Базовый SQL-запрос
    let query = `
      SELECT 
        p.product_id,
        p.category_id,
        p.name,
        p.description,
        p.price,
        i.image_url
      FROM 
        products p
      LEFT JOIN 
        images i ON p.product_id = i.entity_id AND i.entity_type = 'product'
    `;

    const conditions = [];
    // Если передан product_id, фильтруем по конкретному товару
    if (productId) {
      conditions.push(`p.product_id = ${productId}`);
    }

    // Если передан category_id, фильтруем по категории
    if (categoryId) {
      conditions.push(`p.category_id = ${categoryId}`);
    }

    // Если передан search, добавляем фильтрацию по имени и описанию
    if (search) {
      conditions.push(`(p.name ILIKE '%${search}%' OR p.description ILIKE '%${search}%')`);
    }

    // Добавляем условия в запрос
    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }

    // Выполняем запрос к базе данных
    const productsWithImages = await queryDB(query);

    // Если запрошен конкретный продукт, возвращаем один объект
    if (productId && productsWithImages.length > 0) {
      res.json(productsWithImages[0]); // Возвращаем только первый найденный продукт
    } else if (productId && productsWithImages.length === 0) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      // Возвращаем массив продуктов
      res.json(productsWithImages);
    }
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

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
const generateToken = (user) => {
  const payload = {
    userId: user.id,
    username: user.username,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

// Авторизация пользователя (пример POST запроса)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Пример простого запроса для проверки пользователя
  try {
    const userQuery = await queryDB(
      'SELECT * FROM users WHERE username = $1 AND password_hash = $2',
      [username, password]
    );
      console.log(userQuery);
      
    if (userQuery.length === 0) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    const user = userQuery[0];
    const token = generateToken(user);

    // Сохраняем JWT в cookie
    res.cookie('authToken', token, {
      httpOnly: true,  // Токен доступен только серверу
      secure: false,
      //secure: process.env.NODE_ENV === 'production',  // Только для HTTPS в продакшене
      sameSite: 'Strict',  // Защищает от CSRF атак
      maxAge: 3600000,  // Время жизни токена (1 час)
    });

    res.json({ message: 'Авторизация успешна' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Мидлвар для проверки токена
const authenticateToken = (req, res, next) => {
  const token = req.cookies.authToken;  // Читаем токен из cookies
  if (!token) return res.status(401).json({ error: 'Токен не предоставлен' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Неверный или истекший токен' });
    req.user = user;  // Добавляем данные пользователя в запрос
    next();
  });
};

// Пример защищенного маршрута
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Доступ разрешен', user: req.user });
});
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

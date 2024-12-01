const express = require('express');
const { connectDB, queryDB } = require('./db'); // Подключение к базе данных
const app = express();
const port = 4000;
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

const JWT_SECRET = 'cristianomessi'; // Лучше хранить это в .env файле

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
  credentials: true, // Включение работы с cookies
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

connectDB();
app.use(cookieParser());

// ======== Регистрация ========
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await queryDB('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
    res.status(201).send('User registered');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  try {
    // Проверяем, существует ли пользователь
    const result = await queryDB('SELECT * FROM users WHERE username = $1', [username]);

    if (result.length === 0) {
      console.error(`User not found: ${username}`);
      return res.status(404).send('User not found');
    }

    const user = result[0]; // Получаем пользователя
    console.log('User fetched from database:', user);

    // Сравниваем пароль
    const isMatch = await bcrypt.compare(password, user.password_hash); // Убедитесь, что используете правильное поле
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.error('Invalid credentials');
      return res.status(401).send('Invalid credentials');
    }

    // Генерируем токен
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: false }); // Для продакшена: secure: true
    res.send('Logged in');
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send('Server error');
  }
});


// ======== Проверка авторизации ========
app.get('/api/protected', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send('Unauthorized');

  try {
    const user = jwt.verify(token, JWT_SECRET);
    res.send(`Hello, ${user.username}`);
  } catch (err) {
    res.status(403).send('Invalid token');
  }
});

// ======== Выход ========
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.send('Logged out');
});
// login end



// Обработка GET-запроса для получения всех товаров
app.get('/api/products', async (req, res) => {
  try {
    const { category_id: categoryId, product_id: productId, search } = req.query;

    let query = `
      SELECT 
        p.product_id,
        p.category_id,
        p.name,
        p.description,
        p.price,
        JSON_AGG(JSON_BUILD_OBJECT('url', i.image_url, 'order', i.image_order) ORDER BY i.image_order) AS images
      FROM 
        products p
      LEFT JOIN 
        images i ON p.product_id = i.entity_id AND i.entity_type = 'product'
    `;

    const conditions = [];
    if (productId) conditions.push(`p.product_id = ${productId}`);
    if (categoryId) conditions.push(`p.category_id = ${categoryId}`);
    if (search) conditions.push(`(p.name ILIKE '%${search}%' OR p.description ILIKE '%${search}%')`);

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` GROUP BY p.product_id, p.category_id, p.name, p.description, p.price`;

    const productsWithImages = await queryDB(query);

    if (productId && productsWithImages.length > 0) {
      res.json(productsWithImages[0]);
    } else if (productId && productsWithImages.length === 0) {
      res.status(404).json({ error: 'Product not found' });
    } else {
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

const { Client } = require('pg');

// Настройка подключения к базе данных
const client = new Client({
  user: 'postgres',
  host: '10.30.74.112',
  database: 'db_vueshop',
  password: '', // Убедитесь, что пароль указан, если он установлен
  port: 5432,
});

// Функция для подключения к базе данных
const connectDB = async () => {
  try {
    await client.connect(); // Подключаемся к базе данных
    console.log('PostgreSQL connected successfully');
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err);
    process.exit(1); // Завершаем процесс в случае ошибки подключения
  }
};

// Функция для выполнения запросов
const queryDB = async (query, params) => {
  try {
    const res = await client.query(query, params); // Используем client вместо pool
    return res.rows; // Возвращаем строки результата
  } catch (error) {
    console.error('Error executing query:', error);
    throw error; // Пробрасываем ошибку
  }
};

module.exports = { connectDB, queryDB }; // Экспортируем функции для использования в других файлах

const { Client } = require('pg'); 

const client = new Client({
  user: 'postgres',
  host: '192.168.62.129',
  database: 'db_vueshop',
  password: '',
  port: 5432,
});

const connectDB = async () => {
  try {
    await client.connect();         // Подключаемся к базе данных
    console.log('PostgreSQL connected successfully');  // Выводим сообщение об успешном подключении
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err);
    process.exit(1);  // Завершаем процесс в случае ошибки подключения
  }
};

// Функция для выполнения запросов
const queryDB = async (query, params) => {
  try {
    const res = await pool.query(query, params); // Передача параметров здесь
    return res.rows; // Возвращает только строки результата
  } catch (error) {
    console.error('Error executing query:', error);
    throw error; // Проброс ошибки
  }
};

module.exports = { connectDB, queryDB };  // Экспортируем функции для использования в других файлах

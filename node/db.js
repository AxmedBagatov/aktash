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
const queryDB = async (query) => {
  try {
    const res = await client.query(query);  // Выполняем запрос
    return res.rows;  // Возвращаем строки данных
  } catch (err) {
    console.error('Error executing query:', err);
    throw err;  // Выбрасываем ошибку для обработки в другом месте
  }
};

module.exports = { connectDB, queryDB };  // Экспортируем функции для использования в других файлах

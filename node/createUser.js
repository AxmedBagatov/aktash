const bcrypt = require('bcrypt'); // Для хэширования паролей
const { connectDB, queryDB } = require('./db'); // Подключаем модуль базы данных

// Функция для создания пользователя
const createUser = async (username, password) => {
  try {
    // Хэшируем пароль
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // SQL-запрос для вставки нового пользователя
    const query = `
      INSERT INTO users (username, password_hash)
      VALUES ($1, $2)
      RETURNING id, username, created_at;
    `;
    const values = [username, passwordHash];

    // Выполняем запрос
    const result = await queryDB({
      text: query,
      values: values,
    });

    console.log('User created successfully:', result[0]);
  } catch (err) {
    console.error('Error creating user:', err.message);
  } finally {
    process.exit(); // Завершаем процесс после выполнения
  }
};

// Получаем логин и пароль из аргументов командной строки
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.error('Usage: node createUser.js <username> <password>');
  process.exit(1);
}

const [username, password] = args;

// Подключаемся к базе данных и создаем пользователя
(async () => {
  await connectDB();
  await createUser(username, password);
})();

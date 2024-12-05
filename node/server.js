const express = require("express");
const { connectDB, queryDB } = require("./db"); // Подключение к базе данных
const app = express();
const port = 4000;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const JWT_SECRET = "cristianomessi"; // Лучше хранить это в .env файле

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://192.168.62.129",
        "http://localhost:80",
        "http://10.30.74.229",
      ];
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Включение работы с cookies
    methods: ["GET, POST, PUT, DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ======== Регистрация ========
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await queryDB("INSERT INTO users (username, password) VALUES ($1, $2)", [
      username,
      hashedPassword,
    ]);
    res.status(201).send("User registered");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  try {
    // Проверяем, существует ли пользователь
    const result = await queryDB("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    console.log("Попытка входа с данными", result);

    if (result.length === 0) {
      console.error(`User not found: ${username}`);
      return res.status(404).send("User not found");
    }

    const user = result[0]; // Получаем пользователя
    console.log("User fetched from database:", user);

    // Сравниваем пароль
    const isMatch = await bcrypt.compare(password, user.password_hash); // Убедитесь, что используете правильное поле
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      console.error("Invalid credentials");
      return res.status(401).send("Invalid credentials");
    }

    // Генерируем токен
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.cookie("token", token, { httpOnly: true, secure: false }); // Для продакшена: secure: true
    res.send("Logged in");
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("Server error");
  }
});

function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Unauthorized");

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid token");
    req.user = user;
    next();
  });
}

// ======== Проверка авторизации ========
app.get("/api/protected", authenticateToken, (req, res) => {
  res.send(`Hello, ${req.user.username}`);
});
// ======== Выход ========
app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.send("Logged out");
});
// login end

// file start

const multer = require("multer");
const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Указываем базовую папку для хранения файлов
    cb(null, "images/"); // Все файлы будут сначала сохраняться в папку 'images'
  },
  filename: (req, file, cb) => {
    // Формируем уникальное имя для файла и добавляем оригинальное имя
    const uniqueName = Date.now() + path.extname(file.originalname); // уникальное имя
    const finalFileName =
      uniqueName.replace(path.extname(file.originalname), "") +
      "_" +
      file.originalname; // добавляем оригинальное имя
    cb(null, finalFileName); // сохраняем с новым именем
  },
});

// Инициализация multer с использованием настроенного хранилища
const upload = multer({ storage: storage });

// Настройка маршрута для загрузки файла
router.post("/api/files/uploadFile", upload.single("file"), (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Файл не был загружен" });
    }

    const uniqueName = Date.now() + path.extname(file.originalname); // Уникальное имя для файла
    const destinationDir = path.join("images", "uploads");
    const destinationFilePath = path.join(destinationDir, uniqueName); // Путь для окончательного сохранения файла

    // Создаем директорию, если её нет
    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true });
    }

    const tempFilePath = path.join("images", file.filename); // Временный путь файла

    // Перемещаем файл из временной директории в нужную папку
    fs.rename(tempFilePath, destinationFilePath, (err) => {
      if (err) {
        console.error("Ошибка при перемещении файла:", err);
        return res.status(500).json({ message: "Ошибка сервера при перемещении файла" });
      }

      res.json({
        message: "Файл успешно загружен",
        fileName: file.filename,
        filePath: destinationFilePath,
      });
    });
  } catch (error) {
    console.error("Ошибка при обработке запроса:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});
router.post("/api/categories/create", async (req, res) => {
  try {
    const { categoryName, description, filePath } = req.body;

    if (!categoryName || !filePath) {
      return res.status(400).json({ message: "Не указано имя категории или путь к файлу" });
    }

    // Создание записи в таблице категорий
    const insertCategoryQuery = `
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING category_id;
    `;
    let categoryResult;
    try {
      categoryResult = await queryDB(insertCategoryQuery, [categoryName, description]);
    } catch (error) {
      console.error("Ошибка при выполнении запроса insertCategoryQuery:", error);
      return res.status(500).json({ message: "Ошибка при создании категории" });
    }

    if (categoryResult.length === 0) {
      return res.status(500).json({ message: "Ошибка при создании категории. Нет результата." });
    }

    const categoryId = categoryResult[0].category_id;

    // Добавление изображения для категории в таблицу images
    const insertImageQuery = `
      INSERT INTO images (entity_id, entity_type, image_url, image_type, image_order)
      VALUES ($1, 'category', $2, 'image/jpeg', 1);
    `;
    await queryDB(insertImageQuery, [
      categoryId, // ID категории
      filePath.replace("images/", ""), // Путь к файлу без 'images/' в начале
    ]);

    res.json({
      message: "Категория и изображение успешно добавлены",
      categoryId: categoryId,
      categoryName: categoryName,
    });
  } catch (error) {
    console.error("Ошибка при добавлении категории:", error);
    res.status(500).json({ message: "Ошибка при добавлении категории" });
  }
});

// server.js
router.post("/api/categories/update", async (req, res) => {
  try {
    const { categoryId, categoryName, description, filePath } = req.body;

    if (!categoryId || !categoryName) {
      return res.status(400).json({ message: "Не указано имя категории или id" });
    }

    // Обновление категории в таблице categories
    const updateCategoryQuery = `
      UPDATE categories
      SET name = $1, description = $2
      WHERE category_id = $3
      RETURNING category_id;
    `;

    let categoryResult;
    try {
      categoryResult = await queryDB(updateCategoryQuery, [categoryName, description, categoryId]);
    } catch (error) {
      console.error("Ошибка при выполнении запроса updateCategoryQuery:", error);
      return res.status(500).json({ message: "Ошибка при обновлении категории" });
    }

    if (categoryResult.length === 0) {
      return res.status(500).json({ message: "Категория не найдена" });
    }

    // Если путь к новому изображению был передан, обновляем его
    if (filePath) {
      const updateImageQuery = `
        UPDATE images
        SET image_url = $1
        WHERE entity_id = $2 AND entity_type = 'category';
      `;
      await queryDB(updateImageQuery, [filePath.replace("images/", ""), categoryId]); // Обновляем путь изображения
    }

    res.json({
      message: "Категория успешно обновлена",
      categoryId: categoryId,
      categoryName: categoryName,
    });
  } catch (error) {
    console.error("Ошибка при обновлении категории:", error);
    res.status(500).json({ message: "Ошибка при обновлении категории" });
  }
});

// const imageData = await saveImageToCategory(file, categoryName);
app.delete("/api/files/delete", async (req, res) => {
  const { filePath, categoryId } = req.body; // Извлекаем путь к файлу и ID категории
  console.log("Запрос на удаление файла:", filePath);
  console.log("ID категории:", categoryId);
  // Преобразуем путь файла (удаляем "images/")
  const imageUrl = filePath.replace("images/", "");

  try {
    // Выполняем запрос на удаление из базы данных
    const query = `
      DELETE FROM images
      WHERE entity_type = 'category'
        AND entity_id = $1
        AND image_url = $2
      RETURNING *;
    `;
    const values = [categoryId, imageUrl]; // Подставляем параметры

    const result = await queryDB(query, values); // Выполняем запрос

    if (result.length === 0) {
      // Если не найдено соответствующих строк
      console.log("Запись не найдена в базе данных.");
      return res.status(404).json({ message: "Изображение не найдено в базе данных" });
    }

    // Логируем успешное удаление записи из базы данных
    console.log(`Запись с ID категории ${categoryId} и image_url ${imageUrl} успешно удалена из базы данных`);

    // Если запись была удалена из базы данных, пытаемся удалить файл с диска
    const fileToDelete = path.join(__dirname, filePath); // Полный путь к файлу на сервере

    // Проверяем, существует ли файл
    fs.unlink(fileToDelete, (err) => {
      if (err) {
        console.error("Ошибка при удалении файла:", err);
        return res.status(500).json({ message: "Ошибка при удалении файла с диска" });
      }

      console.log("Файл успешно удален с диска");
      res.status(200).json({ message: "Изображение и файл успешно удалены", path: filePath });
    });

  } catch (error) {
    // Обработка ошибок
    console.error("Ошибка при удалении изображения:", error);
    res.status(500).json({ message: "Ошибка сервера при удалении изображения" });
  }
});

router.put("/api/files/rename", (req, res) => {
  const { oldPath, newPath } = req.body;
  console.log("Запрос на переименование файла:");
  console.log("Старый путь:", oldPath);
  console.log("Новый путь:", newPath);

  // Только логируем, файл пока не переименовываем
  res
    .status(200)
    .json({ message: "Переименование файла получено", oldPath, newPath });
});

app.use("/", router);
// file end

// Обработка GET-запроса для получения всех товаров
app.get("/api/products", async (req, res) => {
  try {
    const {
      category_id: categoryId,
      product_id: productId,
      search,
    } = req.query;

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
    if (search)
      conditions.push(
        `(p.name ILIKE '%${search}%' OR p.description ILIKE '%${search}%')`
      );

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ");
    }

    query += ` GROUP BY p.product_id, p.category_id, p.name, p.description, p.price`;

    const productsWithImages = await queryDB(query);

    if (productId && productsWithImages.length > 0) {
      res.json(productsWithImages[0]);
    } else if (productId && productsWithImages.length === 0) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.json(productsWithImages);
    }
  } catch (err) {
    console.error("Error fetching products with images:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/categories", async (req, res) => {
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
    console.error("Error fetching categories with images:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/categories", authenticateToken, async (req, res) => {
  const { name, description, image_url } = req.body;

  if (!name || !description) {
    return res.status(400).send("Name and description are required");
  }

  try {
    const result = await queryDB(
      "INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING category_id",
      [name, description]
    );
    const categoryId = result[0].category_id;

    if (image_url) {
      // Если есть изображение, добавляем его
      await queryDB(
        "INSERT INTO images (entity_id, entity_type, image_url, image_order) VALUES ($1, $2, $3, 1)",
        [categoryId, "category", image_url]
      );
    }

    res
      .status(201)
      .json({ category_id: categoryId, name, description, image_url });
  } catch (err) {
    console.error("Error adding category:", err);
    res.status(500).send("Internal server error");
  }
});

// ======== Редактирование категории ========
app.put("/api/categories/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, description, image_url } = req.body;

  if (!name || !description) {
    return res.status(400).send("Name and description are required");
  }

  try {
    const result = await queryDB(
      "UPDATE categories SET name = $1, description = $2 WHERE category_id = $3 RETURNING category_id",
      [name, description, id]
    );

    if (result.length === 0) {
      return res.status(404).send("Category not found");
    }

    // Если есть изображение, обновляем его
    if (image_url) {
      await queryDB(
        "UPDATE images SET image_url = $1 WHERE entity_id = $2 AND entity_type = $3",
        [image_url, id, "category"]
      );
    }

    res.status(200).json({ category_id: id, name, description, image_url });
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).send("Internal server error");
  }
});

// ======== Удаление категории ========
app.delete("/api/categories/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await queryDB(
      "DELETE FROM categories WHERE category_id = $1 RETURNING category_id",
      [id]
    );

    if (result.length === 0) {
      return res.status(404).send("Category not found");
    }

    // Удаление изображений, связанных с категорией
    await queryDB(
      "DELETE FROM images WHERE entity_id = $1 AND entity_type = $2",
      [id, "category"]
    );

    res.status(200).send("Category deleted");
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).send("Internal server error");
  }
});

// Запуск сервера

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

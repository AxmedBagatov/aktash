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
const mkdirp = require("mkdirp");
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
        "http://10.30.74.112",
      ];
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Включение работы с cookies
    methods: ["GET, POST, PUT, DELETE, PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const router = express.Router();
const multer = require("multer");
const { log } = require("console");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const targetPath = req.body.path || "uploads/"; // Путь для сохранения файлов
    cb(null, targetPath); // Указываем директорию для сохранения
  },
  filename: (req, file, cb) => {
    // Используем оригинальное имя файла с расширением
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });



app.patch("/api/products/:id", upload.array("newImages"), async (req, res) => {
  try {
    const { name, description, price, stock, attributes } = req.body;
    const categoryId = req.body.categoryId;
    const productId = req.params.id;
    let images = req.files;
    const newImagesIndexes = req.body.newImagesIndexes;
    let deletedImages = req.body.deletedImages || [];
    let deletedcurrentImagesUrls = req.body.deletedcurrentImagesUrls;
    let currentImagesIds = req.body.currentImagesIds || [];
    const currentImagesIndexes = req.body.currentImagesIndexes || [];
    const currentImagesUrls = req.body.currentImagesUrls || [];
    const parsedAttributes = Array.isArray(attributes) ? attributes : JSON.parse(attributes || "[]");

    if (!Array.isArray(images)) {
      images = [images];
      console.log("Одиночное изображение преобразовано в массив:", images);
    }

    // Объединение файлов и их индексов в массив
    const parsedNewImages = images.map((file, index) => ({
      file: file,
      filename: file.originalname, // Имя файла
      index: newImagesIndexes[index] || index, // Используем индекс из newImagesIndexes или позицию по умолчанию
    }));
    console.log(newImagesIndexes);

    console.log("Новые изображения с индексами:", parsedNewImages);

    console.log("Текущие ID изображений:", currentImagesIds);

    if (!Array.isArray(currentImagesIds)) {
      try {
        // Если это строка, попробуем распарсить как JSON
        currentImagesIds = JSON.parse(currentImagesIds);
        console.log("Текущие ID изображений после парсинга:", currentImagesIds);

        // Если после парсинга это не массив, оборачиваем в массив
        if (!Array.isArray(currentImagesIds)) {
          currentImagesIds = [currentImagesIds];
          console.log(
            "Текущие ID изображений преобразованы в массив:",
            currentImagesIds
          );
        }
      } catch (error) {
        console.error("Ошибка при парсинге currentImagesIds:", error);

        // Если значение одиночное и не поддаётся парсингу, оборачиваем его в массив
        currentImagesIds = [currentImagesIds];
        console.log(
          "Текущие ID изображений преобразованы в массив без парсинга:",
          currentImagesIds
        );
      }
    }

    // Теперь безопасно используем map
    const parsedImages = currentImagesIds.map((id, index) => ({
      id,
      index: currentImagesIndexes[index],
      url: currentImagesUrls[index],
    }));

    if (!Array.isArray(deletedImages)) {
      deletedImages = [deletedImages];
      console.log(
        "Удаляемое изображение преобразовано в массив:",
        deletedImages
      );
    }

    // Преобразуем deletedcurrentImagesUrls в массив, если это не массив
    if (!Array.isArray(deletedcurrentImagesUrls)) {
      deletedcurrentImagesUrls = [deletedcurrentImagesUrls];
      console.log(
        "Удаляемые текущие URL изображений преобразованы в массив:",
        deletedcurrentImagesUrls
      );
    }

    // Создание нового массива для удаляемых изображений с ID и URL
    const parsedDeletedImages = deletedImages.map((image, index) => {
      const imageId = image;
      const url = deletedcurrentImagesUrls[index] || "";
      return {
        product_id: productId, // Присваиваем правильный ID продукта
        image_id: imageId, // ID изображения
        url: url, // URL изображения
      };
    });

    console.log(
      "Массив удаляемых изображений с ID и URL:",
      parsedDeletedImages
    );

    console.log("ID продукта:", productId);
    console.log("Название:", name);
    console.log("Описание:", description);
    console.log("Цена:", price);
    console.log("ID категории:", categoryId);
    console.log("Текущие изображения", parsedImages);

    console.log("Полученные изображения:", images);
    console.log("Изображения для удаления:", deletedImages);

    const targetPath = "static/shop/Article";
    await mkdirp(targetPath);
    const imageUrls = [];

    // 1. Перемещение новых изображений в целевую папку и добавление в БД
    if (images.length > 0) {
      try {
        for (const [i, file] of images.entries()) {
          // Получение расширения файла
          const fileExtension = path.extname(file.originalname);
    
          // Генерация уникального имени файла на основе текущего времени и индекса
          const uniqueFilename = `${Date.now()}_${i}${fileExtension}`;
          const productFolder = path.join(targetPath, productId); // Папка продукта
    
          console.log(`Попытка создать директорию для продукта: ${productFolder}`);
    
          // Убедимся, что папка существует или создадим её
          try {
            await mkdirp(productFolder);
            console.log(`Директория успешно создана или уже существует: ${productFolder}`);
          } catch (mkdirError) {
            console.error(`Ошибка при создании директории ${productFolder}:`, mkdirError);
            return res
              .status(500)
              .json({ message: `Ошибка при создании директории для продукта.` });
          }
    
          // Путь для перемещения файла
          const newFilePath = path.join(productFolder, uniqueFilename);
    
          // Перемещаем файл
          try {
            await fs.promises.rename(file.path, newFilePath);
            console.log(`Файл успешно перемещен в ${newFilePath}`);
          } catch (renameError) {
            console.error(`Ошибка при перемещении файла ${file.path}:`, renameError);
            return res
              .status(500)
              .json({ message: `Ошибка при перемещении файла.` });
          }
    
          // Формируем путь для базы данных
          const imageUrlForDB = `Article/${productId}/${uniqueFilename}`;
    
          // Находим индекс из parsedNewImages с использованием оригинального имени файла
          const parsedImage = parsedNewImages.find(
            (img) => img.filename === file.originalname
          );
          const imageOrder = parsedImage ? parsedImage.index : i; // Используем индекс, если найден, иначе fallback на i
          console.log(`Порядковый номер изображения: ${imageOrder}`);
    
          // Добавление пути нового изображения в массив
          imageUrls.push({ url: imageUrlForDB, order: imageOrder });
    
          // Запрос на добавление записи в базу данных
          const imageInsertQuery = `
            INSERT INTO images (entity_type, entity_id, image_url, image_order)
            VALUES ('product', $1, $2, $3);
          `;
          const imageValues = [productId, imageUrlForDB, imageOrder];
    
          try {
            await queryDB(imageInsertQuery, imageValues);
            console.log(`Изображение добавлено: ${imageUrlForDB} с порядковым номером ${imageOrder}`);
          } catch (dbError) {
            console.error(`Ошибка при добавлении изображения в базу данных:`, dbError);
            return res
              .status(500)
              .json({ message: `Ошибка при добавлении изображения в базу данных.` });
          }
        }
      } catch (error) {
        console.error("Ошибка при обработке новых изображений:", error);
        return res
          .status(500)
          .json({ message: "Ошибка при добавлении новых изображений." });
      }
    }
    

    // // 2. Удаление старых изображений
    if (Array.isArray(parsedDeletedImages) && parsedDeletedImages.length > 0) {
      try {
        const deleteResults = await Promise.all(
          parsedDeletedImages.map(async (image) => {
            const { url, product_id } = image;

            if (!url) {
              console.warn(`Пропущено изображение с некорректным URL: ${url}`);
              return true; // Пропускаем ошибочные URL
            }

            // Удаление изображения из базы данных
            const dbResult = await deleteImageFromDB(
              "product",
              product_id,
              url
            );
            if (!dbResult) {
              console.warn(
                `Не удалось найти или удалить изображение с URL: ${url}`
              );
              return false;
            }

            // Удаление файла с диска
            const filePath = path.join("static/shop/", url);
            const fileDeleted = await deleteFileFromDisk(filePath);
            if (!fileDeleted) {
              console.warn(`Файл ${filePath} не был удален.`);
              return false;
            }

            return true; // Успешное удаление
          })
        );

        if (deleteResults.some((result) => result === false)) {
          console.warn("Некоторые изображения не удалось удалить.");
          return res
            .status(500)
            .json({ message: "Некоторые изображения не удалось удалить." });
        }
      } catch (error) {
        console.error("Ошибка при удалении изображений:", error);
        return res
          .status(500)
          .json({ message: "Ошибка при удалении изображений." });
      }
    }
    
    
    // // 3. Обновление информации о продукте в базе данных
    console.log(name, description, price, categoryId);
    
    if (name || description || price || categoryId || stock || attributes) {
      try {
        const updateProductQuery = 
          `UPDATE products
          SET
            name = COALESCE($1, name),
            description = COALESCE($2, description),
            price = COALESCE($3, price),
            category_id = COALESCE($4, category_id),
            stock = COALESCE($5, stock), -- Добавляем обновление для stock
            attributes = COALESCE($6, attributes) -- Добавляем обновление для attributes
          WHERE product_id = $7
          RETURNING *;`;
    
        const productValues = [
          name || null,
          description || null,
          price || null,
          categoryId || null,
          stock || null, // Присваиваем значение stock
          attributes || null, // Присваиваем значение attributes
          productId,
        ];
    
        const updatedProduct = await queryDB(updateProductQuery, productValues);
    
        if (updatedProduct.length === 0) {
          return res.status(404).json({ error: "Продукт не найден." });
        }
    
        console.log("Продукт обновлен:", updatedProduct);
      } catch (error) {
        console.error("Ошибка при обновлении данных продукта:", error);
        return res
          .status(500)
          .json({ error: "Ошибка при обновлении данных продукта." });
      }
    }

    if (parsedImages.length > 0) {
      try {
        for (const image of parsedImages) {
          const { id, index, url } = image;

          // Получение текущего порядка и URL из базы данных
          const getOrderQuery = `
            SELECT image_order, image_url
            FROM images
            WHERE image_id = $1;
          `;
          const currentOrderResult = await queryDB(getOrderQuery, [id]);

          if (currentOrderResult.length > 0) {
            const { image_order: currentOrder, image_url: currentUrl } =
              currentOrderResult[0];

            if (currentUrl === url) {
              // Проверка, что URL совпадают
              if (currentOrder !== index) {
                // Проверка, что порядок отличается
                console.log(
                  `Несоответствие порядка для изображения ${id}. Текущий: ${currentOrder}, Новый: ${index}`
                );

                // Обновление порядка
                const updateOrderQuery = `
                  UPDATE images
                  SET image_order = $1
                  WHERE image_id = $2;
                `;
                await queryDB(updateOrderQuery, [index, id]);
                console.log(`Порядок изображения ${id} обновлен на ${index}`);
              }
            } else {
              console.warn(
                `URL изображения с ID ${id} не совпадает. Ожидалось: ${url}, Получено: ${currentUrl}`
              );
            }
          } else {
            console.warn(`Изображение с ID ${id} не найдено в базе данных.`);
          }
        }
      } catch (error) {
        console.error(
          "Ошибка при проверке и обновлении порядка изображений:",
          error
        );
        return res
          .status(500)
          .json({ message: "Ошибка при обновлении порядка изображений." });
      }
    }

    // 4. Возвращаем успешный ответ
    res.status(200).json({
      message: "Продукт обновлен",
      // productId,
      // name,
      // description,
      // price,
      // categoryId,
      // images: imageUrls,
      // deletedImages
    });
  } catch (error) {
    console.error("Ошибка при обновлении продукта:", error);
    res.status(500).json({ message: "Ошибка при обновлении продукта" });
  }
});

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.post("/api/upload-images", upload.array("images[]"), async (req, res) => {
  const uploadedFiles = req.files;
  const indexes = req.body.indexes; // Извлекаем индексы из FormData
  const targetPath = "static/shop/Article/"; // Извлекаем путь из FormData
  console.log("Путь:", targetPath); // Логируем путь для отладки
  
  try {
    // Убедитесь, что директория существует, или создайте её
    await mkdirp(targetPath);

    // Массив для хранения путей файлов
    const imageUrls = [];

    // Перебираем загруженные файлы
    for (const [index, file] of uploadedFiles.entries()) {
      console.log(`Имя файла: ${file.originalname}`); // Должно быть с расширением
      console.log(`Путь: ${file.path}`);
      console.log(`Индекс: ${indexes[index]}`);

      // Новый путь, куда будет сохранен файл
      const newFilePath = path.join(targetPath, file.originalname); // Сохраняем с оригинальным именем

      // Перемещаем файл в целевую директорию
      await fs.promises.rename(file.path, newFilePath);

      console.log(`Файл успешно перемещен в ${newFilePath}`);

      // Добавляем путь к файлу и индекс в массив
      imageUrls.push({
        index: indexes[index],
        url: newFilePath,
      });
    }

    // Отправляем успешный ответ с URL
    res.status(200).json({ success: true, images: imageUrls });
  } catch (err) {
    console.error("Ошибка при обработке файлов:", err);
    res
      .status(500)
      .json({ success: false, message: "Ошибка при загрузке изображений" });
  }
});

router.post("/api/files/uploadFile", upload.single("file"), (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      console.error("Файл не был загружен");
      return res.status(400).json({ message: "Файл не был загружен" });
    }

    const uniqueName = Date.now() + path.extname(file.originalname); // Уникальное имя для файла
    const destinationDir = path.join("static", "category");
    const destinationFilePath = path.join(destinationDir, uniqueName); // Путь для окончательного сохранения файла

    // Создаем директорию, если её нет
    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true });
    }

    // Перемещаем файл из временной директории в нужную папку
    fs.rename(file.path, destinationFilePath, (err) => {
      if (err) {
        console.error("Ошибка при перемещении файла:", err);
        return res
          .status(500)
          .json({ message: "Ошибка сервера при перемещении файла" });
      }

      res.json({
        message: "Файл успешно загружен",
        fileName: uniqueName,
        filePath: destinationFilePath,
      });
    });
  } catch (error) {
    console.error("Ошибка при обработке запроса:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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

router.post("/api/categories/create", async (req, res) => {
  try {
    const { categoryName, description, filePath } = req.body;

    if (!categoryName || !filePath) {
      return res
        .status(400)
        .json({ message: "Не указано имя категории или путь к файлу" });
    }

    // Создание записи в таблице категорий
    const insertCategoryQuery = `
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING category_id;
    `;
    let categoryResult;
    try {
      categoryResult = await queryDB(insertCategoryQuery, [
        categoryName,
        description,
      ]);
    } catch (error) {
      console.error(
        "Ошибка при выполнении запроса insertCategoryQuery:",
        error
      );
      return res.status(500).json({ message: "Ошибка при создании категории" });
    }

    if (categoryResult.length === 0) {
      return res
        .status(500)
        .json({ message: "Ошибка при создании категории. Нет результата." });
    }

    const categoryId = categoryResult[0].category_id;

    // Добавление изображения для категории в таблицу images
    const insertImageQuery = `
      INSERT INTO images (entity_id, entity_type, image_url, image_order)
      VALUES ($1, 'category', $2, 1);
    `;
    await queryDB(insertImageQuery, [
      categoryId, // ID категории
      filePath.replace("static/", ""), // Путь к файлу без 'images/' в начале
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
      return res
        .status(400)
        .json({ message: "Не указано имя категории или id" });
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
      categoryResult = await queryDB(updateCategoryQuery, [
        categoryName,
        description,
        categoryId,
      ]);
    } catch (error) {
      console.error(
        "Ошибка при выполнении запроса updateCategoryQuery:",
        error
      );
      return res
        .status(500)
        .json({ message: "Ошибка при обновлении категории" });
    }

    if (categoryResult.length === 0) {
      return res.status(500).json({ message: "Категория не найдена" });
    }

    // Если путь к новому изображению был передан
    if (filePath) {
      // Проверяем, существует ли запись в таблице images
      const checkImageQuery = `
        SELECT image_id FROM images
        WHERE entity_id = $1 AND entity_type = 'category';
      `;

      let imageResult;
      try {
        imageResult = await queryDB(checkImageQuery, [categoryId]);
      } catch (error) {
        console.error("Ошибка при выполнении запроса checkImageQuery:", error);
        return res
          .status(500)
          .json({ message: "Ошибка при проверке изображения" });
      }

      if (imageResult.length > 0) {
        // Если запись существует, обновляем её
        const updateImageQuery = `
          UPDATE images
          SET image_url = $1
          WHERE entity_id = $2 AND entity_type = 'category';
        `;
        await queryDB(updateImageQuery, [
          filePath.replace("static/", ""),
          categoryId,
        ]);
      } else {
        // Если записи нет, добавляем её
        const insertImageQuery = `
          INSERT INTO images (entity_id, entity_type, image_url, image_order)
          VALUES ($1, 'category', $2, 1);
        `;
        await queryDB(insertImageQuery, [
          categoryId,
          filePath.replace("static/", ""),
        ]);
      }
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
async function deleteImageFromDB(entityType, entityId, imageUrl) {
  const query = `
    DELETE FROM images
    WHERE entity_type = $1
      AND entity_id = $2
      AND image_url = $3
    RETURNING *;
  `;
  const values = [entityType, entityId, imageUrl]; // Параметры для запроса

  try {
    const result = await queryDB(query, values); // Выполняем запрос

    if (result.length === 0) {
      console.log(
        `Запись не найдена в базе данных для ${entityType} с ID ${entityId} и image_url ${imageUrl}`
      );
      return false; // Если запись не найдена, возвращаем false
    }

    console.log(
      `Запись с ${entityType} ID ${entityId} и image_url ${imageUrl} успешно удалена из базы данных`
    );
    return true; // Успешное удаление
  } catch (err) {
    console.error("Ошибка при удалении записи из базы данных:", err);
    return false; // В случае ошибки в базе данных, возвращаем false
  }
}
async function deleteFileFromDisk(filePath) {
  const fullPath = path.join(filePath); // Полный путь к файлу на сервере

  try {
    await fs.promises.access(fullPath); // Проверяем наличие файла
    await fs.promises.unlink(fullPath); // Удаляем файл, если он существует
    console.log(`Файл ${fullPath} успешно удален с диска`);
    return true; // Успешное удаление
  } catch (err) {
    if (err.code === "ENOENT") {
      // Если файл не найден
      console.warn(`Файл ${fullPath} не найден, пропускаем удаление.`);
      return true; // Возвращаем true, так как отсутствие файла не критично
    }
    console.error(`Ошибка при удалении файла ${fullPath}:`, err);
    return false; // Возвращаем false для других ошибок
  }
}
async function deleteProductFromDB(productId) {
  const query = `DELETE FROM products WHERE product_id = $1 RETURNING *`;
  const values = [productId];

  try {
    const result = await queryDB(query, values);

    if (result.length === 0) {
      console.log(`Продукт с ID ${productId} не найден в базе данных`);
      return false; // Если продукт не найден
    }

    console.log(`Продукт с ID ${productId} успешно удален из базы данных`);
    return true; // Продукт успешно удален
  } catch (err) {
    console.error("Ошибка при удалении продукта из базы данных:", err);
    return false; // В случае ошибки при удалении
  }
}
app.post("/api/products/delete", async (req, res) => {
  const { productId, images } = req.body;

  try {
    if (Array.isArray(images) && images.length > 0) {
      // Обрабатываем удаление изображений
      const deleteResults = await Promise.all(
        images.map(async (image) => {
          const { url, product_id } = image;

          // Проверяем, есть ли валидный URL
          if (!url) {
            console.warn(`Пропущено изображение с некорректным URL: ${url}`);
            return true; // Считаем этот случай успешным, чтобы не прерывать выполнение
          }

          // Удаляем изображение из базы данных
          const dbResult = await deleteImageFromDB("product", product_id, url);
          if (!dbResult) {
            console.warn(
              `Не удалось найти или удалить изображение с URL: ${url}`
            );
          }

          // Удаляем файл изображения с диска
          const filePath = path.join("static/shop/", url);
          const fileDeleted = await deleteFileFromDisk(filePath);
          if (!fileDeleted) {
            console.warn(`Файл ${filePath} не найден или не был удален.`);
          }

          return true; // Успешное завершение обработки изображения
        })
      );

      // Если хотя бы одно удаление завершилось с ошибкой, логируем предупреждение
      const allProcessed = deleteResults.every((result) => result === true);
      if (!allProcessed) {
        console.warn("Некоторые изображения не удалось обработать.");
      }
    } else {
      console.log(
        "Изображения отсутствуют, продолжаем удаление только продукта."
      );
    }

    // Удаляем продукт из базы данных
    const deleteProductResult = await deleteProductFromDB(productId);
    if (!deleteProductResult) {
      throw new Error("Не удалось удалить продукт.");
    }

    res.status(200).json({ message: "Продукт успешно удален." });
  } catch (error) {
    console.error("Ошибка при удалении товара и его изображений:", error);
    res.status(500).json({ message: error.message || "Ошибка сервера" });
  }
});

app.delete("/api/files/delete", async (req, res) => {
  const { filePath, categoryId } = req.body; // Извлекаем путь к файлу и ID категории
  console.log("Запрос на удаление файла:", filePath);
  console.log("ID категории:", categoryId);

  // Преобразуем путь файла (удаляем "static/")
  const imageUrl = filePath.replace("static/", "");

  try {
    // Сначала удаляем запись из базы данных
    const type = "category";
    console.log(type);
    const dbDeleteSuccess = await deleteImageFromDB(type, categoryId, imageUrl);

    if (!dbDeleteSuccess) {
      return res
        .status(404)
        .json({ message: "Изображение не найдено в базе данных" });
    }

    // Если запись успешно удалена, удаляем файл с диска
    const fileDeleteSuccess = await deleteFileFromDisk(filePath);

    if (!fileDeleteSuccess) {
      return res
        .status(500)
        .json({ message: "Ошибка при удалении файла с диска" });
    }

    res.status(200).json({
      message: "Изображение и файл успешно удалены",
      path: filePath,
    });
  } catch (error) {
    console.error("Ошибка при удалении изображения:", error);
    res
      .status(500)
      .json({ message: "Ошибка сервера при удалении изображения" });
  }
});
// router.put("/api/files/rename", (req, res) => {
//   const { oldPath, newPath } = req.body;
//   console.log("Запрос на переименование файла:");
//   console.log("Старый путь:", oldPath);
//   console.log("Новый путь:", newPath);

//   // Только логируем, файл пока не переименовываем
//   res
//     .status(200)
//     .json({ message: "Переименование файла получено", oldPath, newPath });
// });

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
        p.stock,  
        p.attributes,
        JSON_AGG(JSON_BUILD_OBJECT('id', i.image_id, 'url', i.image_url, 'order', i.image_order) ORDER BY i.image_order) AS images

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
    // Проверяем, есть ли продукты, связанные с категорией
    const products = await queryDB(
      "SELECT * FROM products WHERE category_id = $1",
      [id]
    );

    if (products.length > 0) {
      return res
        .status(400)
        .send("Category cannot be deleted because it has associated products");
    }

    // Удаление категории
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

app.get("/api/gallery-images", async (req, res) => {
  try {
    const { gallery_id: galleryId, search } = req.query;

    // Основной запрос для получения изображений галереи
    let query = `
      SELECT 
        i.image_id,
        i.entity_type,
        i.entity_id,
        i.image_url,
        i.image_type,
        i.created_at,
        i.image_order
      FROM 
        images i
      WHERE 
        i.entity_type = 'gallery'
    `;

    const conditions = [];
    if (galleryId) conditions.push(`i.entity_id = ${galleryId}`);
    if (search) conditions.push(`(i.image_url ILIKE '%${search}%')`);

    if (conditions.length > 0) {
      query += ` AND ` + conditions.join(" AND ");
    }

    query += ` ORDER BY i.image_order ASC`; // Упорядочиваем изображения по полю image_order

    // Выполнение запроса к базе данных
    const galleryImages = await queryDB(query);
    console.log(galleryImages);

    // Возвращаем изображения галереи
    if (galleryImages.length > 0) {
      res.json(galleryImages);
    } else {
      res.status(404).json({ error: "Gallery images not found" });
    }
  } catch (err) {
    console.error("Error fetching gallery images:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/create-products", async (req, res) => {
  const productData = req.body;

  console.log("Получен новый продукт:");
  console.log("id категории:", productData.category_id);
  console.log("Название:", productData.name);
  console.log("Цена:", productData.price);
  console.log("Описание:", productData.description);
  console.log("Длина массива:", productData.images.length);
  console.log("Фото:", productData.images);
  console.log("Наличие товара:", productData.stock);  // Выводим stock
  console.log("Характеристики товара:", productData.attributes);  // Выводим attributes

  try {
    // Проверка на наличие данных в productData.images
    if (!Array.isArray(productData.images) || productData.images.length === 0) {
      return res.status(400).json({ error: "Нет изображений для добавления." });
    }

    // 1. Добавляем новый продукт в таблицу `products`, включая stock и attributes
    const insertProductQuery = `
      INSERT INTO products (category_id, name, description, price, stock, attributes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING product_id;
    `;
    const values = [
      productData.category_id,
      productData.name,
      productData.description,
      productData.price,
      productData.stock,  // Добавляем stock
      productData.attributes ? JSON.stringify(productData.attributes) : null,  // Сохраняем attributes как JSON
    ];

    const result = await queryDB(insertProductQuery, values);

    // Логирование результата запроса
    console.log("Результат запроса insertProductQuery:", result);
    const newProductId = Array.isArray(result)
      ? result[0].product_id
      : result.rows[0].product_id;
    console.log("Новый продукт добавлен с ID:", newProductId);

    // 2. Добавляем изображения для нового продукта в таблицу `images`
    for (let i = 0; i < productData.images.length; i++) {
      const image = productData.images[i];
      const imageOrder = parseInt(image.index, 10);

      if (isNaN(imageOrder)) {
        return res
          .status(400)
          .json({ error: "Некорректный индекс изображения." });
      }

      // Удаляем префикс "static/" из пути изображения
      const imageUrlWithoutStatic = image.url.replace(/^static\/shop\//, "");

      const imageInsertQuery = `
        INSERT INTO images (entity_type, entity_id, image_url, image_order)
        VALUES ('product', $1, $2, $3);
      `;
      const imageValues = [newProductId, imageUrlWithoutStatic, imageOrder];

      console.log(
        "Выполняем запрос:",
        imageInsertQuery,
        "с параметрами:",
        imageValues
      );

      try {
        await queryDB(imageInsertQuery, imageValues);
        console.log(
          `Изображение добавлено: ${imageUrlWithoutStatic} с порядковым номером ${imageOrder}`
        );
      } catch (error) {
        console.error(
          "Ошибка при добавлении изображения:",
          error,
          "Параметры:",
          imageValues
        );
      }
    }

    // 3. Возвращаем данные о новом продукте
    const newProduct = {
      product_id: newProductId,
      ...productData,
    };

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Ошибка при создании продукта:", error);
    res.status(500).json({ error: "Произошла ошибка при создании продукта." });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

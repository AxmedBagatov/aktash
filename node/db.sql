-- Таблица категорий
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,            -- Идентификатор категории
    name VARCHAR(255) NOT NULL,                -- Название категории (например, "Электроника", "Одежда")
    description TEXT,                          -- Описание категории
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Дата добавления категории
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- Дата последнего обновления категории
);

-- Таблица товаров
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,              -- Идентификатор товара
    name VARCHAR(255) NOT NULL,                  -- Название товара
    description TEXT,                            -- Описание товара
    price DECIMAL(10, 2) NOT NULL,               -- Цена товара
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Дата и время добавления товара
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- Дата и время последнего обновления
);

-- Таблица связи товаров и категорий
CREATE TABLE product_categories (
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,  -- Ссылка на товар
    category_id INT REFERENCES categories(category_id) ON DELETE CASCADE,  -- Ссылка на категорию
    PRIMARY KEY (product_id, category_id)                               -- Композитный ключ для связи товара и категории
);

-- Таблица изображений товара
CREATE TABLE product_images (
    image_id SERIAL PRIMARY KEY,                  -- Идентификатор изображения
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,  -- Ссылка на товар
    image_url VARCHAR(255) NOT NULL,               -- URL изображения (можно использовать ссылку на файл)
    image_type VARCHAR(50) NOT NULL,               -- Тип изображения (например, "gif", "jpg", "png")
    is_primary BOOLEAN DEFAULT FALSE,             -- Является ли это изображение основным
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- Дата добавления изображения
);

-- Таблица характеристик товара
CREATE TABLE product_attributes (
    attribute_id SERIAL PRIMARY KEY,              -- Идентификатор характеристики
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,  -- Ссылка на товар
    attribute_name VARCHAR(255) NOT NULL,          -- Название характеристики (например, "Цвет", "Размер")
    attribute_value VARCHAR(255) NOT NULL,         -- Значение характеристики (например, "Красный", "XL")
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- Дата добавления характеристики
);

-- Таблица тегов
CREATE TABLE tags (
    tag_id SERIAL PRIMARY KEY,                    -- Идентификатор тега
    tag_name VARCHAR(50) UNIQUE NOT NULL           -- Название тега
);

-- Таблица связей товаров и тегов
CREATE TABLE product_tags (
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,   -- Ссылка на товар
    tag_id INT REFERENCES tags(tag_id) ON DELETE CASCADE,               -- Ссылка на тег
    PRIMARY KEY (product_id, tag_id)                                      -- Композитный ключ для связи товара и тега
);

-- Индексы для улучшения производительности поиска
CREATE INDEX idx_product_name ON products(name);
CREATE INDEX idx_product_tags ON product_tags(tag_id);
CREATE INDEX idx_product_images ON product_images(product_id);
CREATE INDEX idx_product_attributes ON product_attributes(product_id);
CREATE INDEX idx_product_categories ON product_categories(category_id);  -- Индекс для быстрого поиска по категориям

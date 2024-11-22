const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors()); 

// Пример товаров для демонстрации
let products = [
    { id: 1, name: 'Товар 1', description: 'Описание товара 1', price: 100 },
    { id: 2, name: 'Товар 2', description: 'Описание товара 2', price: 200 },
    { id: 3, name: 'Товар 3', description: 'Описание товара 3', price: 300 },
];

// Роут для получения списка товаров
app.get('/products', (req, res) => {
    res.json(products);
});

// Инициализация бота
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

// Команда /moveToSite
bot.onText(/\/site/, (msg) => {
    const chatId = msg.chat.id;
    
    // Сообщение для пользователя
    const message = "Нажмите кнопку ниже, чтобы открыть сайт в Telegram.";

    // Создаем inline кнопку для открытия сайта
    const inlineKeyboard = {
        inline_keyboard: [
            [
                {
                    text: "Перейти на сайт",  // Текст кнопки
                    web_app: {
                        url: 'https://vueshop.ru'  // URL вашего сайта
                    }
                }
            ]
        ]
    };
    
    // Отправляем сообщение с inline кнопкой
    bot.sendMessage(chatId, message, { reply_markup: inlineKeyboard });
});


bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    
    // Сообщение для пользователя
    const message = "Перейти на сайт";

    // Создаем inline кнопку для открытия сайта
    const inlineKeyboard = {
        inline_keyboard: [
            [
                {
                    text: "Запустить игру",  // Текст кнопки
                    web_app: {
                        url: 'https://vueshop.ru'  // URL вашего сайта
                    }
                }
            ]
        ]
    };
    
    // Отправляем сообщение с inline кнопкой
    bot.sendMessage(chatId, message, { reply_markup: inlineKeyboard });
});


// Обработка команд и заказов
bot.onText(/\/order (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const productId = parseInt(match[1]);

    const product = products.find((p) => p.id === productId);

    if (product) {
        bot.sendMessage(chatId, `Спасибо за заказ! Вы заказали: ${product.name} за $${product.price}`);
    } else {
        bot.sendMessage(chatId, 'Извините, такого товара нет.');
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

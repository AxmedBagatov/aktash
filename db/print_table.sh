#!/bin/bash

# Проверка, был ли передан аргумент
if [ -z "$1" ]; then
  echo "Пожалуйста, укажите название таблицы."
  exit 1
fi

# Название таблицы передается как аргумент
TABLE_NAME=$1

# Формирование имени выходного файла
OUTPUT_FILE="${TABLE_NAME}_schema.txt"

# Выполнение команды для вывода схемы таблицы и сохранение в файл
psql -U postgres -d db_vueshop -c "\d $TABLE_NAME" > $OUTPUT_FILE

echo "Схема таблицы $TABLE_NAME сохранена в файл $OUTPUT_FILE."

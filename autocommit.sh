#!/bin/bash
cd /home/axma/shop/
# Проверка на изменения
git diff-index --quiet HEAD || git commit -am "Автоматический коммит изменений"

# Отправка изменений в репозиторий
git push origin main

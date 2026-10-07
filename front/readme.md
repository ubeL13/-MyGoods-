# MyGoods — frontend

Админ-панель сервиса учёта товаров, заказов и склада.

## Стек

- React 19, TypeScript
- Vite
- Ant Design (UI-компоненты, русская локаль)
- React Router (маршрутизация)
- Axios (запросы к API)
- ESLint, Prettier

## Запуск

Нужен Node.js 20 или новее.

1. Установить зависимости:

   ```bash
   npm install
   ```

2. Создать файл `.env` по образцу `.env.example` и указать адрес backend:

   ```bash
   cp .env.example .env
   ```

   ```env
   VITE_API_URL=http://localhost:8080
   ```

   Файл `.env` в git не коммитим.

3. Запустить dev-сервер:

   ```bash
   npm run dev
   ```

   Приложение откроется на http://localhost:5173 (в терминале адрес может отображаться как `127.0.0.1:5173`, это то же самое).

## Скрипты

| Команда                | Что делает                         |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | Dev-сервер с горячей перезагрузкой |
| `npm run build`        | Проверка типов и сборка в `dist/`  |
| `npm run preview`      | Просмотр собранной версии          |
| `npm run lint`         | Проверка кода ESLint               |
| `npm run lint:fix`     | Автоисправление ошибок ESLint      |
| `npm run format`       | Форматирование кода Prettier       |
| `npm run format:check` | Проверка форматирования            |

Перед PR должны проходить `npm run lint` и `npm run build`.

## Структура

Проект разложен по слоям [Feature-Sliced Design](https://feature-sliced.design/ru/):

```text
src/
├── app/          # инициализация приложения
│   ├── providers/  # провайдеры (Ant Design + роутер)
│   ├── router/     # маршруты и ленивая загрузка страниц
│   └── ui/         # общие layout: Layout (шапка) и AdminLayout (боковое меню)
├── pages/        # страницы, по одной папке на страницу
├── widgets/      # крупные блоки интерфейса: Header, AdminSidebar
├── features/     # действия пользователя: формы, фильтры
├── entities/     # бизнес-сущности: товар, категория, заказ
└── shared/       # общее, не знающее о бизнесе
    ├── api/        # API-клиент и список эндпоинтов
    └── config/     # маршруты, переменные окружения, CSS-переменные
```

Правила импортов (их проверяет ESLint):

- Слой может импортировать только слои ниже себя: `app → pages → widgets → features → entities → shared`.
- Из другого слайса импортируем только через его `index.ts`: `@/pages/admin/products`, а не `@/pages/admin/products/ui/ProductsPage`.
- `@/` — алиас для `src/`.

## Маршруты

Все страницы админки лежат под `/admin` внутри `AdminLayout` (шапка + боковое меню).

| Путь                         | Страница                                   |
| ---------------------------- | ------------------------------------------ |
| `/`                          | Редирект на каталог (пока нет авторизации) |
| `/admin/products`            | Каталог товаров                            |
| `/admin/products/:productId` | Карточка товара                            |
| `/admin/categories`          | Категории                                  |
| остальные                    | 404                                        |

### Как добавить страницу

1. Создать слайс страницы: `src/pages/admin/<name>/ui/<Name>Page.tsx` и `src/pages/admin/<name>/index.ts` с экспортом.
2. Добавить путь в `APP_ROUTES` и сегмент в `ROUTE_SEGMENTS` (`src/shared/config/routes.ts`).
3. Добавить ленивую загрузку в `src/app/router/lazyPages.ts`.
4. Добавить маршрут в `src/app/router/routes.tsx` внутрь `AdminLayout`, обернув страницу в `PageSuspense`.
5. Если страница должна быть в меню, добавить пункт в `src/widgets/AdminSidebar/model/menuConfig.ts`.

## Работа с API

Все запросы идут через общий клиент `apiClient` (`src/shared/api/client.ts`). Адрес backend берётся из `VITE_API_URL`.

Пути эндпоинтов хранятся в `API_ENDPOINTS` (`src/shared/api/endpoints.ts`), все с префиксом `/api/v1`. Строки с адресами в компонентах не пишем.

```ts
import { API_ENDPOINTS, apiClient } from '@/shared/api'

const { data } = await apiClient.get(API_ENDPOINTS.products.list)
```

Новый эндпоинт сначала добавляем в `API_ENDPOINTS`, потом используем.

## Код-стайл

- Prettier: без точек с запятой, одинарные кавычки, ширина строки 80.
- Импорты сортируются автоматически (`npm run lint:fix`).
- Стили — CSS-модули (`*.module.css`), классы по БЭМ: `block__element`.
- Цвета и отступы — через CSS-переменные из `src/shared/config/theme/cssVars.css`.

Правила работы с ветками, коммитами и PR — в README в корне репозитория.

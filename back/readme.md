# MyGoods — backend

ASP.NET Core Web API для учёта товаров, заказов и склада. База данных — PostgreSQL в Docker.

## Стек

- C#, .NET 9, ASP.NET Core Web API
- Entity Framework Core 9 + Npgsql (PostgreSQL)
- PostgreSQL 16 в Docker
- Swagger (Swashbuckle)
- xUnit (тесты)

## Что установить (один раз)

| Что | Зачем | Проверка |
| --- | --- | --- |
| [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0) | сборка и запуск API | `dotnet --list-sdks` — в списке есть `9.0.x` |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | база PostgreSQL | `docker --version`, в Docker Desktop статус «Engine running» |
| dotnet-ef | миграции базы | `dotnet ef --version` |
| Visual Studio 2022 17.12+ или 2026 (необязательно) | удобный запуск и отладка | — |

Установить `dotnet-ef`:

```bash
dotnet tool install --global dotnet-ef --version 9.0.20
```

## Запуск с нуля

Все команды выполняются из папки `back`.

### 1. Запустить базу данных

Запустить Docker Desktop и дождаться статуса «Engine running», затем:

```bash
docker compose up -d
```

Поднимется контейнер `mygoods-postgres` с PostgreSQL 16 на порту `5432` (база, логин и пароль — `mygoods`). Данные хранятся в volume `mygoods-pgdata` и не пропадают при перезапуске.

### 2. Создать таблицы (применить миграции)

```bash
dotnet ef database update --project src/MyGoods.Infrastructure --startup-project src/MyGoods.Api
```

Повторять после каждого `git pull`, в котором появились новые миграции (папка `src/MyGoods.Infrastructure/Migrations`).

### 3. Запустить API

**Visual Studio:** открыть `back/MyGoods.sln` → выбрать проект `MyGoods.Api` и профиль `http` → F5. Браузер сам откроет Swagger.

**Командная строка:**

```bash
dotnet run --project src/MyGoods.Api --launch-profile http
```

### 4. Проверить

Открыть Swagger: http://localhost:8080/swagger — там все эндпоинты, примеры JSON и кнопка **Try it out** для отправки запросов.

### 5. Фронтенд

Запуск фронта описан в [`front/readme.md`](../front/readme.md). Фронт ждёт API по адресу `http://localhost:8080` и работает на `http://localhost:5173` (этот адрес разрешён в CORS).

## Адреса и порты

| Что | Адрес |
| --- | --- |
| API | http://localhost:8080 |
| Swagger | http://localhost:8080/swagger |
| PostgreSQL | `localhost:5432`, база/логин/пароль `mygoods` |
| Фронтенд (разрешён в CORS) | http://localhost:5173 |

## Эндпоинты

| Метод | Адрес | Что делает |
| --- | --- | --- |
| GET | `/api/v1/products` | каталог: `search`, `categoryId`, `minPrice`, `maxPrice`, `inStock`, `isActive`, `sortBy`, `sortOrder`, `page`, `limit` |
| GET | `/api/v1/products/{id}` | карточка товара с остатком |
| POST | `/api/v1/products` | создать товар |
| PUT | `/api/v1/products/{id}` | изменить товар |
| PATCH | `/api/v1/products/{id}/active` | снять с продажи / вернуть (`{"isActive": false}`) |

Ошибки возвращаются в формате ProblemDetails: `400` — неверные данные, `404` — не найдено, `409` — конфликт (например, артикул занят), `500` — внутренняя ошибка.

## Тесты

```bash
dotnet test
```

## Структура решения

```text
back/
├── docker-compose.yml          — PostgreSQL в Docker
├── MyGoods.sln
├── src/
│   ├── MyGoods.Core            — сущности, интерфейсы репозиториев, enum'ы
│   ├── MyGoods.Infrastructure  — AppDbContext, репозитории, миграции
│   ├── MyGoods.Application     — сервисы (бизнес-логика), маппинг, исключения
│   ├── MyGoods.Dto             — DTO запросов и ответов, интерфейсы сервисов
│   └── MyGoods.Api             — контроллеры, Program.cs, обработчик ошибок
└── tests/
    └── MyGoods.Tests           — unit-тесты (xUnit)
```

Путь запроса: **Controller → Service → Repository → AppDbContext → PostgreSQL**.

## Работа с базой

Создать новую миграцию после изменения сущностей или `AppDbContext`:

```bash
dotnet ef migrations add НазваниеМиграции --project src/MyGoods.Infrastructure --startup-project src/MyGoods.Api --output-dir Migrations
```

Пересоздать базу с нуля (все данные удалятся):

```bash
dotnet ef database drop -f --project src/MyGoods.Infrastructure --startup-project src/MyGoods.Api
dotnet ef database update --project src/MyGoods.Infrastructure --startup-project src/MyGoods.Api
```

Остановить базу: `docker compose down` (данные сохранятся). Удалить вместе с данными: `docker compose down -v`.

## Частые проблемы

| Симптом | Причина и решение |
| --- | --- |
| `Failed to connect to 127.0.0.1:5432`, API отвечает 500 | Не запущен Docker Desktop или контейнер. Запустить Docker Desktop, затем `docker compose up -d` |
| `failed to connect to the docker API ... dockerDesktopLinuxEngine` | Docker Desktop не запущен — запустить и дождаться «Engine running» |
| `relation "Products" does not exist` | Не применены миграции — шаг 2 |
| `dotnet test` пишет «Тестовый запуск прерван», не найден `Microsoft.NETCore.App 9.0` | Не установлен .NET 9 — поставить .NET 9 SDK |
| Сборка: «не удалось скопировать MyGoods.Api.exe ... файл используется другим процессом» | API уже запущен — остановить его (Shift+F5 в VS или Ctrl+C в терминале) |
| `address already in use` / порт 8080 занят | Запущен второй экземпляр API или другая программа на 8080 — закрыть её |
| `dotnet ef: command not found` | Не установлен dotnet-ef — см. «Что установить» |
| Windows 10: бесконечные окна «Удалённый рабочий стол / RemoteApp» после запуска Docker | Это WSLg. В файл `%USERPROFILE%\.wslconfig` добавить `[wsl2]` и `guiApplications=false`, выполнить `wsl --shutdown` и перезапустить Docker Desktop |

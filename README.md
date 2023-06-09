# Сервис записи и уведомлений о записях к врачу

## Описание

Сервис принимает запросы на запись к врачам на определённое время. Затем оповещает клиентов за 2 часа и 1 день перед приёмом.

## Принцип работы сервиса

Сервис каждые полчаса проверяет записи докторов и если их время записи становится ближе к времени проверки на 2 часа или 1 день, то приходит оповещание.

У сервиса есть две джобы:

- **distribute-notifications** - Повторяемая джоба, которая проверяет слоты на необходимость оповещания
- **notify-user** - Джоба, которая оповещает клиента о приёме

## Используемые технологии

Nodejs, ExpressJs, Redis, MongoDB, Mongoose, BullMQ, Docker

## Тесты

### Примечание

Для тестов можно использовать айдишник докторов и клиентов, начиная с 1. При старте в базу записывается два доктора(id: 1 и 2) с слотами с 9:00 по 21:00 и клиентами с айди 1, 2 и 3.

Для наглядности джоба, проверяющая на необходимость оповещания работает с минутной периодичностью для тестов.

### Запуск

### Требования

Должен быть установлен [Docker](https://docs.docker.com/engine/install/) и [Docker Compose CLI](https://docs.docker.com/compose/install/).

Если версия Docker 1, то для запуска необходимо выполнить команду **docker-compose up**
Если версия Docker выше 2 или выше, то для запуска требуется выполнить команду **docker compose up**

Далее необходимо выполнить запрос

```curl
curl --location --request POST 'http://localhost:3001/api/v1/patient/book' \
--header 'Content-Type: application/json' \
--data-raw '{
    "doctor_id "1",
    "user_id": "1",
    "slot": "2023-05-09 09:30:00" 
}'
```

## Запросы

### Запись к врачу

```curl
curl --location --request POST 'http://localhost:3001/api/v1/patient/book' \
--header 'Content-Type: application/json' \
--data-raw '{
    "doctor_id "1",
    "user_id": "1",
    "slot": "2023-05-09 09:30:00"
}'
```

**Request:**
| name | type | required |
|---|---|---|
| doctor_id |  string | yes |
| user_id | string | yes |
| slot | UTC Date | yes |

## Вспомогательные материалы

[Просмотр джоб](http://localhost:3001/admin/queues/).
[Просмотр базы данных](http://0.0.0.0:8081/db/hospital/)

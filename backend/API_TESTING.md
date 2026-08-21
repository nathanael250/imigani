# API Testing

The backend uses a single command/request endpoint.

## Health

```bash
curl -X POST http://127.0.0.1:5055 \
  -H "Content-Type: application/json" \
  -d '{"command":"HEALTH"}'
```

## Available Requests

```bash
curl -X POST http://127.0.0.1:5055 \
  -H "Content-Type: application/json" \
  -d '{"command":"AVAILABLE_REQUESTS"}'
```

## List Tour Categories

```bash
curl -X POST http://127.0.0.1:5055 \
  -H "Content-Type: application/json" \
  -d '{"command":"LIST_TOUR_CATEGORIES","data":{"limit":20}}'
```

You can also use the request style:

```json
{
  "request": "tourCategories.list",
  "data": {
    "limit": 20
  }
}
```

## Login

```bash
curl -X POST http://127.0.0.1:5055 \
  -H "Content-Type: application/json" \
  -d '{"command":"LOGIN","data":{"email":"admin@example.com","password":"password"}}'
```

# IMIGANI Backend

Node.js + Express backend for the IMIGANI Tours website.

The backend follows a command/request pattern:

- Controllers stay thin.
- Routes stay minimal.
- Business/database logic lives in model files.
- API calls use `POST` with a command/request in the body or header.

## Structure

```txt
backend
├── src
│   ├── app.js
│   ├── server.js
│   ├── config
│   │   ├── command.js
│   │   ├── database.js
│   │   ├── env.js
│   │   ├── imigani_db.sql
│   │   ├── paths.js
│   │   └── permissions.js
│   ├── controllers
│   │   └── masterController.js
│   ├── middleware
│   │   ├── auth.js
│   │   ├── authOptional.js
│   │   ├── authorize.js
│   │   ├── errorMiddleware.js
│   │   └── uploads.js
│   ├── models
│   │   ├── baseModel.js
│   │   ├── dashboardModel.js
│   │   ├── destinationModel.js
│   │   ├── inquiryModel.js
│   │   ├── masterModel.js
│   │   ├── tourModel.js
│   │   ├── tripPlanModel.js
│   │   └── userModel.js
│   ├── routers
│   │   └── master.routes.js
│   └── utils
└── uploads
```

## Scripts

```bash
npm run dev
npm start
npm run check
npm run db:setup
npm run db:seed-admin
```

## Environment

Copy `.env.example` to `.env` and adjust values.

```bash
cp .env.example .env
```

Default local URL:

```txt
http://127.0.0.1:5055
```

## Database

The database schema is:

```txt
src/config/imigani_db.sql
```

Import it with:

```bash
npm run db:setup
```

The schema drops and recreates the website tables listed in it, so only run it against the intended local/development database.

To create a local admin user for testing:

```bash
npm run db:seed-admin
```

Default seed credentials are in `utils/admin_seeds.js`.

## API Pattern

Use `POST /` with a command:

```json
{
  "command": "LIST_TOURS",
  "data": {
    "limit": 20
  }
}
```

You can also use request names:

```json
{
  "request": "tours.list",
  "data": {
    "limit": 20
  }
}
```

Commands can also be sent in headers:

```bash
curl -X POST http://127.0.0.1:5055 \
  -H "Command: LIST_TOURS" \
  -H "Content-Type: application/json" \
  -d '{"data":{"limit":20}}'
```

## Useful Commands

- `AVAILABLE_REQUESTS`
- `HEALTH`
- `LOGIN`
- `DASHBOARD_SUMMARY`
- `LIST_TOUR_CATEGORIES`
- `CREATE_TOUR_CATEGORY`
- `LIST_TOURS`
- `GET_TOUR`
- `CREATE_TOUR`
- `UPDATE_TOUR`
- `DELETE_TOUR`
- `LIST_DESTINATIONS`
- `CREATE_DESTINATION`
- `LIST_INQUIRIES`
- `CREATE_INQUIRY`
- `LIST_TRIP_PLANS`
- `CREATE_TRIP_PLAN`
- `LIST_USERS`

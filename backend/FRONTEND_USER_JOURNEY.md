# Frontend User Journey

The frontend should call the backend with `POST /` and a command in the body or `Command` header.

Suggested public flows:

1. Home page loads published tours/categories/destinations.
2. Contact form sends `CREATE_INQUIRY`.
3. Plan journey form sends `CREATE_TRIP_PLAN`.
4. Dashboard loads `DASHBOARD_SUMMARY`, `LIST_INQUIRIES`, `LIST_TOURS`, and `LIST_USERS`.

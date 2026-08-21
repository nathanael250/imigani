# Public API Examples

## Create Inquiry

```json
{
  "command": "CREATE_INQUIRY",
  "data": {
    "name": "Emma Johnson",
    "email": "emma@example.com",
    "phone": "+250 700 000 000",
    "inquiry": "Interested in a Rwanda gorilla trekking tour."
  }
}
```

## Create Trip Plan

```json
{
  "command": "CREATE_TRIP_PLAN",
  "data": {
    "name": "David Lee",
    "email": "david@example.com",
    "number_of_people": 4,
    "arrival_date": "2026-09-12",
    "departure_date": "2026-09-20",
    "message": "We want Rwanda and Uganda wildlife experiences.",
    "interest_ids": [1, 2],
    "category_ids": [1, 2]
  }
}
```

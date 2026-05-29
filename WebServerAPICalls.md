# Restaurants API Documentation

## Base URL
`/api/restaurants`

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Retrieve all restaurants. |
| POST | `/` | Create a new restaurant. |
| GET | `/:id` | Retrieve a specific restaurant by ID. |
| PATCH | `/:id` | Partially update an existing restaurant. |
| DELETE | `/:id` | Delete a restaurant by ID. |

---

## Endpoint Details

### 1. Retrieve All Restaurants
* **Method:** `GET`
* **Endpoint:** `/`
* **Responses:**
  * **200 OK**
    ```json
    [
        {
            "id": "5aeb13c5-b3c2-44ea-b7fd-04d06708dac8",
            "name": "Pizza Planet",
            "description": "Out of this world pizza",
            "category": "Italian",
            "authorizedUsers": ["user99"],
            "phone": "03-9876543",
            "email": "hello@pizzaplanet.co.il",
            "address": {
                "city": "Ramat Gan",
                "street": "Bialik",
                "houseNum": 12,
                "floor": 0
            },
            "products": ["5ac89d68-585d-4b2c-9761-da50151156ad", "cc464551-c0b2-413a-9899-7801a08ad54c"]
        }
    ]
    ```

### 2. Create Restaurant
* **Method:** `POST`
* **Endpoint:** `/`
* **Request Body:** `application/json`
  * **Required:** `name`, `category`, `authorizedUsers`, `phone`, `email`, `address`
  * **Optional:** `description`, `products`
  ```json
  {
    "name": "Pizza Planet",
    "description": "Out of this world pizza",
    "category": "Italian",
    "authorizedUsers": ["user99"],
    "phone": "03-9876543",
    "email": "hello@pizzaplanet.co.il",
    "address": {
      "city": "Ramat Gan",
      "street": "Bialik",
      "houseNum": 12,
      "floor": 0
    },
    "products": ["5ac89d68-585d-4b2c-9761-da50151156ad", "cc464551-c0b2-413a-9899-7801a08ad54c"]
  }


## Base URL
`/api/restaurants/:rId/products`

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Retrieve all products for a specific restaurant. |
| POST | `/` | Create a new product. |
| GET | `/:pId` | Retrieve a specific product by ID. |
| PATCH | `/:pId` | Partially update an existing product. |
| DELETE | `/:pId` | Delete a product by ID. |

---

## Endpoint Details

### 1. Retrieve All Products
* **Method:** `GET`
* **Endpoint:** `/`
* **Responses:**
  * **200 OK**
    ```json
    [
        {
            "id": "5ac89d68-585d-4b2c-9761-da50151156ad",
            "restaurantId": "e3b0c442-989b-464c-8650-123456789abc",
            "name": "Pepperoni Pizza",
            "description": "Crispy pepperoni with a cheese blend",
            "category": "Main Course",
            "price": 55.00,
            "image": "[https://example.com/images/pepperoni.jpg](https://example.com/images/pepperoni.jpg)",
            "extras": ["ext_9999"]
        }
    ]
    ```

### 2. Create Product
* **Method:** `POST`
* **Endpoint:** `/`
* **Request Body:** `application/json`
  * **Required:** `name`, `category`, `price`
  * **Optional:** `description`, `image`, `extras`
  ```json
  {
      "name": "Pepperoni Pizza",
      "description": "Crispy pepperoni with a cheese blend",
      "category": "Main Course",
      "price": 55.00,
      "image": "[https://example.com/images/pepperoni.jpg](https://example.com/images/pepperoni.jpg)",
      "extras": ["ext_9999"]
  }

# Orders API Documentation

## Base URL
`/api/orders`

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Retrieve all orders. |
| POST | `/` | Create a new order. |
| GET | `/:id` | Retrieve a specific order by ID. |
| PATCH | `/:id` | Partially update an existing order. |
| DELETE | `/:id` | Delete an order by ID. |

---

## Endpoint Details

### 1. Retrieve All Orders
* **Method:** `GET`
* **Endpoint:** `/`
* **Responses:**
  * **200 OK**
    ```json
    [
        {
            "id": "e09eaac4-35c4-4a3e-98b1-0f52a783c722",
            "date": {
                "day": 29,
                "month": 5,
                "year": 2026,
                "hour": 17,
                "minute": 41,
                "second": 16
            },
            "customerId": "user-uuid-1234",
            "restaurantId": "rest-uuid-5678",
            "orderedItems": [
                "prod-uuid-1",
                "prod-uuid-2"
            ]
        }
    ]
    ```

---

### 2. Create Order
* **Method:** `POST`
* **Endpoint:** `/`
* **Request Body:** `application/json`
  * **Required:** `customerId`, `restaurantId`, `orderedItems`
  ```json
  {
      "customerId": "user-uuid-1234",
      "restaurantId": "rest-uuid-5678",
      "orderedItems": [
          "prod-uuid-1",
          "prod-uuid-2"
      ]
  }
  ```
* **Responses:**
  * **201 Created**
    ```json
    {
        "id": "e09eaac4-35c4-4a3e-98b1-0f52a783c722",
        "date": {
            "day": 29,
            "month": 5,
            "year": 2026,
            "hour": 17,
            "minute": 41,
            "second": 16
        },
        "customerId": "user-uuid-1234",
        "restaurantId": "rest-uuid-5678",
        "orderedItems": [
            "prod-uuid-1",
            "prod-uuid-2"
        ]
    }
    ```
  * **400 Bad Request** – Missing or invalid fields.

---

### 3. Retrieve Order by ID
* **Method:** `GET`
* **Endpoint:** `/:id`
* **URL Parameters:**
  * `id` – The UUID of the order.
* **Responses:**
  * **200 OK**
    ```json
    {
        "id": "e09eaac4-35c4-4a3e-98b1-0f52a783c722",
        "date": {
            "day": 29,
            "month": 5,
            "year": 2026,
            "hour": 17,
            "minute": 41,
            "second": 16
        },
        "customerId": "user-uuid-1234",
        "restaurantId": "rest-uuid-5678",
        "orderedItems": [
            "prod-uuid-1",
            "prod-uuid-2"
        ]
    }
    ```
  * **404 Not Found**
    ```json
    { "error": "Order not found" }
    ```

---

### 4. Update Order
* **Method:** `PATCH`
* **Endpoint:** `/:id`
* **URL Parameters:**
  * `id` – The UUID of the order.
* **Request Body:** `application/json`
  * **Optional:** `customerId`, `restaurantId`, `orderedItems`
  * At least one field must be provided.
  ```json
  {
      "orderedItems": [
          "prod-uuid-1",
          "prod-uuid-3"
      ]
  }
  ```
* **Responses:**
  * **204 No Content** – Update successful, no body returned.
  * **400 Bad Request** – No fields provided, or invalid fields/types.
  * **404 Not Found**
    ```json
    { "error": "Order not found" }
    ```

---

### 5. Delete Order
* **Method:** `DELETE`
* **Endpoint:** `/:id`
* **URL Parameters:**
  * `id` – The UUID of the order.
* **Responses:**
  * **204 No Content** – Deletion successful.
  * **404 Not Found**
    ```json
    { "error": "Order not found" }
    ```

---

## Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `customerId` | `string` | Yes | UUID of the customer placing the order. |
| `restaurantId` | `string` | Yes | UUID of the restaurant being ordered from. |
| `orderedItems` | `string[]` | Yes | Non-empty array of product UUIDs. |
| `id` | `string` | Auto | UUID generated by the server. |
| `date` | `object` | Auto | Timestamp object generated by the server at creation time. |

# Search API Documentation

## Base URL
`/api/search`

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/:query` | Search restaurants and products by name or description. |

---

## Endpoint Details

### 1. Search
* **Method:** `GET`
* **Endpoint:** `/:query`
* **URL Parameters:**
  * `query` – The search term to match against. Case-insensitive. Maximum 50 characters. Characters `<` and `>` are not allowed.
* **Responses:**
  * **200 OK** – Returns all matching restaurants and products.
    ```json
    {
        "restaurants": [
            {
                "id": "5aeb13c5-b3c2-44ea-b7fd-04d06708dac8",
                "name": "Pizza Planet",
                "description": "Out of this world pizza",
                "category": "Italian",
                "authorizedUsers": ["user99"],
                "phone": "03-9876543",
                "email": "hello@pizzaplanet.co.il",
                "address": {
                    "city": "Ramat Gan",
                    "street": "Bialik",
                    "houseNum": 12,
                    "floor": 0
                },
                "products": ["5ac89d68-585d-4b2c-9761-da50151156ad"]
            }
        ],
        "products": [
            {
                "id": "5ac89d68-585d-4b2c-9761-da50151156ad",
                "restaurantId": "5aeb13c5-b3c2-44ea-b7fd-04d06708dac8",
                "name": "Pepperoni Pizza",
                "description": "Crispy pepperoni with a cheese blend",
                "category": "Main Course",
                "price": 55.00,
                "image": "https://example.com/images/pepperoni.jpg",
                "extras": ["ext_9999"]
            }
        ]
    }
    ```
  * **400 Bad Request** – Query is empty, too long, or contains invalid characters.
    ```json
    { "error": "Search query cannot be empty." }
    ```
    ```json
    { "error": "Search query is too long (maximum 50 characters)." }
    ```
    ```json
    { "error": "Search query contains invalid characters." }
    ```
  * **500 Internal Server Error**
    ```json
    { "error": "Internal server error during search" }
    ```

---

## Search Behavior

* The search runs against both **restaurants** and **products** simultaneously.
* A match is found if the query is a substring of the `name` **or** `description` field.
* The search is **case-insensitive** (`"pizza"` matches `"Pizza Planet"`).
* If there are no matches, the corresponding array is returned empty.
  ```json
  {
      "restaurants": [],
      "products": []
  }
  ```

---

## Query Validation Rules

| Rule | Details |
|------|---------|
| Cannot be empty | Whitespace-only queries are rejected. |
| Maximum length | 50 characters. |
| Forbidden characters | `<` and `>` are blocked to prevent XSS injection. |


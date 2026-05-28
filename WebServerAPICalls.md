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
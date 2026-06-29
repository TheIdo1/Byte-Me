# Byte-Me

![byte me wide picture](/resources/byteme_wide_picture.png)

***Scroll down for initializng instructions***

Given a user and a product they are viewing, the recommendation engine uses a collaborative filtering algorithm based on shared watch history with similar users to recommend up to 10 other products they might like.

> **Note:** After cloning this repository, you should rename `src/webServer/config/.env.test` to `src/webServer/config/.env`.

**For Tragil2's questions scroll to the bottom of the page.

## System Architecture
 
The project is divided into four main components:
 
1. **Frontend (React 18):** A single-page application with JWT-based auth, restaurant browsing sorted by proximity, global search, a cart sidebar, an orders history page, and a restaurant-owner form to list new restaurants.
2. **Web Server (Node.js/Express):** Handles all client HTTP requests using an MVC pattern. Manages Restaurants, Products, Orders, Users, Authentication, and Search. Data is stored in-memory.
3. **Recommendation Engine (C++17):** A dedicated TCP server that manages user watch histories and calculates collaborative-filtering scores to provide real-time product recommendations.
4. **Internal CLI Client (Python):** A command-line interface for testing and interacting directly with the C++ recommendation engine over a TCP socket.
---
 
## Features
 
### RESTful API (Node.js/Express)
 
| Resource | Endpoint | Description |
|---|---|---|
| Restaurants | `/api/restaurants` | Full CRUD for restaurants |
| Products | `/api/restaurants/:rId/products` | Full CRUD for products within a restaurant |
| Orders | `/api/orders` | Place, update, and delete orders |
| Users | `/api/users` | Register and retrieve users |
| Tokens | `/api/tokens` | Login and generate auth tokens |
| Search | `/api/search/:query` | Case-insensitive search across restaurants and products |
 
> See `WebServerAPICalls.md` for full request/response documentation.

### React Frontend

| Page / Component | Route | Description |
|---|---|---|
| Home | `/` | Browses all restaurants sorted by sponsored status then distance (Haversine). Displays per-category carousels and search results. |
| Restaurant | `/restaurants/:id` | Shows the menu with a cart sidebar. Clicking a product opens a modal and updates the C++ recommendation engine. |
| Add Restaurant | `/restaurants/new` | Form for restaurant owners to list a new restaurant (guarded by `isRestaurantOwner` flag). |
| Orders | `/orders` | Lists the logged-in user's order history with restaurant name, date, and item breakdown. |
| Login | `/login` | Authenticates and stores a JWT in `localStorage`. |
| Register | `/register` | Creates a new user account. Accepts an `isRestaurantOwner` flag to unlock the owner flow. |

### Web API Session Example (Node.js & Express)

This section demonstrates a complete end-to-end user flow: authenticating, creating a restaurant and a product, searching the catalog, and triggering the C++ recommendation engine via TCP sockets.

**1. Register a New User**
Create a user account. The returned `id` is used as the auth token for all subsequent protected requests.
 
```http
POST /api/users
Content-Type: application/json
 
{
  "username": "user99",
  "password": "mySecretPassword",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "address": {
    "city": "Tel Aviv",
    "street": "Rothschild",
    "houseNum": 5,
    "floor": 2
  }
}
```
 
**Response (201 Created):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "username": "user99",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "address": {
    "city": "Tel Aviv",
    "street": "Rothschild",
    "houseNum": 5,
    "floor": 2
  }
}
```
 
> The `id` in the response is your auth token. Copy it — you'll pass it as the `Authorization` header in all protected requests below.

**2. Login & Get Token**
Authenticate a user to receive an access token (the User ID) which will be used for protected routes.

```http
POST /api/tokens
Content-Type: application/json

{
  "username": "user99",
  "password": "mySecretPassword"
}
```

**Response (200 OK):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000"
}
```

**3. Create a Restaurant**
Create a new restaurant in the system. This is a protected route and requires the token in the Authorization header.

```http
POST /api/restaurants
Authorization: 123e4567-e89b-12d3-a456-426614174000
Content-Type: application/json

{
  "name": "Pizza Planet",
  "description": "Out of this world pizza and Italian food",
  "category": "Italian",
  "authorizedUsers": ["user99"],
  "phone": "03-9876543",
  "email": "hello@pizzaplanet.co.il",
  "address": {
    "city": "Ramat Gan",
    "street": "Bialik",
    "houseNum": 12,
    "floor": 0
  }
}
```

**Response (201 Created):**
```json
{
  "id": "4715ec83-c687-4aa6-b97b-8480ea8449ba",
  "name": "Pizza Planet",
  "description": "Out of this world pizza and Italian food",
  "category": "Italian",
  "authorizedUsers": ["user99"]
}
```

**4. Add a Product to the Restaurant**
Add a new menu item to the created restaurant.

```http
POST /api/restaurants/4715ec83-c687-4aa6-b97b-8480ea8449ba/products
Authorization: 123e4567-e89b-12d3-a456-426614174000
Content-Type: application/json

{
  "name": "Pepperoni Pizza",
  "description": "Crispy pepperoni with a special cheese blend",
  "category": "Main Course",
  "price": 55,
  "image": "https://example.com/images/pepperoni.jpg",
  "extras": ["Extra Cheese", "Olives"]
}
```

**Response (201 Created):**
```json
{
  "id": "34074f8b-02ee-442d-9c9a-5ffd497d5324",
  "restaurantId": "4715ec83-c687-4aa6-b97b-8480ea8449ba",
  "name": "Pepperoni Pizza",
  "price": 55
}
```

**5. Search for Products or Restaurants**
Perform a global search across all restaurants and products (Public route).

```http
GET /api/search/pepperoni
```

**Response (200 OK):**
```json
{
  "restaurants": [],
  "products": [
    {
      "id": "34074f8b-02ee-442d-9c9a-5ffd497d5324",
      "name": "Pepperoni Pizza",
      "price": 55
    }
  ]
}
```

**6. View Product (Updates C++ Recommendation Engine)**
When an authenticated user views a product, the Node.js server seamlessly sends a TCP socket command (`POST <userCppId> <productCppId>`) to the C++ server in the background to update the recommendation engine.

```http
GET /api/restaurants/4715ec83-c687-4aa6-b97b-8480ea8449ba/products/34074f8b-02ee-442d-9c9a-5ffd497d5324
Authorization: 123e4567-e89b-12d3-a456-426614174000
```

**Response (200 OK):**
```json
{
  "id": "34074f8b-02ee-442d-9c9a-5ffd497d5324",
  "name": "Pepperoni Pizza",
  "description": "Crispy pepperoni with a special cheese blend",
  "price": 55
}
```
 
### C++ Recommendation Engine
 
| Command | Usage | Description |
|---|---|---|
| `POST` | `post [userId] [productId1] ...` | Create a new user with an initial watch list. Fails if the user already exists. Creates products automatically if they don't exist. |
| `PATCH` | `patch [userId] [productId1] ...` | Add products to an existing user's watch list. Creates products automatically if they don't exist. |
| `DELETE` | `delete [userId] [productId1] ...` | Remove one or more products from a user's watch list. |
| `GET` | `get [userId] [productId]` | Return up to 10 recommended product IDs, ranked by score then by product ID ascending. |
| `HELP` | `help` | Print all available commands and their usage. |

### Session Example Recommendation Engine 
```bash
post 1 2 3 4 5
201 Created
post 2 3 4 5 6 7 8
201 Created
get 1 3
200 Ok

6 7 8
help
DELETE,arguments: [userid] [productid1] [productid2] ...
GET,arguments: [userid] [productid]
PATCH,arguments: [userId] [productId1] [productId2] ...
POST,arguments: [userId] [productId1] [productId2] ...
help
```
![run example](/resources/run_example.png)

## How the recommendation works

1. For the target user, compute a similarity score with every other user (count of shared products watched).
2. Among users who also watched the target product, weight each of their other watched products by the similarity score.
3. Exclude products the target user has already watched, and the target product itself.
4. Return the top 10 results sorted by score descending, then product ID ascending.

## Project Structure
 
```
Byte-Me/
├── CMakeLists.txt
├── docker-compose.yml
├── Dockerfile
├── README.md
├── WebServerAPICalls.md
├── data/
│   ├── products.txt
│   └── users.txt
├── resources/
│   └── (images & logos)
├── src/
│   ├── client/                    # Python CLI Client
│   │   ├── Dockerfile
│   │   └── main.py
│   ├── frontend/                  # React 18 SPA
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── src/
│   │       ├── App.js             # Auth state root
│   │       ├── router.js          # Route definitions
│   │       ├── api/               # Axios wrappers per resource
│   │       ├── components/        # Reusable UI components
│   │       │   ├── Header.js
│   │       │   ├── CategoryBar.js
│   │       │   ├── EmptyState.js
│   │       │   ├── product/       # ProductCard, ProductModal, ProductsCarousel
│   │       │   ├── restaurant/    # RestaurantCard, RestaurantsCarousel
│   │       │   └── restaurantPage/# CartSidebar, CategoryNav, RestaurantHeader
│   │       └── pages/             # HomePage, LoginPage, RegisterPage,
│   │                              # RestaurantPage, AddRestaurantPage, OrdersPage
│   ├── server/                    # C++17 Recommendation Engine (TCP Server)
│   │   ├── include/               # Header files
│   │   ├── App.cpp
│   │   ├── main.cpp
│   │   └── (other C++ source files)
│   └── webServer/                 # Node.js/Express REST API (MVC)
│       ├── config/                # Environment variables (.env)
│       ├── controllers/           # Request handling logic
│       ├── middleware/            # Validators & authentication
│       ├── models/                # In-memory data management
│       ├── routes/                # API endpoint definitions
│       ├── services/              # C++ TCP socket service
│       ├── app.js                 # Express entry point
│       ├── package.json
│       └── Dockerfile
└── tests/                         # C++ Unit Tests (Google Test)
```
 
---
## Building & Running
 
All four components are containerized and managed via Docker Compose.
 
**Build Docker:**
```bash
docker compose build --no-cache
```

**Start all app:**
```bash
docker compose up --force-recreate
```
> This will also populate the app with restaurants through http calls using bruno, this action can take a minute.
> Those are dumb restaurants to mainly show the location based-feature. 
> You can create more complex restaurants (including products and extras to them) in the restaurant mannagment page.
> The restaurant's sub-category 'extras' is hidden sub-category that it's item won't show on the restaurant's page.

> Credential for the user that created all restaurants are ido:idoido


> The frontend is served on **http://localhost:3000** and proxies API calls to the web server automatically.

**Start without Seeder (default populating of app)**:
```bash
docker compose up --scale seeder=0
```

 
**Shut everything down:**
```bash
docker-compose down
```
 
**Shut everything down & remove data:**
```bash
docker-compose down -v
```
 
![byte me logo](/resources/byteme_logo.png)


*Running Example*
![build](/resources/running_example/build.jpg)
![finished_build](/resources/running_example/finished_build.jpg)
![run](/resources/running_example/run.jpg)
![run_seeder](/resources/running_example/run_seeder.jpg)
**react ui**
![homepage](/resources/running_example/homepage.jpg)
![restaurant_page](/resources/running_example/restaurant_page.jpg)
![product_page](/resources/running_example/product_page.jpg)
![orders_page](/resources/running_example/orders_page.jpg)
![manage_restaurants](/resources/running_example/manage_restaurants.jpg)
![manage_restaurant1](/resources/running_example/manage_restaurant_1.jpg)
![manage_restaurant2](/resources/running_example/manage_restaurant_2.jpg)

**react native ui**
![native_1](/resources/running_example/expo_%20(1).jpg)
![native_2](/resources/running_example/expo_%20(2).jpg)
![native_3](/resources/running_example/expo_%20(3).jpg)
![native_4](/resources/running_example/expo_%20(4).jpg)
![native_5](/resources/running_example/expo_%20(5).jpg)
![native_6](/resources/running_example/expo_%20(6).jpg)
![native_7](/resources/running_example/expo_%20(7).jpg)
![native_8](/resources/running_example/expo_%20(8).jpg)
![native_9](/resources/running_example/expo_%20(9).jpg)
![native_10](/resources/running_example/expo_%20(10).jpg)
![native_11](/resources/running_example/expo_%20(11).jpg)
![native_12](/resources/running_example/expo_%20(12).jpg)
![native_13](/resources/running_example/expo_%20(13).jpg)
![native_14](/resources/running_example/expo_%20(14).jpg)

**shutdown app**
![shutdown](/resources/running_example/shutdown.jpg)
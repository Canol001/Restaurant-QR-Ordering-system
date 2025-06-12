# 🍽️ QR Table Order – Smart Restaurant Ordering System

Welcome to **QR Table Order**, a React-based web app that allows customers to scan a QR code placed on their table, view the menu, place customized orders, and send them directly to the kitchen — all without a waiter!

This modern, contactless solution is perfect for restaurants aiming to streamline service and elevate the dining experience. Fast. Easy. Efficient.

---

## 🚀 Features

- 🔍 **QR Code Scanning** – Detect table ID via webcam with `@zxing/library`.
- 🧾 **Dynamic Menu** – Fetch real-time menu items from backend API.
- 🛒 **Smart Cart** – Add, customize, and review items with special requests.
- 📦 **Paginated Menu View** – Optimized layout for large menus.
- 📤 **Order Submission** – Send full orders tied to the specific table.
- 🎯 **Session Management** – Table ID saved locally to persist session.
- ✅ **Responsive UI** – Mobile-first layout powered by Tailwind CSS.

---

## 📁 Project Structure

```
restaurant-qr-ordering/
├── backend/                    # Node.js/Express backend
│   ├── config/                 # Configuration files
│   │   └── db.js               # MongoDB connection
│   ├── models/                 # Mongoose schemas
│   │   ├── Menu.js             # Menu item schema
│   │   ├── Order.js            # Order schema
│   │   └── Table.js            # Table/QR code schema
│   ├── routes/                 # API routes
│   │   ├── menu.js             # Menu endpoints
│   │   ├── orders.js           # Order endpoints
│   │   └── tables.js           # Table/QR code endpoints
│   ├── .env                    # Environment variables
│   ├── index.js                # Main server file
│   └── package.json            # Backend dependencies
├── frontend/                   # React frontend
│   ├── public/                 # Static assets
│   │   ├── index.html          # HTML template
│   │   └── favicon.ico         # Favicon
│   ├── src/                    # React source code
│   │   ├── components/         # Reusable components
│   │   │   ├── MenuItem.js     # Menu item display
│   │   │   ├── Cart.js         # Shopping cart
│   │   │   └── OrderForm.js    # Order submission form
│   │   ├── pages/              # Page components
│   │   │   ├── Menu.jsx        # Customer menu page
│   │   │   ├── Admin.jsx       # Admin dashboard
│   │   │   └── OrderList.jsx   # Order management page
│   │   ├── App.js              # Main app component
│   │   ├── index.js            # React entry point
│   │   └── index.css           # Global styles
│   ├── .env                    # Frontend environment variables
│   └── package.json            # Frontend dependencies
└── README.md                   # Project documentation          # React Router setup
```

---

## 📦 Installation & Setup

1. **Clone the repo**

```bash
git clone https://github.com/your-username/qr-table-order.git
cd qr-table-order
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the development server**

```bash
npm run dev
```

4. **Access the app**

Open in your browser:

```
http://localhost:5173
```

Try manually with a table query:

```
http://localhost:5173/welcome?table=5
```

---

## 📲 QR Code Format

The QR code should encode a URL like:

```
https://yourdomain.com/welcome?table=5
```

You can generate QR codes in bulk based on table numbers and print them to stick on tables.

---

## 📡 Backend API Routes (Example)

| Method | Endpoint      | Description           |
|--------|---------------|-----------------------|
| GET    | /api/menu     | Fetch all menu items  |
| POST   | /api/orders   | Submit customer order |

### 📝 Order POST payload:

```json
{
  "tableId": "5",
  "sessionId": "xyz-123",
  "items": [
    {
      "_id": "menuitem123",
      "name": "Pizza",
      "quantity": 2,
      "requirements": "Extra cheese"
    }
  ]
}
```

---

## ✅ To-Do / Improvements

- ✅ Add order status tracking for kitchen/admin  
- ✅ Add Stripe/M-Pesa payment gateway  
- ✅ Add waiter panel for manual orders  
- ✅ Add socket notifications for new orders  
- ✅ Add printable receipts  

---

## 🤖 Developer Utilities

- `getSessionId()` – Generate or get session UUID per user  
- `setTableId(id)` / `getTableId()` – Store/retrieve table ID from localStorage  
- QR scanning auto-handles invalid links or misreads  

---

## 🧠 Tips

- Use secure HTTPS if deploying camera features on mobile.  
- Use a stable tripod/table stand for the QR code so it's easy to scan.  
- Keep camera permissions clean by prompting only once on first visit.  

---

## 🧑‍💻 Author

**Venom** – Student Developer at Maseno University  
📧 Email | 🌐 Portfolio

---

## 📜 License

**MIT License** – Free to use and modify. Please credit the original developer if you use this in production 🙌

---

## 📷 Demo Screenshots

_Add screenshots here of:_

- QR scan screen  
- Menu view  
- Cart modal  
- Order confirmation  

---

## 💬 Final Words

Building smart restaurants doesn’t have to cost a fortune. This system lets you run a modern dining experience using just a camera, a screen, and some JavaScript wizardry.

Hungry to contribute? Fork it, improve it, and let’s change the restaurant game — one scan at a time 🔥

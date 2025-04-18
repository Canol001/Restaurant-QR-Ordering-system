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
└── README.md                   # Project documentation
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Menu = require('./models/Menu');
const Order = require('./models/Order');
const Table = require('./models/Table');
const QRCode = require('qrcode');

// Load environment variables
dotenv.config();

// Sample data
const menuItems = [
  {
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato, mozzarella, and basil',
    price: 12.99,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46d9e',
  },
  {
    name: 'Caesar Salad',
    description: 'Fresh romaine, croutons, parmesan, and Caesar dressing',
    price: 8.99,
    category: 'Salad',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9',
  },
  {
    name: 'Spaghetti Carbonara',
    description: 'Pasta with creamy egg sauce, pancetta, and parmesan',
    price: 14.99,
    category: 'Pasta',
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804',
  },
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center',
    price: 6.99,
    category: 'Dessert',
    image: 'https://images.unsplash.com/photo-1611348586807-60946b6c3e27',
  },
];

const orders = [
  {
    tableId: '1',
    items: [
      { name: 'Margherita Pizza', price: 12.99, quantity: 2 },
      { name: 'Caesar Salad', price: 8.99, quantity: 1 },
    ],
    status: 'Pending',
    total: 12.99 * 2 + 8.99, // 34.97
  },
  {
    tableId: '2',
    items: [
      { name: 'Spaghetti Carbonara', price: 14.99, quantity: 1 },
      { name: 'Chocolate Lava Cake', price: 6.99, quantity: 1 },
    ],
    status: 'Preparing',
    total: 14.99 + 6.99, // 21.98
  },
];

const tables = [
  { tableId: '1' },
  { tableId: '2' },
  { tableId: '3' },
];

// Function to generate QR code URLs
const generateQRCodeUrls = async (tables) => {
  const updatedTables = [];
  for (const table of tables) {
    const url = `http://localhost:5173/menu?table=${table.tableId}`;
    const qrCodeUrl = await QRCode.toDataURL(url);
    updatedTables.push({ tableId: table.tableId, qrCodeUrl });
  }
  return updatedTables;
};

// Seed database
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    // Clear existing data (optional)
    await Menu.deleteMany({});
    await Order.deleteMany({});
    await Table.deleteMany({});
    console.log('Cleared existing data');

    // Insert menu items
    const insertedMenuItems = await Menu.insertMany(menuItems);
    console.log(`${insertedMenuItems.length} menu items added:`);
    insertedMenuItems.forEach((item) => console.log(`- ${item.name}`));

    // Insert orders
    const insertedOrders = await Order.insertMany(orders);
    console.log(`${insertedOrders.length} orders added:`);
    insertedOrders.forEach((order) => console.log(`- Table ${order.tableId}: ${order.status}`));

    // Generate and insert tables with QR codes
    const tablesWithQR = await generateQRCodeUrls(tables);
    const insertedTables = await Table.insertMany(tablesWithQR);
    console.log(`${insertedTables.length} tables added:`);
    insertedTables.forEach((table) => console.log(`- Table ${table.tableId}`));

    // Close connection
    mongoose.connection.close();
    console.log('Database seeding completed');
  } catch (err) {
    console.error('Error:', err.message);
    mongoose.connection.close();
  }
};

// Run the seeding function
seedDatabase();
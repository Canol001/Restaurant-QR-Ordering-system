const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Menu = require('./models/Menu');
const Order = require('./models/Order');
const Table = require('./models/Table');
const QRCode = require('qrcode');

// Load environment variables
dotenv.config();

// 30 Classic Kenyan Menu Items
const menuItems = [
  { name: "Ugali Sukuma", description: "Maize meal with collard greens", price: 100, category: "Main", image: "https://i.ytimg.com/vi/7seIPgxQOY0/maxresdefault.jpg" },
  { name: "Nyama Choma", description: "Grilled goat meat with kachumbari", price: 350, category: "Grill", image: "https://th.bing.com/th/id/OIP.JMaoLZ1MfqM2h_8dtU3n7AHaFS?rs=1&pid=ImgDetMain" },
  { name: "Chapati Beans", description: "Layered chapati with bean stew", price: 150, category: "Main", image: "https://th.bing.com/th/id/OIP.Ilaamu65_oJGL__0U6pTNwHaEK?rs=1&pid=ImgDetMain" },
  { name: "Matoke", description: "Stewed plantains with beef", price: 180, category: "Stew", image: "https://th.bing.com/th/id/OIP.rt5D-UihuIuVr6n-LG5iYAHaF4?rs=1&pid=ImgDetMain" },
  { name: "Githeri", description: "Mixed maize and beans", price: 120, category: "Traditional", image: "https://th.bing.com/th/id/OIP.ANs9K0MHi6nK3F4lUy6W7AHaD_?rs=1&pid=ImgDetMain" },
  { name: "Pilau", description: "Spiced rice with meat", price: 200, category: "Rice", image: "https://th.bing.com/th/id/OIP.ffpQXWSwHCzJsZ1qkS2Z8wHaE8?rs=1&pid=ImgDetMain" },
  { name: "Mukimo", description: "Mashed potatoes with greens and maize", price: 160, category: "Main", image: "https://upload.wikimedia.org/wikipedia/commons/5/53/Mukimo_with_meat_and_kachumbari.jpg" },
  { name: "Samosa", description: "Minced beef stuffed pastries", price: 60, category: "Snacks", image: "https://upload.wikimedia.org/wikipedia/commons/7/76/Samosas_with_sauce.jpg" },
  { name: "Mandazi", description: "Fried sweet dough", price: 50, category: "Snacks", image: "https://upload.wikimedia.org/wikipedia/commons/2/25/Mandazi_with_tea.jpg" },
  { name: "Tilapia Fry", description: "Fried tilapia with ugali", price: 400, category: "Fish", image: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Kenyan_fried_tilapia.jpg" },
  { name: "Kachumbari", description: "Tomato onion salad", price: 40, category: "Side", image: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Kachumbari_Tanzania.jpg" },
  { name: "Mutura", description: "African blood sausage", price: 100, category: "Street", image: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Mutura.jpg" },
  { name: "Ndengu Stew", description: "Green grams with spices", price: 130, category: "Stew", image: "https://upload.wikimedia.org/wikipedia/commons/3/30/Ndengu.jpg" },
  { name: "Matumbo", description: "Tripe stew", price: 150, category: "Stew", image: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Matumbo_Stew.jpg" },
  { name: "Bhajia", description: "Fried potatoes with gram flour", price: 90, category: "Snacks", image: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Bhajias_Kenya.jpg" },
  { name: "Kenyan Chai", description: "Milky spiced tea", price: 30, category: "Drink", image: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Kenyan_Chai.jpg" },
  { name: "Arrowroot & Tea", description: "Boiled nduma with chai", price: 80, category: "Breakfast", image: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Arrowroots_Kenya.jpg" },
  { name: "Sweet Potato", description: "Boiled sweet potatoes", price: 70, category: "Breakfast", image: "https://upload.wikimedia.org/wikipedia/commons/9/98/Sweet_potato_breakfast.jpg" },
  { name: "Kuku Fry", description: "Pan-fried chicken", price: 300, category: "Main", image: "https://upload.wikimedia.org/wikipedia/commons/d/df/Kuku_fry.jpg" },
  { name: "Beef Stew", description: "Kenyan-style beef stew", price: 250, category: "Stew", image: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Beef_Stew_Kenya.jpg" },
  { name: "Rice Beans", description: "White rice served with beans", price: 110, category: "Lunch", image: "https://upload.wikimedia.org/wikipedia/commons/8/81/Rice_and_beans.jpg" },
  { name: "Wali wa Nazi", description: "Coconut rice", price: 140, category: "Rice", image: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Wali_wa_nazi_Kenya.jpg" },
  { name: "Viazi Karai", description: "Fried potatoes in batter", price: 100, category: "Street", image: "https://upload.wikimedia.org/wikipedia/commons/8/84/Viazi_Karai.jpg" },
  { name: "Sukumawiki", description: "Stir-fried collard greens", price: 50, category: "Side", image: "https://upload.wikimedia.org/wikipedia/commons/9/97/Sukuma_wiki.jpg" },
  { name: "Omena Fry", description: "Fried silverfish", price: 150, category: "Fish", image: "https://upload.wikimedia.org/wikipedia/commons/d/da/Omena_Fish.jpg" },
  { name: "Matunda Mix", description: "Mixed fruit platter", price: 120, category: "Dessert", image: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Fruit_Salad_Kenya.jpg" },
  { name: "Chips Mayai", description: "Omelette with fries", price: 140, category: "Street", image: "https://upload.wikimedia.org/wikipedia/commons/4/49/Chips_Mayai_Tanzania.jpg" },
  { name: "Egg Curry", description: "Spicy boiled egg curry", price: 170, category: "Curry", image: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Kenyan_Egg_Curry.jpg" },
  { name: "Managu", description: "African nightshade leaves", price: 90, category: "Vegetarian", image: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Managu_Kenya.jpg" },
  { name: "Muthokoi", description: "Dehulled maize and beans", price: 130, category: "Traditional", image: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Muthokoi_Kenya.jpg" }
];

// (Keep orders and tables as is, or expand if needed)

const tables = [ { tableId: '1' }, { tableId: '2' }, { tableId: '3' }, { tableId: '4' }, { tableId: '5' } ];

const generateQRCodeUrls = async (tables) => {
  const updatedTables = [];
  for (const table of tables) {
    const url = `http://localhost:5173/menu?table=${table.tableId}`;
    const qrCodeUrl = await QRCode.toDataURL(url);
    updatedTables.push({ tableId: table.tableId, qrCodeUrl });
  }
  return updatedTables;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    await Menu.deleteMany({});
    await Order.deleteMany({});
    await Table.deleteMany({});
    console.log('Cleared existing data');

    const insertedMenuItems = await Menu.insertMany(menuItems);
    console.log(`${insertedMenuItems.length} menu items added.`);

    const tablesWithQR = await generateQRCodeUrls(tables);
    const insertedTables = await Table.insertMany(tablesWithQR);
    console.log(`${insertedTables.length} tables added.`);

    mongoose.connection.close();
    console.log('Database seeding complete');
  } catch (err) {
    console.error('Error seeding:', err);
    mongoose.connection.close();
  }
};

seedDatabase();

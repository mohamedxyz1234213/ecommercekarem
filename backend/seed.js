const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const perfumeProducts = [
  {
    name: 'Dior Sauvage Eau de Parfum',
    description:
      'A bold and magnetic fragrance with notes of vanilla, amber, and Calabrian bergamot. Sauvage is the signature scent for the modern man who embraces adventure.',
    price: 4500,
    salePrice: 3800,
    onSale: true,
    saleTape: '15% OFF',
    category: 'Men',
    brand: 'Dior',
    images: ['/uploads/dior-sauvage.jpg'],
    stock: 50,
    rating: 4.8,
    numReviews: 124,
    featured: true,
  },
  {
    name: 'Chanel No. 5 Eau de Parfum',
    description:
      'The iconic fragrance that redefined luxury. A timeless bouquet of ylang-ylang, rose, jasmine, and sandalwood — the ultimate symbol of feminine elegance.',
    price: 5200,
    category: 'Women',
    brand: 'Chanel',
    images: ['/uploads/chanel-no5.jpg'],
    stock: 35,
    rating: 4.9,
    numReviews: 210,
    featured: true,
  },
  {
    name: 'Tom Ford Oud Wood',
    description:
      'A masterful blend of exotic rosewood, cardamom, Chinese pepper, and oud. This sophisticated scent is warm, smoky, and effortlessly refined.',
    price: 8500,
    salePrice: 7200,
    onSale: true,
    saleTape: '15% OFF',
    category: 'Unisex',
    brand: 'Tom Ford',
    images: ['/uploads/tf-oud-wood.jpg'],
    stock: 20,
    rating: 4.7,
    numReviews: 89,
    featured: true,
  },
  {
    name: 'Versace Eros',
    description:
      'An energetic and vibrant fragrance inspired by Greek mythology. Fresh mint, green apple, and tonka bean create a powerful, seductive aura.',
    price: 3200,
    category: 'Men',
    brand: 'Versace',
    images: ['/uploads/versace-eros.jpg'],
    stock: 60,
    rating: 4.6,
    numReviews: 156,
    featured: false,
  },
  {
    name: 'Chanel Coco Mademoiselle',
    description:
      'A sparkling fresh oriental fragrance. Orange, jasmine, rose, and patchouli combine into a scent that is irresistibly feminine and utterly modern.',
    price: 4800,
    salePrice: 4100,
    onSale: true,
    saleTape: '20% OFF',
    category: 'Women',
    brand: 'Chanel',
    images: ['/uploads/chanel-coco.jpg'],
    stock: 40,
    rating: 4.8,
    numReviews: 178,
    featured: true,
  },
  {
    name: 'Tom Ford Black Orchid',
    description:
      'A luxurious and sensual fragrance that fuses black truffle, ylang-ylang, blackcurrant, and dark orchid into a statement of glamour and daring beauty.',
    price: 7800,
    category: 'Women',
    brand: 'Tom Ford',
    images: ['/uploads/tf-black-orchid.jpg'],
    stock: 25,
    rating: 4.5,
    numReviews: 67,
    featured: false,
  },
  {
    name: 'Dior Miss Dior Blooming Bouquet',
    description:
      'A fresh and tender fragrance capturing the essence of spring. Peony, Damascus rose, and white musk create a delicate, romantic aura.',
    price: 4200,
    category: 'Women',
    brand: 'Dior',
    images: ['/uploads/miss-dior-bloom.jpg'],
    stock: 45,
    rating: 4.6,
    numReviews: 92,
    featured: false,
  },
  {
    name: 'Versace Pour Homme',
    description:
      'A Mediterranean-inspired fragrance for men with neroli, citron, and amber. Fresh, elegant, and perfect for everyday sophistication.',
    price: 2800,
    salePrice: 2200,
    onSale: true,
    saleTape: '21% OFF',
    category: 'Men',
    brand: 'Versace',
    images: ['/uploads/versace-pour-homme.jpg'],
    stock: 70,
    rating: 4.4,
    numReviews: 134,
    featured: false,
  },
  {
    name: 'Tom Ford Tobacco Vanille',
    description:
      'A luxurious blend of tobacco leaf, vanilla, cocoa, dried fruits, and warm spices. An opulent fragrance that exudes warmth and confidence.',
    price: 9200,
    category: 'Unisex',
    brand: 'Tom Ford',
    images: ['/uploads/tf-tobacco-vanille.jpg'],
    stock: 15,
    rating: 4.9,
    numReviews: 72,
    featured: true,
  },
  {
    name: 'Chanel Bleu de Chanel',
    description:
      'A woody aromatic fragrance for men. Citrus, mint, pink pepper, and cedar create a bold yet refined scent that is versatile and timeless.',
    price: 4600,
    category: 'Men',
    brand: 'Chanel',
    images: ['/uploads/bleu-de-chanel.jpg'],
    stock: 55,
    rating: 4.7,
    numReviews: 198,
    featured: true,
  },
  {
    name: 'Dior Jadore Eau de Parfum',
    description:
      'An iconic floral fragrance with ylang-ylang, Damask rose, jasmine sambac, and a sensual woody base. Pure femininity in a bottle.',
    price: 4900,
    salePrice: 4200,
    onSale: true,
    saleTape: '14% OFF',
    category: 'Women',
    brand: 'Dior',
    images: ['/uploads/dior-jadore.jpg'],
    stock: 38,
    rating: 4.8,
    numReviews: 165,
    featured: false,
  },
  {
    name: 'Versace Crystal Noir',
    description:
      'A glamorous and mysterious fragrance blending gardenia, peony, musk, sandalwood, and amber. Perfect for evening occasions and unforgettable moments.',
    price: 3400,
    category: 'Women',
    brand: 'Versace',
    images: ['/uploads/versace-crystal-noir.jpg'],
    stock: 30,
    rating: 4.3,
    numReviews: 58,
    featured: false,
  },
];

const seedDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('MONGODB_URI is not set. Create a .env file with your connection string.');
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('MongoDB Connected for seeding');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    const created = await Product.insertMany(perfumeProducts);
    console.log(`Seeded ${created.length} perfume products`);

    await mongoose.connection.close();
    console.log('Seeding complete. Connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();

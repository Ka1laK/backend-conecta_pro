const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const Service = require('../models/Service');
const User = require('../models/User');
const Location = require('../models/Location');
const PaymentMethod = require('../models/PaymentMethod');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        // Clear existing data
        await Category.deleteMany({});
        await Service.deleteMany({});
        await User.deleteMany({ email: { $regex: /@example.com$/ } }); // Only delete seed users
        await Location.deleteMany({});
        await PaymentMethod.deleteMany({});

        console.log('Data cleared');

        // Create Categories
        const categories = await Category.create([
            {
                name: 'Gasfitería',
                icon_url: 'https://cdn.serviconecta.com/icons/gasfiteria.png'
            },
            {
                name: 'Electricidad',
                icon_url: 'https://cdn.serviconecta.com/icons/electricidad.png'
            },
            {
                name: 'Albañilería',
                icon_url: 'https://cdn.serviconecta.com/icons/albanileria.png'
            },
            {
                name: 'Limpieza',
                icon_url: 'https://cdn.serviconecta.com/icons/limpieza.png'
            }
        ]);

        console.log('Categories created');

        // Create Providers
        const providers = await User.create([
            {
                full_name: 'Devon Lane',
                email: 'devon.lane@example.com',
                password: 'password123',
                phone_number: '+51 900000001',
                account_type: 'CONECTA_PRO',
                status: 'active',
                phone_verified: true,
                profile_completed: true
            },
            {
                full_name: 'Jose Martínez',
                email: 'jose.martinez@example.com',
                password: 'password123',
                phone_number: '+51 900000002',
                account_type: 'CONECTA_PRO',
                status: 'active',
                phone_verified: true,
                profile_completed: true
            },
            {
                full_name: 'Pablo Martínez',
                email: 'pablo.martinez@example.com',
                password: 'password123',
                phone_number: '+51 900000003',
                account_type: 'CONECTA_PRO',
                status: 'active',
                phone_verified: true,
                profile_completed: true
            },
            {
                full_name: 'Marry Jane',
                email: 'marry.jane@example.com',
                password: 'password123',
                phone_number: '+51 900000004',
                account_type: 'CONECTA_PRO',
                status: 'active',
                phone_verified: true,
                profile_completed: true
            }
        ]);

        console.log('Providers created');

        // Create Client
        const client = await User.create({
            full_name: 'Fara Bin Laden',
            email: 'fara.binladen@example.com',
            password: 'password123',
            phone_number: '+51 999999999',
            account_type: 'CLIENTE',
            status: 'active',
            phone_verified: true,
            profile_completed: true
        });

        console.log('Client created');

        // Create Services
        await Service.create([
            {
                title: 'Servicio de electricista',
                category: categories[1]._id, // Electricidad
                provider: providers[0]._id, // Devon Lane
                price: 20.0,
                currency: 'PEN',
                rating: 4.0,
                reviews_count: 25,
                image_url: 'https://cdn.serviconecta.com/services/electricista1.jpg',
                description: 'Servicio completo de electricidad domiciliaria.'
            },
            {
                title: 'Instalación del interruptor de CA',
                category: categories[1]._id,
                provider: providers[0]._id,
                price: 20.0,
                currency: 'PEN',
                rating: 4.0,
                reviews_count: 15,
                image_url: 'https://cdn.serviconecta.com/services/interruptor.jpg',
                description: 'Instalación profesional de interruptores.'
            },
            {
                title: 'Reparación de tablero de interruptores',
                category: categories[1]._id,
                provider: providers[0]._id,
                price: 20.0,
                currency: 'PEN',
                rating: 4.1,
                reviews_count: 12,
                image_url: 'https://cdn.serviconecta.com/services/tablero.jpg',
                description: 'Reparación y mantenimiento de tableros eléctricos.'
            },
            {
                title: 'Detección y reparación de fugas de agua',
                category: categories[0]._id, // Gasfitería
                provider: providers[2]._id, // Pablo Martínez
                price: 20.0,
                currency: 'PEN',
                rating: 4.6,
                reviews_count: 40,
                image_url: 'https://cdn.serviconecta.com/services/fugas.jpg',
                description: 'Expertos en detección de fugas.'
            },
            {
                title: 'Revisión de cables eléctricos',
                category: categories[1]._id,
                provider: providers[3]._id, // Marry Jane
                price: 20.0,
                currency: 'PEN',
                rating: 4.0,
                reviews_count: 18,
                image_url: 'https://cdn.serviconecta.com/services/revision_cables.jpg',
                description: 'Atendemos fallas eléctricas e instalamos tomacorrientes, interruptores y luminarias...'
            }
        ]);

        console.log('Services created');

        // Create Locations for Client
        await Location.create([
            {
                user: client._id,
                label: 'Casa',
                full_address: '21B Av Morelli, San Borja, Lima',
                latitude: -12.1041,
                longitude: -77.0041,
                is_default: true
            },
            {
                user: client._id,
                label: 'Empresa',
                full_address: '1A Javier Prado, San Isidro, Lima',
                latitude: -12.0910,
                longitude: -77.0340,
                is_default: false
            }
        ]);

        console.log('Locations created');

        // Create Payment Methods for Client
        await PaymentMethod.create([
            {
                user: client._id,
                type: 'CASH',
                label: 'Efectivo',
                is_default: true
            },
            {
                user: client._id,
                type: 'CARD_SIMULATED',
                label: 'Visa terminada en 2259',
                last4: '2259',
                is_default: false
            }
        ]);

        console.log('Payment Methods created');

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedData();

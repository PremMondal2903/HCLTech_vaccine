const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('./middleware/rateLimit');
const AppError = require('./utils/AppError');
const errorHandler = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const vaccineRoutes = require('./routes/vaccineRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

const allowedOrigins = [
  'http://localhost:4173',
  'http://localhost:3000',
  'https://hcl-tech-vaccine.vercel.app'
];

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(rateLimit.globalLimiter);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hospital Vaccine Search & Slot Booking API',
      version: '1.0.0',
      description: 'Comprehensive API documentation for hospital vaccine search and slot booking platform',
      contact: {
        name: 'Support Team',
        email: 'support@vaccine-booking.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development Server',
      },
      {
        url: 'https://hcltech-vaccine.onrender.com',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            role: { type: 'string', enum: ['patient', 'admin'] },
            dateOfBirth: { type: 'string', format: 'date' },
          },
        },
        Hospital: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            address: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            pincode: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string' },
            location: {
              type: 'object',
              properties: {
                type: { type: 'string' },
                coordinates: { type: 'array', items: { type: 'number' } },
              },
            },
            operatingHours: {
              type: 'object',
              properties: {
                open: { type: 'string' },
                close: { type: 'string' },
              },
            },
            vaccines: { type: 'array', items: { type: 'string' } },
          },
        },
        Vaccine: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            manufacturer: { type: 'string' },
            recommendedDoses: { type: 'integer' },
            minAge: { type: 'integer' },
            maxAge: { type: 'integer' },
            gapBetweenDoses: { type: 'integer' },
            description: { type: 'string' },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            hospital: { type: 'string' },
            vaccine: { type: 'string' },
            slotDate: { type: 'string', format: 'date-time' },
            doseNumber: { type: 'integer' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'completed', 'cancelled'] },
            bookingRef: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/auth', authRoutes);
app.use('/api/vaccines', vaccineRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

module.exports = app;

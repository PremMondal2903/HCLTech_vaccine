/**
 * @swagger
 * tags:
 *   name: Vaccines
 *   description: Vaccine management endpoints
 */
const express = require('express');
const { body } = require('express-validator');
const vaccineController = require('../controllers/vaccineController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/vaccines:
 *   get:
 *     tags: [Vaccines]
 *     summary: Get all vaccines
 *     responses:
 *       200:
 *         description: List of all vaccines
 */
router.get('/', vaccineController.getAllVaccines);

/**
 * @swagger
 * /api/vaccines/{id}:
 *   get:
 *     tags: [Vaccines]
 *     summary: Get vaccine by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Vaccine details
 *       404:
 *         description: Vaccine not found
 */
router.get('/:id', vaccineController.getVaccineById);

/**
 * @swagger
 * /api/vaccines:
 *   post:
 *     tags: [Vaccines]
 *     summary: Create new vaccine (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, manufacturer, recommendedDoses, minAge, maxAge]
 *             properties:
 *               name:
 *                 type: string
 *                 example: COVID-19 Pfizer
 *               manufacturer:
 *                 type: string
 *                 example: Pfizer-BioNTech
 *               description:
 *                 type: string
 *               recommendedDoses:
 *                 type: integer
 *                 example: 2
 *               minAge:
 *                 type: integer
 *                 example: 18
 *               maxAge:
 *                 type: integer
 *                 example: 100
 *               gapBetweenDoses:
 *                 type: integer
 *                 example: 21
 *     responses:
 *       201:
 *         description: Vaccine created
 *       403:
 *         description: Admin access required
 */
router.post(
  '/',
  protect,
  restrictTo('admin'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('manufacturer').notEmpty().withMessage('Manufacturer is required'),
    body('recommendedDoses').isInt({ min: 1 }).withMessage('Recommended doses must be at least 1'),
    body('minAge').isInt({ min: 0 }).withMessage('minAge is required'),
    body('maxAge').isInt({ min: 0 }).withMessage('maxAge is required'),
    body('gapBetweenDoses').isInt({ min: 0 }).withMessage('gapBetweenDoses is required'),
  ],
  vaccineController.createVaccine
);

/**
 * @swagger
 * /api/vaccines/{id}:
 *   put:
 *     tags: [Vaccines]
 *     summary: Update vaccine (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Vaccine updated
 *       403:
 *         description: Admin access required
 */
router.put('/:id', protect, restrictTo('admin'), vaccineController.updateVaccine);

/**
 * @swagger
 * /api/vaccines/{id}:
 *   delete:
 *     tags: [Vaccines]
 *     summary: Delete vaccine (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Vaccine deleted
 *       403:
 *         description: Admin access required
 */
router.delete('/:id', protect, restrictTo('admin'), vaccineController.deleteVaccine);

module.exports = router;

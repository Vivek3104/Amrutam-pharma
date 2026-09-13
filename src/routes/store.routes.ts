import { Router } from 'express';
import { storeController } from '../controllers/store.controller.js';

const router = Router();

// Products
router.get('/products', (req, res) => storeController.getProducts(req, res));
router.get('/products/:id', (req, res) => storeController.getProductById(req, res));
router.post('/products', (req, res) => storeController.createProduct(req, res));
router.put('/products/:id', (req, res) => storeController.updateProduct(req, res));
router.delete('/products/:id', (req, res) => storeController.deleteProduct(req, res));

// Orders
router.post('/orders', (req, res) => storeController.createOrder(req, res));
router.get('/orders/my', (req, res) => storeController.getCustomerOrders(req, res));
router.get('/orders', (req, res) => storeController.getAllOrders(req, res));
router.get('/orders/:id', (req, res) => storeController.getOrderById(req, res));
router.patch('/orders/:id/status', (req, res) => storeController.updateOrderStatus(req, res));

// Callbacks / Doctor Inquiries
router.post('/callbacks', (req, res) => storeController.createCallback(req, res));
router.get('/callbacks', (req, res) => storeController.getAllCallbacks(req, res));
router.patch('/callbacks/:id', (req, res) => storeController.updateCallbackStatus(req, res));

// Admin Stats
router.get('/admin/stats', (req, res) => storeController.getAdminStats(req, res));

export default router;

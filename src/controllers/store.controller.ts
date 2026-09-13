import { Request, Response } from 'express';
import { storeService } from '../services/store.service.js';

export class StoreController {
  // Products
  getProducts(req: Request, res: Response) {
    const { category, search } = req.query;
    const products = storeService.getAllProducts(category as string, search as string);
    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  }

  getProductById(req: Request, res: Response) {
    const { id } = req.params;
    const product = storeService.getProductById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.status(200).json({ success: true, data: product });
  }

  createProduct(req: Request, res: Response) {
    const product = storeService.createProduct(req.body);
    return res.status(201).json({ success: true, data: product, message: 'Product created successfully' });
  }

  updateProduct(req: Request, res: Response) {
    const { id } = req.params;
    const updated = storeService.updateProduct(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.status(200).json({ success: true, data: updated, message: 'Product updated successfully' });
  }

  deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    const deleted = storeService.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.status(200).json({ success: true, message: 'Product deleted successfully' });
  }

  // Orders
  createOrder(req: Request, res: Response) {
    const order = storeService.createOrder(req.body);
    return res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully',
    });
  }

  getAllOrders(req: Request, res: Response) {
    const orders = storeService.getAllOrders();
    return res.status(200).json({ success: true, count: orders.length, data: orders });
  }

  getOrderById(req: Request, res: Response) {
    const { id } = req.params;
    const order = storeService.getOrderByIdOrRef(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    return res.status(200).json({ success: true, data: order });
  }

  getCustomerOrders(req: Request, res: Response) {
    const phone = (req.query.phone as string) || req.user?.phone;
    const ref = req.query.ref as string;

    if (ref) {
      const order = storeService.getOrderByIdOrRef(ref);
      return res.status(200).json({ success: true, count: order ? 1 : 0, data: order ? [order] : [] });
    }

    if (!phone) {
      // Return all non-empty orders if user didn't specify phone, for convenience
      const allOrders = storeService.getAllOrders();
      return res.status(200).json({ success: true, count: allOrders.length, data: allOrders });
    }

    const orders = storeService.getOrdersByPhone(phone);
    return res.status(200).json({ success: true, count: orders.length, data: orders });
  }

  updateOrderStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;
    const updated = storeService.updateOrderStatus(id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    return res.status(200).json({ success: true, data: updated, message: 'Order status updated' });
  }

  // Callbacks
  createCallback(req: Request, res: Response) {
    const { name, phone, concern } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number required' });
    }
    const cb = storeService.createCallback({ name: name || 'Customer', phone, concern });
    return res.status(201).json({ success: true, data: cb, message: 'Callback request registered' });
  }

  getAllCallbacks(req: Request, res: Response) {
    const cbs = storeService.getAllCallbacks();
    return res.status(200).json({ success: true, count: cbs.length, data: cbs });
  }

  updateCallbackStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;
    const updated = storeService.updateCallbackStatus(id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Callback request not found' });
    }
    return res.status(200).json({ success: true, data: updated, message: 'Callback status updated' });
  }

  // Admin Stats
  getAdminStats(req: Request, res: Response) {
    const stats = storeService.getAdminStats();
    return res.status(200).json({ success: true, data: stats });
  }
}

export const storeController = new StoreController();

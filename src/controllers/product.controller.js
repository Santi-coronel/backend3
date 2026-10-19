import { productService } from '../services/product.service.js';
import { toProductDTO, toProductListDTO } from '../dto/product.dto.js';

export async function getProducts(req, res, next) {
  try {
    const result = await productService.getAllProducts(req.query);
    res.status(200).json({ status: 'success', ...toProductListDTO(result) });
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json({ status: 'success', payload: toProductDTO(product) });
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const product = await productService.createProduct(req.body, req.user.id);
    res.status(201).json({ status: 'success', payload: toProductDTO(product) });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await productService.updateProduct(req.params.id, req.body, req.user);
    res.status(200).json({ status: 'success', payload: toProductDTO(product) });
  } catch (error) {
    next(error);
  }
}

export async function updateProductStatus(req, res, next) {
  try {
    const product = await productService.updateProductStatus(
      req.params.id,
      req.body.status,
      req.user,
    );
    res.status(200).json({ status: 'success', payload: toProductDTO(product) });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    await productService.deleteProduct(req.params.id, req.user);
    res.status(200).json({ status: 'success', message: 'Producto eliminado' });
  } catch (error) {
    next(error);
  }
}

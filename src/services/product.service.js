import { productRepository } from '../repositories/product.repository.js';
import { BadRequest, Forbidden, NotFound } from '../utils/AppError.js';
import { PRODUCT_STATUS, PRODUCT_STATUS_LIST, PRODUCT_CATEGORIES_LIST, ROLES } from '../constants/index.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

function buildFilter({ status, category }) {
  const filter = {};

  if (status) {
    if (!PRODUCT_STATUS_LIST.includes(status)) {
      throw BadRequest(`status invalido. Valores permitidos: ${PRODUCT_STATUS_LIST.join(', ')}`);
    }
    filter.status = status;
  }

  if (category) {
    if (!PRODUCT_CATEGORIES_LIST.includes(category)) {
      throw BadRequest(
        `category invalida. Valores permitidos: ${PRODUCT_CATEGORIES_LIST.join(', ')}`,
      );
    }
    filter.category = category;
  }

  return filter;
}

export const productService = {
  async getAllProducts(query) {
    const page = Math.max(Number(query.page) || DEFAULT_PAGE, 1);
    const limit = Math.max(Number(query.limit) || DEFAULT_LIMIT, 1);
    const sortParam = query.sort === 'desc' ? -1 : query.sort === 'asc' ? 1 : null;

    const filter = buildFilter(query);
    const sort = sortParam ? { price: sortParam } : { createdAt: -1 };

    const { data, total } = await productRepository.findWithFilters(filter, {
      page,
      limit,
      sort,
    });

    return {
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },

  async getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw NotFound('Producto no encontrado');
    }
    return product;
  },

  /**
   * Reglas de negocio de creacion:
   *  - price no puede ser negativo
   *  - stock no puede ser negativo
   *  - category debe ser una de las categorias centralizadas
   *  - el owner siempre se toma del usuario autenticado (nunca del body)
   */
  async createProduct(data, ownerId) {
    const { title, description, category, price, stock } = data;

    if (!title || !description || !category) {
      throw BadRequest('title, description y category son obligatorios');
    }

    if (!PRODUCT_CATEGORIES_LIST.includes(category)) {
      throw BadRequest(
        `category invalida. Valores permitidos: ${PRODUCT_CATEGORIES_LIST.join(', ')}`,
      );
    }

    if (price === undefined || Number(price) < 0) {
      throw BadRequest('price debe ser un numero mayor o igual a 0');
    }

    if (stock !== undefined && Number(stock) < 0) {
      throw BadRequest('stock debe ser un numero mayor o igual a 0');
    }

    return productRepository.create({
      title,
      description,
      category,
      price: Number(price),
      stock: stock !== undefined ? Number(stock) : 0,
      owner: ownerId,
    });
  },

  /**
   * Solo el dueño del producto o un admin pueden modificarlo. Esta
   * decision de autorizacion sobre un recurso puntual vive en el
   * service (no en el controller), porque es una regla de negocio:
   * "un producto solo lo puede tocar su dueño o un admin".
   */
  async updateProduct(id, data, requester) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw NotFound('Producto no encontrado');
    }

    const isOwner = product.owner._id.toString() === requester.id;
    const isAdmin = requester.role === ROLES.ADMIN;

    if (!isOwner && !isAdmin) {
      throw Forbidden('Solo el dueño del producto o un admin pueden modificarlo');
    }

    if (data.price !== undefined && Number(data.price) < 0) {
      throw BadRequest('price debe ser un numero mayor o igual a 0');
    }

    if (data.stock !== undefined && Number(data.stock) < 0) {
      throw BadRequest('stock debe ser un numero mayor o igual a 0');
    }

    if (data.category && !PRODUCT_CATEGORIES_LIST.includes(data.category)) {
      throw BadRequest(
        `category invalida. Valores permitidos: ${PRODUCT_CATEGORIES_LIST.join(', ')}`,
      );
    }

    return productRepository.updateById(id, data);
  },

  async updateProductStatus(id, status, requester) {
    if (!PRODUCT_STATUS_LIST.includes(status)) {
      throw BadRequest(`status invalido. Valores permitidos: ${PRODUCT_STATUS_LIST.join(', ')}`);
    }

    const product = await productRepository.findById(id);
    if (!product) {
      throw NotFound('Producto no encontrado');
    }

    const isOwner = product.owner._id.toString() === requester.id;
    const isAdmin = requester.role === ROLES.ADMIN;

    if (!isOwner && !isAdmin) {
      throw Forbidden('Solo el dueño del producto o un admin pueden cambiar su estado');
    }

    return productRepository.updateById(id, { status });
  },

  async deleteProduct(id, requester) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw NotFound('Producto no encontrado');
    }

    const isOwner = product.owner._id.toString() === requester.id;
    const isAdmin = requester.role === ROLES.ADMIN;

    if (!isOwner && !isAdmin) {
      throw Forbidden('Solo el dueño del producto o un admin pueden eliminarlo');
    }

    await productRepository.deleteById(id);
  },
};

export { PRODUCT_STATUS };

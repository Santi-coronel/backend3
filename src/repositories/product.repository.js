import { productDAO } from '../dao/product.dao.js';

/**
 * Repository de Product.
 */
export const productRepository = {
  create(data) {
    return productDAO.create(data);
  },

  findById(id) {
    return productDAO.findById(id);
  },

  findWithFilters(filter, options) {
    return productDAO.findWithFilters(filter, options);
  },

  updateById(id, data) {
    return productDAO.updateById(id, data);
  },

  deleteById(id) {
    return productDAO.deleteById(id);
  },
};

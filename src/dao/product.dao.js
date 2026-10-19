import { Product } from '../models/Product.js';

/**
 * DAO de Product. Unico archivo (junto a user.dao.js) autorizado a
 * importar un modelo de Mongoose directamente.
 */
export const productDAO = {
  create(data) {
    return Product.create(data);
  },

  findById(id) {
    return Product.findById(id).populate('owner', 'first_name last_name email');
  },

  /**
   * Busqueda con filtros, paginacion y ordenamiento. Recibe un objeto
   * de filtro de Mongoose ya construido (la decision de que filtros
   * aplicar vive en el service, no aca) y las opciones de paginacion.
   */
  async findWithFilters(filter, { page, limit, sort }) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Product.find(filter)
        .populate('owner', 'first_name last_name email')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    return { data, total };
  },

  updateById(id, data) {
    return Product.findByIdAndUpdate(id, data, { new: true }).populate(
      'owner',
      'first_name last_name email',
    );
  },

  deleteById(id) {
    return Product.findByIdAndDelete(id);
  },
};

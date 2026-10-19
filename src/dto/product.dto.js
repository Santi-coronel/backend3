import { toUserDTO } from './user.dto.js';

/**
 * DTO de Product. Si "owner" viene populado (es un objeto de usuario
 * y no solo un ObjectId), lo vuelve a filtrar con toUserDTO para que
 * tampoco se filtre el password del propietario.
 */
export function toProductDTO(productDoc) {
  if (!productDoc) return null;

  const product =
    typeof productDoc.toObject === 'function' ? productDoc.toObject() : { ...productDoc };
  const { __v, ...safeProduct } = product;

  if (safeProduct.owner && typeof safeProduct.owner === 'object' && safeProduct.owner.email) {
    safeProduct.owner = toUserDTO(safeProduct.owner);
  }

  return safeProduct;
}

export function toProductListDTO({ data, page, limit, total, totalPages }) {
  return {
    data: data.map(toProductDTO),
    page,
    limit,
    total,
    totalPages,
  };
}

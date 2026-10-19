/**
 * DTO de User: controla que informacion de un usuario puede salir de
 * la API. Nunca se expone password ni __v.
 */
export function toUserDTO(userDoc) {
  if (!userDoc) return null;

  const user = typeof userDoc.toObject === 'function' ? userDoc.toObject() : { ...userDoc };
  const { password, __v, ...safeUser } = user;

  return safeUser;
}

export function toUserListDTO(users) {
  return users.map(toUserDTO);
}

export const cart = [];

export function addToCart(productId, quantitySelector) {
  let matchingItem;

  cart.forEach((item) => {
    if (productId === item.productId) {
      matchingItem = item;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += Number(quantitySelector);
  } else {
    cart.push({
      productId: productId,
      quantity: Number(quantitySelector),
    });
  }
}

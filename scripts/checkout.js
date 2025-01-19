import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  updateQuantity,
  updateDeliveryOption,
} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/currency.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions } from "../data/deliveryOptions.js";

let cartHTML = "";

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let deliveryOption;

  deliveryOptions.forEach((option) => {
    if (option.id === cartItem.deliveryOptionId) {
      deliveryOption = option;
    }
  });

  const today = dayjs();

  const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
  const delivery = deliveryDate.format("dddd MMMM D, YYYY");

  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  cartHTML += `
    <div class="cart-item-container js-cart-item-container-${
      matchingProduct.id
    }">
            <div class="delivery-date">Delivery date: ${delivery}</div>

            <div class="cart-item-details-grid">
              <img
                class="product-image"
                src="${matchingProduct.image}"
              />

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">$${formatCurrency(
                  matchingProduct.priceCents
                )}</div>
                <div class="product-quantity">
                  <span> Quantity: <span class="quantity-label js-quantity-label-${
                    matchingProduct.id
                  }">${cartItem.quantity}</span> </span>
                  <span class="update-quantity-link js-update-quantity-link link-primary" data-product-id="${
                    matchingProduct.id
                  }">
                    Update
                  </span>
                  <input class='quantity-input js-quantity-input-${
                    matchingProduct.id
                  }'>
                  <span class='save-quantity-link js-save-quantity-link link-primary' data-product-id="${
                    matchingProduct.id
                  }">
                  Save
                  </span>
                  <span class="delete-quantity-link js-delete-quantity-link link-primary" data-product-id="${
                    matchingProduct.id
                  }">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(matchingProduct, cartItem)}
              </div>
            </div>
          </div>`;
});

function deliveryOptionsHTML(matchingProduct, cartItem) {
  let deliveryHTML = "";
  deliveryOptions.forEach((option) => {
    const today = dayjs();

    const deliveryDate = today.add(option.deliveryDays, "days");
    const delivery = deliveryDate.format("dddd MMMM D, YYYY");

    const shippingPrice =
      option.priceCents === 0
        ? "FREE"
        : `$${formatCurrency(option.priceCents)} -`;

    const check = option.id === cartItem.deliveryOptionId;
    deliveryHTML += `
                <div class="delivery-option js-delivery-option" data-product-id="${
                  matchingProduct.id
                }" data-option-id="${option.id}">
                  <input
                    type="radio" ${check ? "checked" : ""}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}"
                  />
                  <div>
                    <div class="delivery-option-date">${delivery}</div>
                    <div class="delivery-option-price">${shippingPrice} Shipping</div>
                  </div>
                </div>`;
  });
  return deliveryHTML;
}

const cartQuantity = calculateCartQuantity();

document.querySelector(
  ".js-return-to-home-link"
).innerHTML = `${cartQuantity} items`;

document.querySelector(".js-order-summary").innerHTML = cartHTML;

document.querySelectorAll(".js-delete-quantity-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;

    removeFromCart(productId);

    const cartQuantity = calculateCartQuantity();

    document.querySelector(
      ".js-return-to-home-link"
    ).innerHTML = `${cartQuantity} items`;

    const productContainer = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    productContainer.remove();
  });
});

document.querySelectorAll(".js-update-quantity-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;

    const productContainer = document.querySelector(
      `.js-cart-item-container-${productId}`
    );

    productContainer.classList.add("editing-quantity");
  });
});

document.querySelectorAll(".js-save-quantity-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;

    const productContainer = document.querySelector(
      `.js-cart-item-container-${productId}`
    );

    productContainer.classList.remove("editing-quantity");

    const newQuantity = Number(
      document.querySelector(`.js-quantity-input-${productId}`).value
    );

    updateQuantity(productId, newQuantity);

    let cartQuantity = calculateCartQuantity();

    document.querySelector(
      ".js-return-to-home-link"
    ).innerHTML = `${cartQuantity} items`;
  });
});

document.querySelectorAll(".js-delivery-option").forEach((element) => {
  element.addEventListener("click", () => {
    const { optionId, productId } = element.dataset;
    updateDeliveryOption(productId, optionId);
  });
});

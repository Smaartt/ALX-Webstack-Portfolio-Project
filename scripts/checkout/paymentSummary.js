import { cart, calculateCartQuantity } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { formatCurrency } from "../utils/currency.js";

export function renderPaymentSummary() {
  let productPrice = 0;
  let shippingPrice = 0;

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productPrice += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPrice += deliveryOption.priceCents;
  });

  const totalBeforeTax = productPrice + shippingPrice;
  const tax = totalBeforeTax * 0.1;
  const total = totalBeforeTax + tax;

  const cartQuantity = calculateCartQuantity();

  const paymentHTML = `<div class="payment-summary-title">Order Summary</div>

          <div class="payment-summary-row">
            <div>Items (${cartQuantity}):</div>
            <div class="payment-summary-money">$${formatCurrency(
              productPrice
            )}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(
              shippingPrice
            )}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(
              totalBeforeTax
            )}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(tax)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(total)}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>`;

  document.querySelector(".js-payment-summary").innerHTML = paymentHTML;
}

// src/order/CheckoutPage.jsx

import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../utils/axios";
import AddressForm from "./AddressForm";
import ShippingMethod from "./ShippingMethod";
import PaymentForm from "./PaymentForm";
import OrderSummary from "./OrderSummary";
import Navbar from "../components/Navbar";
import { useOrderStore } from "../store/useOrderStore";
import.meta.env.VITE_RAZORPAY_KEY_ID
export default function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { placeUserOrder } = useOrderStore();

  const [addressId, setAddressId] = useState("");

  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  if (!state?.product) {
    return <div>No order found</div>;
  }

  const { product, size, quantity } = state;

const handlePlaceOrder = async () => {
  const hasSavedAddress = !!addressId;
console.log(import.meta.env.VITE_RAZORPAY_KEY_ID);
  const hasManualAddress =
    deliveryAddress.street.trim() &&
    deliveryAddress.city.trim() &&
    deliveryAddress.state.trim() &&
    deliveryAddress.pincode.trim();

  if (!hasSavedAddress && !hasManualAddress) {
    alert("Please select or enter a delivery address");
    return;
  }

  const payload = {
    items: [
      {
        product: product._id,
        size,
        quantity,
      },
    ],
    paymentMethod,
  };

  if (hasSavedAddress) {
    payload.addressId = addressId;
  } else {
    payload.deliveryAddress =
      deliveryAddress;
  }

  try {
    // COD FLOW
    if (paymentMethod === "cod") {
      await placeUserOrder(payload);

      alert("Order placed successfully");

      navigate("/my-orders");

      return;
    }

    // RAZORPAY FLOW
    const amount =
      product.price * quantity;

    const { data } = await api.post(
      "http://localhost:8000/api/payments/create-order",
      {
        amount,
      }
    );

    const options = {
      key: import.meta.env
        .VITE_RAZORPAY_KEY_ID,

      amount: data.amount,

      currency: data.currency,

      order_id: data.id,

      name: "Alhnkar",

      description: "Order Payment",

      handler: async function (
        response
      ) {
        console.log(
          "Payment Success",
          response
        );

        // Later we'll verify payment

        await placeUserOrder(payload);

        alert(
          "Payment successful & order placed"
        );

        navigate("/my-orders");
      },
    };

    const rzp =
      new window.Razorpay(options);

    rzp.open();
  } catch (error) {
    console.error(error);

    alert(
      error?.response?.data?.message ||
        "Failed to place order"
    );
  }
};

  return (
    <div className="bg-bg text-text min-h-screen px-4 md:px-10">
      <Navbar />

      <div className="py-10">
        <h1 className="text-2xl md:text-3xl font-serif">
          Finalizing Beauty
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <AddressForm
            addressId={addressId}
            setAddressId={setAddressId}
            deliveryAddress={deliveryAddress}
            setDeliveryAddress={setDeliveryAddress}
          />

          <ShippingMethod />

          <PaymentForm
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </div>

        <OrderSummary
          product={product}
          quantity={quantity}
          onPlaceOrder={handlePlaceOrder}
        />
      </div>
    </div>
  );
}
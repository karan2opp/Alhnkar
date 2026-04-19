// src/order/CheckoutPage.jsx

import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import AddressForm from "./AddressForm";
import ShippingMethod from "./ShippingMethod";
import PaymentForm from "./PaymentForm";
import OrderSummary from "./OrderSummary";
import Navbar from "../components/Navbar"
import { useOrderStore } from "../store/useOrderStore";

export default function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { placeUserOrder } = useOrderStore();

  const [addressId, setAddressId] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("cod");

  if (!state?.product) {
    return <div>No order found</div>;
  }

  const {
    product,
    size,
    quantity,
  } = state;

  const handlePlaceOrder = async () => {
    if (!addressId) {
      alert("Please select address");
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
      addressId,
      paymentMethod,
    };

    await placeUserOrder(payload);

    alert("Order placed successfully");

    navigate("/my-orders");
  };

  return (
    <div className="bg-bg text-text min-h-screen px-4 md:px-10 ">
      <Navbar />
      <div className=" py-10">
        <h1 className="text-2xl md:text-3xl font-serif">
          Finalizing Beauty
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <AddressForm
            addressId={addressId}
            setAddressId={setAddressId}
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
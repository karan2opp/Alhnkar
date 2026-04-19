// src/order/MyOrdersPage.jsx

import { useEffect, useState } from "react";
import { useOrderStore } from "../store/useOrderStore";
import { useAuthStore } from "../store/useAuthStore";
import Navbar from "../components/Navbar";

export default function MyOrdersPage() {
  const {
    orders,
    fetchUserOrders,
    cancelUserOrder,
    loading,
  } = useOrderStore();

  const { isLoggedIn } = useAuthStore();

  const [selectedFilter, setSelectedFilter] =
    useState("allOrders");

  const filters = [
    {
      label: "All Orders",
      value: "allOrders",
    },
    {
      label: "Pending",
      value: "pending",
    },
    {
      label: "Delivered",
      value: "delivered",
    },
    {
      label: "Cancelled",
      value: "cancelled",
    },
  ];

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserOrders(selectedFilter);
    }
  }, [isLoggedIn, selectedFilter]);

  return (
    <>
      <Navbar />

      <div className="bg-bg text-text min-h-screen px-4 md:px-10 py-10">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs tracking-[0.35em] text-primary/70 uppercase mb-3">
            Order History
          </p>

          <h1 className="text-3xl md:text-4xl font-serif text-accent mb-3">
            My Orders
          </h1>

          <p className="text-text/70">
            Track your purchases and manage your
            orders beautifully.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-10">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() =>
                setSelectedFilter(filter.value)
              }
              className={`px-5 py-2 border rounded-md text-sm transition
                ${
                  selectedFilter === filter.value
                    ? "bg-primary text-bg border-primary"
                    : "border-primary/20 hover:bg-primary hover:text-bg"
                }
              `}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-20">
            Loading orders...
          </div>
        ) : orders?.length === 0 ? (
          <div className="bg-surface border border-primary/10 rounded-xl p-10 text-center">
            <h2 className="text-xl font-medium mb-2">
              No Orders Found
            </h2>

            <p className="text-text/60">
              You don’t have any orders in this
              category yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-surface border border-primary/10 rounded-xl p-6 shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
                  {/* Left */}
                  <div>
                    <h2 className="text-lg font-medium mb-2">
                      Order #{order._id.slice(-6)}
                    </h2>

                    <p className="text-sm text-text/70 mb-1">
                      Status:
                      <span className="ml-2 font-medium text-primary">
                        {order.status}
                      </span>
                    </p>

                    <p className="text-sm text-text/70">
                      Total Amount:
                      <span className="ml-2 font-medium text-accent">
                        ₹{order.amount}
                      </span>
                    </p>
                  </div>

                  {/* Right */}
                  <div className="flex gap-3">
                    {order.status !==
                      "cancelled" && (
                      <button
                        onClick={() =>
                          cancelUserOrder(
                            order._id
                          )
                        }
                        className="border border-primary px-5 py-2 rounded-md text-sm hover:bg-primary hover:text-bg transition"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
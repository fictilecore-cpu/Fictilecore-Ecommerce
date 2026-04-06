'use client';

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth, authFetch, User as AuthUser } from "@/app/context/AuthContext";

// Types for profile data
type OrderItem = {
  productName: string;
  quantity: number;
  imagePaths?: string | string[];
};

type Order = {
  id: string;
  orderDate: string;
  totalAmount: number;
  items: OrderItem[];
};

type Address = {
  type: string;
  name: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [profileUser, setProfileUser] = useState<AuthUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to build absolute image URL
  const buildImageURL = (path: string) =>
    path.startsWith("/") ? `https://fictilecore.com${path}` : path;

  // Load profile, orders, and addresses
  const loadProfile = async () => {
    if (!user?.id) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch profile first
      const fetchedUser = await authFetch(`https://fictilecore.com/profile/token`);
      setProfileUser(fetchedUser);

      // Fetch orders and addresses in parallel but independently
      const fetchOrders = authFetch(`https://fictilecore.com/order/${user.id}`).catch(err => {
        console.warn("[WARN] Failed to fetch orders:", err);
        return [] as Order[];
      });

      const fetchAddresses = authFetch(`https://fictilecore.com/api/customers/address/${user.id}`).catch(err => {
        console.warn("[WARN] Failed to fetch addresses:", err);
        return [] as Address[];
      });

      const [fetchedOrders, fetchedAddresses] = await Promise.all([fetchOrders, fetchAddresses]);

      setOrders(fetchedOrders);
      setAddresses(fetchedAddresses);
    } catch (err) {
      console.error("[ERROR] Failed to fetch profile:", err);
      setError("Failed to load profile. Logging out...");
      logout(); // Only logout if profile fetch fails
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.token) return; // Wait until user is loaded
    loadProfile();
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      const response = await authFetch(`https://fictilecore.com/order/cancel/${orderId}`, {
        method: "PUT",
      });
      console.log("[DEBUG] Cancel order response:", response);

      alert("Order cancelled successfully.");
      loadProfile(); // reload orders
    } catch (err) {
      console.error("[ERROR] Unable to cancel the order:", err);
      alert("Unable to cancel the order. Please try again.");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!profileUser) return <div className="text-center text-gray-500 py-10">User not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg space-y-8 relative">
      {/* Logout Button */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* User Info */}
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">User Profile</h2>
      <section>
        <h3 className="text-xl font-semibold mb-2">Basic Info</h3>
        <div>First Name: {profileUser.firstName}</div>
        <div>Last Name: {profileUser.lastName}</div>
        <div>Email: {profileUser.email}</div>
        <div>Phone: {profileUser.phoneNumber}</div>
      </section>

      {/* Orders */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Orders</h3>
        {orders.length > 0 ? (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="p-6 bg-gray-50 rounded-2xl shadow">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-700">
                    <span className="font-semibold">Order Date:</span> {order.orderDate}
                  </p>
                  <p className="text-gray-800 font-bold">Total: ₹{order.totalAmount?.toFixed(2)}</p>
                </div>

                {order.items.length > 0 ? (
                  <AnimatePresence>
                    {order.items.map((item, idx) => {
                      const imagesArray = item.imagePaths
                        ? Array.isArray(item.imagePaths)
                          ? item.imagePaths
                          : String(item.imagePaths).split(",").map((img) => img.trim())
                        : [];
                      const imageUrl = imagesArray[0] ? buildImageURL(imagesArray[0]) : "/placeholder.png";

                      return (
                        <motion.div
                          key={`${order.id}-${idx}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center space-x-4 p-4 border border-gray-200 rounded-2xl hover:shadow-md transition-all"
                        >
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden">
                            <Image src={imageUrl} alt={item.productName} fill className="object-cover" />
                          </div>

                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 mb-1">{item.productName}</h3>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                ) : (
                  <p className="text-gray-500">No items in this order</p>
                )}

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No orders found.</p>
        )}
      </section>

      {/* Addresses */}
      <section>
        <h3 className="text-xl font-semibold mb-2">Addresses</h3>
        {addresses.length > 0 ? (
          <ul>
            {addresses.map((addr, idx) => (
              <li key={idx} className="p-4 border rounded mb-2">
                <p>{addr.type} Address</p>
                <p>{addr.name}</p>
                <p>{addr.street}, {addr.city}, {addr.state}</p>
                <p>{addr.pincode}, {addr.country}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No addresses found.</p>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
"use client";

import { useEffect, useState } from "react";
import { PackageCheck, RefreshCw, AlertTriangle } from "lucide-react";

interface OrderItem {
  productName: string;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  email: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
}

const STATUS_URL = "http://localhost:8080/order/status";
const ALL_ORDERS_URL = "https://fictilecore.com/order/getall";
const UPDATE_STATUS_URL = "http://localhost:8080/order/update-status";

export default function OrderDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "SHIPPING" | "DELIVERED">("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const fetchOrders = async (status: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = status === "ALL" ? ALL_ORDERS_URL : `${STATUS_URL}/${status}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      console.error("Fetch failed:", err);
      setError("Could not load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(statusFilter);
  }, [statusFilter]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    const action = newStatus === "SHIPPING" ? "ship" : "deliver";
    if (!confirm(`Are you sure you want to ${action} this order?`)) {
      return;
    }

    setUpdatingOrderId(orderId);

    try {
      const res = await fetch(
        `${UPDATE_STATUS_URL}/${orderId}?status=${newStatus}`,
        { method: "PATCH" }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `Failed (HTTP ${res.status})`);
      }

      // Refresh current view
      await fetchOrders(statusFilter);

      alert(`Order successfully marked as ${newStatus}!`);
    } catch (err) {
      console.error("Update failed:", err);
      alert(
        `Failed to update status.\n${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toUpperCase() || "";
    const base = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border";

    if (s === "PENDING") return `${base} bg-yellow-50 text-yellow-800 border-yellow-200`;
    if (s === "SHIPPING") return `${base} bg-blue-50 text-blue-800 border-blue-200`;
    if (s === "DELIVERED") return `${base} bg-green-50 text-green-800 border-green-200`;

    return `${base} bg-gray-50 text-gray-700 border-gray-200`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Order Management
          </h1>
          <button
            onClick={() => fetchOrders(statusFilter)}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-60 transition shadow-sm"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2.5 mb-8">
          {["ALL", "PENDING", "SHIPPING", "DELIVERED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={`
                px-6 py-2.5 rounded-full text-sm font-medium transition-all
                ${
                  statusFilter === status
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              {status === "ALL" ? "All Orders" : status}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Main Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <PackageCheck className="h-16 w-16 text-gray-400 mx-auto mb-5" />
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              No orders found
            </h3>
            <p className="text-gray-600">
              {statusFilter === "ALL"
                ? "No orders exist yet."
                : `No ${statusFilter.toLowerCase()} orders currently.`}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Items</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{order.customerName}</td>
                      <td className="px-6 py-4 text-gray-600">{order.email}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(order.orderDate).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={getStatusBadge(order.status)}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        ₹{Number(order.totalAmount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {order.items.map((item, i) => (
                          <div key={i} className="text-sm">
                            {item.productName} × {item.quantity}
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col sm:flex-row gap-2.5 items-center">
                          {order.status?.toUpperCase() === "PENDING" && (
                            <button
                              onClick={() => updateStatus(order.id, "SHIPPING")}
                              disabled={updatingOrderId === order.id}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm min-w-[140px] text-center"
                            >
                              {updatingOrderId === order.id ? "Updating..." : "Mark as Shipped"}
                            </button>
                          )}

                          {order.status?.toUpperCase() === "SHIPPING" && (
                            <button
                              onClick={() => updateStatus(order.id, "DELIVERED")}
                              disabled={updatingOrderId === order.id}
                              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm min-w-[140px] text-center"
                            >
                              {updatingOrderId === order.id ? "Updating..." : "Mark as Delivered"}
                            </button>
                          )}

                          {order.status?.toUpperCase() === "DELIVERED" && (
                            <div className="inline-flex items-center gap-2 px-5 py-2 bg-green-50 text-green-700 font-medium rounded-md border border-green-200 min-w-[140px] justify-center">
                              <PackageCheck size={16} />
                              <span>Delivered</span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
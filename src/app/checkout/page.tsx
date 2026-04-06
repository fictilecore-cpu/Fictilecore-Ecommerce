// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { useForm } from "react-hook-form";
// import {
//   CreditCard,
//   Shield,
//   ArrowLeft,
//   MapPin,
//   Plus,
//   Check,
//   X,
// } from "lucide-react";
// import { useCart } from "@/app/context/CartContext";
// import { useAuth } from "@/app/context/AuthContext";
// import Link from "next/link";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import {
//   Address,
//   fetchAddresses,
// } from "../lib/userprofileapi";

// interface CheckoutForm {
//   email: string;
//   firstName: string;
//   lastName: string;
//   paymentMethod: "card" | "paypal" | "cod";
//   cardNumber?: string;
//   expiryDate?: string;
//   cvv?: string;
//   cardName?: string;
// }

// const FullScreenImagePreview = ({
//   imageUrl,
//   alt,
//   onClose,
// }: {
//   imageUrl: string;
//   alt: string;
//   onClose: () => void;
// }) => {
//   const [touchStartY, setTouchStartY] = useState<number | null>(null);
//   const [translateY, setTranslateY] = useState(0);
//   const threshold = 120; // pixels to swipe down to close

//   const handleTouchStart = (e: React.TouchEvent) => {
//     setTouchStartY(e.touches[0].clientY);
//     setTranslateY(0);
//   };

//   const handleTouchMove = (e: React.TouchEvent) => {
//     if (touchStartY === null) return;
//     const currentY = e.touches[0].clientY;
//     const diff = currentY - touchStartY;

//     if (diff > 0) {
//       // only allow dragging down
//       setTranslateY(diff);
//     }
//   };

//   const handleTouchEnd = () => {
//     if (translateY > threshold) {
//       onClose();
//     } else {
//       setTranslateY(0);
//     }
//     setTouchStartY(null);
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center transition-opacity duration-300"
//       onClick={onClose} // click outside to close
//     >
//       {/* Image container – prevents closing when clicking image */}
//       <div
//         className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
//         onClick={(e) => e.stopPropagation()}
//         onTouchStart={handleTouchStart}
//         onTouchMove={handleTouchMove}
//         onTouchEnd={handleTouchEnd}
//       >
//         <div
//           className="relative w-full h-full transition-transform duration-300 ease-out"
//           style={{ transform: `translateY(${translateY}px)` }}
//         >
//           <Image
//             src={imageUrl}
//             alt={alt}
//             fill
//             className="object-contain"
//             priority
//           />
//         </div>

//         {/* Close button */}
//         <button
//           onClick={onClose}
//           className="absolute top-6 right-6 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition"
//           aria-label="Close preview"
//         >
//           <X size={28} />
//         </button>

//         {/* Hint for mobile */}
//         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 text-sm md:hidden">
//           Swipe down to close
//         </div>
//       </div>
//     </div>
//   );
// };

// const CheckoutPage = () => {
//   const router = useRouter();
//   const { user } = useAuth();
//   const { items, totalPrice, clearCart } = useCart();

//   const [addresses, setAddresses] = useState<Address[]>([]);
//   const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [pageError, setPageError] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [orderSuccess, setOrderSuccess] = useState(false);

//   // Preview state
//   const [previewImage, setPreviewImage] = useState<{ url: string; alt: string } | null>(null);

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm<CheckoutForm>({
//     defaultValues: {
//       paymentMethod: "cod",
//     },
//   });

//   const paymentMethod = watch("paymentMethod");

//   useEffect(() => {
//     if (!user) {
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setPageError(null);

//     setValue("email", user.email || "");
//     setValue("firstName", user.firstName || "");
//     setValue("lastName", user.lastName || "");

//     const loadData = async () => {
//       try {
//         const fetchedAddresses = await fetchAddresses(user.id);
//         setAddresses(fetchedAddresses || []);

//         if (fetchedAddresses?.length === 1) {
//           setSelectedAddressId(fetchedAddresses[0].id);
//         }
//       } catch (err: any) {
//         console.error("Failed to load checkout data:", err);
//         setPageError("Failed to load your addresses. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, [user, setValue]);

//   const onSubmit = async (data: CheckoutForm) => {
//     // ... (your existing submit logic - unchanged)
//     if (!user) {
//       alert("Please sign in to place an order.");
//       return;
//     }

//     if (!selectedAddressId) {
//       alert("Please select a delivery address.");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`;

//       const payload = {
//         customerId: user.id,
//         customerName: fullName,
//         email: data.email.trim(),
//         orderDate: new Date().toISOString().split("T")[0],
//         totalAmount: totalPrice,
//         addressId: selectedAddressId,
//         paymentMethod: data.paymentMethod,
//         items: items.map((item) => ({
//           productName: item.product.name,
//           productId: item.product.id,
//           quantity: item.quantity,
//         })),
//       };

//       const res = await fetch("https://fictilecore.com/order/save", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user.token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(errorText || "Failed to place order");
//       }

//       clearCart();
//       setOrderSuccess(true);
//       alert("Order placed successfully! Thank you for shopping with us.");
//       router.push("/");
//     } catch (err: any) {
//       console.error("Order placement failed:", err);
//       alert(err.message || "Could not place order. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const buildImageURL = (path?: string) =>
//     path?.startsWith("/") ? `https://fictilecore.com${path}` : path || "/placeholder.png";

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
//         {/* ... unchanged ... */}
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (orderSuccess) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
//         {/* ... unchanged ... */}
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
//         {/* Header */}
//         <div className="mb-8">
//           <Link
//             href="/cart"
//             className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
//           >
//             <ArrowLeft className="h-5 w-5 mr-2" />
//             Back to Cart
//           </Link>
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Checkout</h1>
//         </div>

//         {pageError && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
//             {pageError}
//           </div>
//         )}

//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
//             {/* Left column - forms (unchanged) */}
//             <div className="lg:col-span-3 space-y-8">
//               {/* Contact Information, Delivery Address, Payment Method sections */}
//               {/* ... your existing code here - no changes needed ... */}
//             </div>

//             {/* Right – Order Summary */}
//             <div className="lg:col-span-2">
//               <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 sticky top-8">
//                 <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

//                 <div className="space-y-5 mb-8">
//                   {items.map((item) => {
//                     const { product, quantity } = item;
//                     if (!product) return null;

//                     const images = Array.isArray(product.imagePaths)
//                       ? product.imagePaths
//                       : typeof product.imagePaths === "string"
//                       ? product.imagePaths.split(",").map((s) => s.trim())
//                       : [];

//                     const imgUrl = images[0] ? buildImageURL(images[0]) : "/placeholder.png";

//                     return (
//                       <div key={product.id} className="flex gap-4">
//                         <div
//                           className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border cursor-pointer hover:opacity-90 transition"
//                           onClick={() => setPreviewImage({ url: imgUrl, alt: product.name })}
//                         >
//                           <Image
//                             src={imgUrl}
//                             alt={product.name}
//                             fill
//                             className="object-cover"
//                           />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="font-medium text-gray-900 line-clamp-2">
//                             {product.name}
//                           </p>
//                           <p className="text-sm text-gray-600 mt-0.5">Qty: {quantity}</p>
//                         </div>
//                         <p className="font-semibold text-blue-700 whitespace-nowrap">
//                           ₹{(product.price * quantity).toFixed(0)}
//                         </p>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {/* Price breakdown & Place Order button - unchanged */}
//                 <div className="space-y-4 pt-6 border-t">
//                   {/* ... subtotal, shipping, tax, total ... */}
//                   <div className="flex justify-between pt-4 border-t text-lg font-bold">
//                     <span>Total</span>
//                     <span className="text-2xl text-blue-700">
//                       ₹{totalPrice.toFixed(0)}
//                     </span>
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={isSubmitting || !selectedAddressId || items.length === 0}
//                   className="mt-8 w-full bg-blue-600 text-white py-4 rounded-full font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
//                 >
//                   {isSubmitting ? "Processing..." : "Place Order"}
//                 </button>

//                 <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
//                   <Shield className="h-4 w-4" />
//                   <span>Secure checkout • 256-bit SSL encryption</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>

//       {/* Full screen preview overlay */}
//       {previewImage && (
//         <FullScreenImagePreview
//           imageUrl={previewImage.url}
//           alt={previewImage.alt}
//           onClose={() => setPreviewImage(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default CheckoutPage;
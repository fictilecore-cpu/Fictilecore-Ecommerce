"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  Star,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  ZoomIn,
  X,
  Check,
} from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { Product } from "@/app/types";
import Footer1 from "@/app/components/Footer1";
import Navbar from "@/app/components/Navbar";
import { div } from "framer-motion/client";

const ProductPage: React.FC = () => {
  const params = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [imagesArray, setImagesArray] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description",
  );
  const [showPreview, setShowPreview] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  // Add-to-cart button states
  const [cartStatus, setCartStatus] = useState<"idle" | "adding" | "success">(
    "idle",
  );
  const resetTimer = useRef<NodeJS.Timeout | null>(null);

  // Touch swipe-down refs (for preview)
  const touchStartY = useRef<number | null>(null);
  const touchTranslate = useRef(0);

  useEffect(() => {
    if (!params?.id) return;

    fetch(`https://fictilecore.com/api/checkout/${params.id}`)
      .then((res) => res.json())
      .then((data: Product) => {
        setProduct(data);

        const imgs = data.imagePaths
          ? Array.isArray(data.imagePaths)
            ? data.imagePaths
            : String(data.imagePaths)
                .split(",")
                .map((img) => img.trim())
          : [];

        setImagesArray(imgs);
        setSelectedImage(imgs[0] || "");
      })
      .catch((err) => console.error("Failed to fetch product:", err));
  }, [params?.id]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  const buildImageURL = (path: string) =>
    path.startsWith("/") ? `https://fictilecore.com${path}` : path;

  const increaseQuantity = () => {
    if (product && quantity < (product.stockCount || 1))
      setQuantity((q) => q + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const handleAddToCart = () => {
    if (cartStatus !== "idle") return; // prevent double-click

    setCartStatus("adding");

    // Simulate network delay (remove setTimeout in real app → call addToCart then set 'success')
    setTimeout(() => {
      addToCart({ ...product, quantity });

      setCartStatus("success");

      // Reset after showing success for 1.8 seconds
      resetTimer.current = setTimeout(() => {
        setCartStatus("idle");
      }, 1800);
    }, 700); // fake delay — replace with real async logic
  };

  const handleToggleWishlist = () => setIsWishlisted(!isWishlisted);

  const openPreview = (index: number) => {
    setPreviewIndex(index);
    setShowPreview(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchTranslate.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) touchTranslate.current = delta;
  };

  const handleTouchEnd = () => {
    if (touchTranslate.current > 120) {
      setShowPreview(false);
    }
    touchStartY.current = null;
    touchTranslate.current = 0;
  };

  // Button content based on state
  const getButtonContent = () => {
    switch (cartStatus) {
      case "adding":
        return (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
            Adding...
          </>
        );
      case "success":
        return (
          <div className="flex items-center gap-2 animate-[bounce_0.6s_ease-in-out]">
            <Check size={20} />
            Added!
          </div>
        );
      default:
        return (
          <>
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto p-5 flex flex-col md:flex-row gap-10">
        {/* ─── Images Section ─── */}
        <div className="flex flex-col md:flex-row gap-5 relative">
          {/* Desktop thumbnails */}
          {imagesArray.length > 1 && (
            <div className="hidden md:flex flex-col gap-2 overflow-y-auto max-h-[500px]">
              {imagesArray.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded border overflow-hidden transition-all ${
                    selectedImage === img
                      ? "border-2 border-blue-600 scale-105"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image
                    src={buildImageURL(img)}
                    alt={`thumb-${i}`}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Image */}
          <div
            className="relative w-full aspect-square max-w-[500px] md:w-[500px] md:h-[500px] border rounded-xl overflow-hidden cursor-zoom-in shadow-sm hover:shadow-md transition"
            onClick={() => openPreview(imagesArray.indexOf(selectedImage))}
          >
            <Image
              src={
                selectedImage
                  ? buildImageURL(selectedImage)
                  : "/placeholder.png"
              }
              alt={product.name}
              fill
              className="object-contain p-4"
              priority
            />
            <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2.5 py-1.5 rounded-full text-xs flex items-center gap-1">
              <ZoomIn size={16} /> Tap to enlarge
            </div>
          </div>

          {/* Mobile thumbnails */}
          {imagesArray.length > 1 && (
            <div className="flex md:hidden gap-2.5 overflow-x-auto pb-2 w-full">
              {imagesArray.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg border overflow-hidden transition-all ${
                    selectedImage === img
                      ? "border-2 border-blue-600 scale-105 shadow"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={buildImageURL(img)}
                    alt={`thumb-${i}`}
                    width={80}
                    height={80}
                    className="object-contain p-1.5"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── Product Details ─── */}
        <div className="flex-1 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
            <button
              onClick={handleToggleWishlist}
              className="p-3 bg-gray-100 rounded-full"
            >
              <Heart
                className={`h-6 w-6 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-700"}`}
              />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(product.rating || 0)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-gray-600">({product.reviews || 0})</span>
          </div>

          <div className="flex items-center gap-4 text-2xl">
            <span className="font-bold text-blue-700">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-gray-500 line-through text-xl">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {/* Quantity + Animated Add to Cart */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={decreaseQuantity}
                className="px-4 py-2.5 border-r hover:bg-gray-50"
              >
                <Minus size={18} />
              </button>
              <span className="px-6 py-2.5 font-medium min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={increaseQuantity}
                className="px-4 py-2.5 border-l hover:bg-gray-50"
              >
                <Plus size={18} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={
                cartStatus !== "idle" ||
                !product.stockCount ||
                product.stockCount <= 0
              }
              className={`
           w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary/90 transition disabled:bg-gray-300 flex items-center justify-center space-x-2
              ${
                cartStatus === "idle"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : cartStatus === "adding"
                    ? "bg-blue-500 text-white cursor-wait"
                    : "bg-green-600 text-white scale-105"
              }
              disabled:bg-gray-400 disabled:cursor-not-allowed
            `}
            >
              {getButtonContent()}

              {/* Optional: success ripple effect */}
              {cartStatus === "success" && (
                <span className="absolute inset-0 rounded-lg bg-white/30 animate-ping pointer-events-none" />
              )}
            </button>
          </div>

          {/* Stock warning */}
          {product.stockCount &&
            product.stockCount <= 5 &&
            cartStatus === "idle" && (
              <p className="text-sm text-orange-600">
                Only {product.stockCount} left in stock — order soon!
              </p>
            )}

          {/* Tabs */}
          <div className="mt-6">
            <div className="flex gap-6 border-b">
              <button
                className={`pb-3 px-1 font-medium ${
                  activeTab === "description"
                    ? "border-b-2 border-blue-600 text-blue-700"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={`pb-3 px-1 font-medium ${
                  activeTab === "reviews"
                    ? "border-b-2 border-blue-600 text-blue-700"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews ({product.reviews || 0})
              </button>
            </div>

            <div className="mt-5 text-gray-700 leading-relaxed">
              {activeTab === "description" ? (
                <>
                  <p className="mb-4">
                    {product.description || "No description available."}
                  </p>
                  {product.aboutItem1 && (
                    <p className="mb-3">• {product.aboutItem1}</p>
                  )}
                  {product.aboutItem2 && (
                    <p className="mb-3">• {product.aboutItem2}</p>
                  )}
                  {product.aboutItem3 && (
                    <p className="mb-3">• {product.aboutItem3}</p>
                  )}
                  {product.aboutItem4 && (
                    <p className="mb-3">• {product.aboutItem4}</p>
                  )}
                  {product.aboutItem5 && (
                    <p className="mb-3">• {product.aboutItem5}</p>
                  )}
                </>
              ) : (
                <p className="text-gray-500">
                  Customer reviews will appear here soon.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Full Screen Preview (unchanged from previous) */}
        {showPreview && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setShowPreview(false)}
          >
            <button
              className="absolute top-5 right-5 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition"
              onClick={() => setShowPreview(false)}
              aria-label="Close"
            >
              <X size={28} />
            </button>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 text-sm md:hidden pointer-events-none">
              Swipe down to close
            </div>

            <div
              className="relative w-full h-full max-w-5xl max-h-[95vh] flex items-center justify-center px-4"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={buildImageURL(imagesArray[previewIndex])}
                alt={`${product.name} - ${previewIndex + 1}`}
                fill
                className="object-contain"
                priority
              />

              {imagesArray.length > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition text-2xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewIndex((i) =>
                        i > 0 ? i - 1 : imagesArray.length - 1,
                      );
                    }}
                  >
                    ←
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition text-2xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewIndex((i) =>
                        i < imagesArray.length - 1 ? i + 1 : 0,
                      );
                    }}
                  >
                    →
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer1 />
    </div>
  );
};

export default ProductPage;

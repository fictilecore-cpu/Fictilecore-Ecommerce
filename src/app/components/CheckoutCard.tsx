// 'use client';

// import { useEffect, useState, useMemo } from 'react';
// import Image from 'next/image';
// import { useCart } from '@/app/context/CartContext';
// import { Product } from '@/app/types';

// interface ProductDetailPageProps {
//   params: { id: string };
// }

// const API_BASE = 'https://fictilecore.com';
// const FALLBACK = '/placeholder.png';

// const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ params }) => {
//   const { id } = params;

//   const [product, setProduct] = useState<Product | null>(null);
//   const [selectedImage, setSelectedImage] = useState<string>(FALLBACK);

//   const { addToCart } = useCart();

//   const buildImageURL = (path?: string) => {
//     if (!path) return FALLBACK;

//     const clean = path.trim();

//     if (clean.startsWith('http')) return clean;

//     return `${API_BASE}${clean.startsWith('/') ? '' : '/'}${clean}`;
//   };

//   useEffect(() => {
//     if (!id) return;

//     fetch(`${API_BASE}/api/checkout/${id}`)
//       .then((res) => res.json())
//       .then((data: Product) => {
//         setProduct(data);

//         const imgs = data.imagePaths
//           ? Array.isArray(data.imagePaths)
//             ? data.imagePaths
//             : [data.imagePaths]
//           : [];

//         if (imgs.length > 0) {
//           setSelectedImage(imgs[0]);
//         }
//       });
//   }, [id]);

//   const imagesArray = useMemo(() => {
//     if (!product?.imagePaths) return [];

//     return Array.isArray(product.imagePaths)
//       ? product.imagePaths
//       : [product.imagePaths];
//   }, [product]);

//   if (!product) return <p>Loading...</p>;

//   return (
//     <div className="container mx-auto p-5 flex flex-col md:flex-row gap-10">

//       {/* IMAGE SECTION */}
//       <div className="flex gap-5">

//         {/* THUMBNAILS */}
//         <div className="flex flex-col gap-2 overflow-y-auto max-h-[500px]">

//           {imagesArray.map((img, i) => (
//             <div
//               key={i}
//               onClick={() => setSelectedImage(img)}
//               className={`border rounded-lg cursor-pointer ${
//                 selectedImage === img
//                   ? 'border-blue-500'
//                   : 'border-gray-200'
//               }`}
//             >

//               <Image
//                 src={buildImageURL(img)}
//                 alt={`thumb-${i}`}
//                 width={60}
//                 height={60}
//                 className="object-contain"
//                 onError={(e) => {
//                   const target = e.target as HTMLImageElement;
//                   target.src = FALLBACK;
//                 }}
//               />

//             </div>
//           ))}

//         </div>

//         {/* MAIN IMAGE */}
//         <div className="relative w-[400px] h-[400px] md:w-[500px] md:h-[500px] border p-2 rounded-lg">

//           <Image
//             src={buildImageURL(selectedImage)}
//             alt={product.name}
//             fill
//             sizes="(max-width:768px) 100vw, 500px"
//             className="object-contain"
//             onError={(e) => {
//               const target = e.target as HTMLImageElement;
//               target.src = FALLBACK;
//             }}
//           />

//         </div>

//       </div>

//       {/* PRODUCT INFO */}
//       <div className="flex-1 flex flex-col gap-4">

//         <h1 className="text-2xl font-bold">{product.name}</h1>

//         <p className="text-green-600 font-medium">
//           4★ 7,032 Ratings & 1,535 Reviews
//         </p>

//         <p className="text-xl font-semibold">
//           ₹{product.price}
//           <span className="line-through text-gray-400 ml-2">
//             ₹{product.mrp}
//           </span>
//           <span className="text-green-600 ml-2">
//             {product.discount || '44%'} off
//           </span>
//         </p>

//         <div className="border p-2 rounded-lg bg-yellow-50 text-sm">
//           Special Price: Get extra ₹400 off on 1 items
//         </div>

//         <div className="flex gap-4 mt-5">

//           <button
//             onClick={() => addToCart(product)}
//             disabled={!product.inStock}
//             className="bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 disabled:bg-gray-300"
//           >
//             Add to Cart
//           </button>

//           <button className="bg-yellow-400 text-black py-3 px-6 rounded-lg hover:bg-yellow-500">
//             Buy Now
//           </button>

//         </div>

//         <div className="mt-5 text-sm">

//           <p><strong>Brand:</strong> {product.brand}</p>
//           <p><strong>Category:</strong> {product.category}</p>
//           <p><strong>Subcategory:</strong> {product.subcategory}</p>
//           <p><strong>Material:</strong> {product.material}</p>

//         </div>

//       </div>
//     </div>
//   );
// };

// export default ProductDetailPage;
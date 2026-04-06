// 'use client';

// import { motion, AnimatePresence } from 'framer-motion';

// interface ToastProps {
//   message: string;
//   show: boolean;
// }

// const Toast: React.FC<ToastProps> = ({ message, show }) => {
//   return (
//     <AnimatePresence>
//       {show && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: 20 }}
//           className="fixed top-5 right-5 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium"
//         >
//           {message}
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default Toast;

import { motion } from "framer-motion";
import { TrendingUp, Shield, CreditCard, DollarSign } from "lucide-react";

const AnimatedCreditVisual = () => {
  return (
    <div className="relative w-full h-64 overflow-hidden">
      {/* Background gradient circles */}
      <motion.div
        className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-60"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute top-20 right-16 w-16 h-16 bg-green-200 rounded-full opacity-50"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Credit Score Circle */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="relative">
          <motion.div
            className="w-32 h-32 border-8 border-blue-200 rounded-full flex items-center justify-center bg-white shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-center">
              <motion.div
                className="text-2xl font-bold text-blue-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                750
              </motion.div>
              <div className="text-xs text-gray-500">Credit Score</div>
            </div>
          </motion.div>
          
          {/* Animated border */}
          <motion.div
            className="absolute inset-0 w-32 h-32 border-4 border-green-400 rounded-full"
            initial={{ rotate: 0, opacity: 0 }}
            animate={{ rotate: 360, opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            style={{
              background: `conic-gradient(from 0deg, #10b981 0deg, #10b981 270deg, transparent 270deg)`
            }}
          />
        </div>
      </motion.div>

      {/* Floating Icons */}
      <motion.div
        className="absolute top-8 left-1/4"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="bg-blue-100 p-3 rounded-full">
          <TrendingUp className="w-6 h-6 text-blue-600" />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 right-1/4"
        animate={{
          y: [0, 10, 0],
          rotate: [0, -5, 5, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <div className="bg-green-100 p-3 rounded-full">
          <Shield className="w-6 h-6 text-green-600" />
        </div>
      </motion.div>

      <motion.div
        className="absolute top-16 right-8"
        animate={{
          x: [0, 5, -5, 0],
          y: [0, -5, 5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <div className="bg-purple-100 p-3 rounded-full">
          <CreditCard className="w-6 h-6 text-purple-600" />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-12 left-8"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      >
        <div className="bg-yellow-100 p-3 rounded-full">
          <DollarSign className="w-6 h-6 text-yellow-600" />
        </div>
      </motion.div>
    </div>
  );
};

export default AnimatedCreditVisual;
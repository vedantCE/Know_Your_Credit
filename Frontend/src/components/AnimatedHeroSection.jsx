import { motion } from "framer-motion";
import { TrendingUp, Shield, CreditCard, Calculator, Users, Award } from "lucide-react";

const AnimatedHeroSection = ({ title, subtitle, showStats = true }) => {
  const stats = [
    { icon: Users, value: "50K+", label: "Happy Users", color: "text-blue-600" },
    { icon: CreditCard, value: "₹100Cr+", label: "Loans Approved", color: "text-green-600" },
    { icon: Award, value: "4.8★", label: "User Rating", color: "text-yellow-600" },
    { icon: Shield, value: "100%", label: "Secure", color: "text-purple-600" },
  ];

  return (
    <div className="relative bg-gradient-to-br from-blue-50/80 via-white/60 to-blue-100/80 py-16 overflow-hidden">
      {/* Background animated elements */}
      <motion.div
        className="absolute top-20 left-10 w-40 h-40 bg-blue-200 rounded-full opacity-10"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-20 w-32 h-32 bg-green-200 rounded-full opacity-10"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            {title || (
              <>
                Know Your{" "}
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Credit
                </span>
              </>
            )}
          </h1>
          
          <motion.p
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {subtitle || "Comprehensive credit management platform with AI-powered financial guidance and personalized loan recommendations."}
          </motion.p>
        </motion.div>

        {/* Floating icons */}
        <div className="relative h-64 mb-12">
          <motion.div
            className="absolute top-8 left-1/4 bg-blue-100 p-4 rounded-full"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </motion.div>

          <motion.div
            className="absolute top-16 right-1/4 bg-green-100 p-4 rounded-full"
            animate={{
              y: [0, 15, 0],
              rotate: [0, -10, 10, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <Shield className="w-8 h-8 text-green-600" />
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-1/3 bg-purple-100 p-4 rounded-full"
            animate={{
              x: [0, 10, -10, 0],
              y: [0, -10, 10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <CreditCard className="w-8 h-8 text-purple-600" />
          </motion.div>

          <motion.div
            className="absolute bottom-12 right-1/3 bg-orange-100 p-4 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
          >
            <Calculator className="w-8 h-8 text-orange-600" />
          </motion.div>

          {/* Central credit score display */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <div className="backdrop-blur-md bg-white/70 rounded-full w-32 h-32 flex items-center justify-center border-2 border-blue-100">
              <div className="text-center">
                <motion.div
                  className="text-3xl font-bold text-blue-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  750+
                </motion.div>
                <div className="text-xs text-gray-600">Credit Score</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats section */}
        {showStats && (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="backdrop-blur-md bg-white/60 rounded-xl p-6 border border-white/20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6 + index * 0.1, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.05,
                  background: "rgba(255, 255, 255, 0.8)",
                  transition: { duration: 0.2 } 
                }}
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AnimatedHeroSection;
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const AnimatedCreditProgress = ({ 
  currentScore = 750, 
  previousScore = 720, 
  maxScore = 900,
  title = "Credit Score Progress" 
}) => {
  const progress = (currentScore / maxScore) * 100;
  const change = currentScore - previousScore;
  const changePercent = ((change / previousScore) * 100).toFixed(1);

  const getScoreColor = (score) => {
    if (score >= 750) return "text-green-600";
    if (score >= 650) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (score) => {
    if (score >= 750) return "from-green-400 to-green-600";
    if (score >= 650) return "from-yellow-400 to-yellow-600";
    return "from-red-400 to-red-600";
  };

  const getTrendIcon = () => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex items-center space-x-1">
          {getTrendIcon()}
          <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '+' : ''}{change} ({changePercent}%)
          </span>
        </div>
      </div>

      {/* Score Display */}
      <div className="text-center mb-6">
        <motion.div
          className={`text-4xl font-bold ${getScoreColor(currentScore)}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          {currentScore}
        </motion.div>
        <div className="text-sm text-gray-500 mt-1">out of {maxScore}</div>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className={`h-3 rounded-full bg-gradient-to-r ${getProgressColor(currentScore)}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
        
        {/* Score markers */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>300</span>
          <span>500</span>
          <span>650</span>
          <span>750</span>
          <span>900</span>
        </div>
      </div>

      {/* Score Categories */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <motion.div
          className={`text-center p-2 rounded ${currentScore >= 750 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="font-semibold">Excellent</div>
          <div>750-900</div>
        </motion.div>
        
        <motion.div
          className={`text-center p-2 rounded ${currentScore >= 650 && currentScore < 750 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className="font-semibold">Good</div>
          <div>650-749</div>
        </motion.div>
        
        <motion.div
          className={`text-center p-2 rounded ${currentScore < 650 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <div className="font-semibold">Fair</div>
          <div>300-649</div>
        </motion.div>
      </div>

      {/* Animated pulse effect for current score */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-blue-400 opacity-0"
        animate={{
          opacity: [0, 0.3, 0],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default AnimatedCreditProgress;
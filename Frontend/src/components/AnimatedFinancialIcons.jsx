import { motion } from "framer-motion";
import { 
  Banknote, 
  PiggyBank, 
  TrendingUp, 
  Shield, 
  CreditCard, 
  Calculator,
  Building2,
  Wallet
} from "lucide-react";

const AnimatedFinancialIcons = () => {
  const icons = [
    { Icon: Banknote, color: "text-green-600", bg: "bg-green-100", delay: 0 },
    { Icon: PiggyBank, color: "text-pink-600", bg: "bg-pink-100", delay: 0.2 },
    { Icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-100", delay: 0.4 },
    { Icon: Shield, color: "text-purple-600", bg: "bg-purple-100", delay: 0.6 },
    { Icon: CreditCard, color: "text-indigo-600", bg: "bg-indigo-100", delay: 0.8 },
    { Icon: Calculator, color: "text-orange-600", bg: "bg-orange-100", delay: 1.0 },
    { Icon: Building2, color: "text-gray-600", bg: "bg-gray-100", delay: 1.2 },
    { Icon: Wallet, color: "text-yellow-600", bg: "bg-yellow-100", delay: 1.4 },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 p-6">
      {icons.map(({ Icon, color, bg, delay }, index) => (
        <motion.div
          key={index}
          className={`${bg} p-4 rounded-xl flex items-center justify-center cursor-pointer`}
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{
            duration: 0.6,
            delay,
            type: "spring",
            stiffness: 100,
          }}
          whileHover={{
            scale: 1.1,
            rotate: 5,
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon className={`w-8 h-8 ${color}`} />
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedFinancialIcons;
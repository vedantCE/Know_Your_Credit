import { motion } from "framer-motion";
import { Home, Car, User, Building } from "lucide-react";

const AnimatedLoanCards = () => {
  const loanTypes = [
    {
      icon: Home,
      title: "Home Loan",
      rate: "8.5%",
      color: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Car,
      title: "Car Loan",
      rate: "9.2%",
      color: "from-green-500 to-green-600",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: User,
      title: "Personal Loan",
      rate: "12.5%",
      color: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: Building,
      title: "Business Loan",
      rate: "11.8%",
      color: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {loanTypes.map((loan, index) => (
        <motion.div
          key={index}
          className={`bg-gradient-to-r ${loan.color} p-4 rounded-xl text-white relative overflow-hidden`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: index * 0.2,
            type: "spring",
            stiffness: 100,
          }}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.2 },
          }}
        >
          {/* Background decoration */}
          <motion.div
            className="absolute -top-4 -right-4 w-16 h-16 bg-white opacity-10 rounded-full"
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
          
          <div className="relative z-10">
            <div className={`${loan.iconBg} p-2 rounded-lg inline-block mb-2`}>
              <loan.icon className={`w-6 h-6 ${loan.iconColor}`} />
            </div>
            <h3 className="font-semibold text-sm">{loan.title}</h3>
            <p className="text-xs opacity-90">Starting from</p>
            <p className="text-lg font-bold">{loan.rate}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedLoanCards;
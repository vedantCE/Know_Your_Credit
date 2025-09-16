import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Users,
  TrendingUp,
  Bell,
  Target,
  FileText,
  BarChart3,
  Globe,
  Star,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedHeroSection from "@/components/AnimatedHeroSection";
import VideoModal from "@/components/VideoModal";


const Index = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const features = [
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      title: "Multi-Bureau Aggregation",
      description: "Combine scores from CIBIL, Experian, Equifax, CRIF and more for a complete picture",
    },
    {
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      title: "Credit Report Analysis",
      description: "Detailed breakdown of your credit report with explanations of each factor affecting your score",
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Real-Time Risk Assessment",
      description: "Advanced algorithms to detect fraud and assess lending risk",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      title: "Credit Score Simulator",
      description: "See how financial decisions might impact your credit score",
    },
    {
      icon: <Bell className="h-8 w-8 text-blue-600" />,
      title: "Credit Alert System",
      description: "Get notified of important changes to your credit report in real-time",
    },
    {
      icon: <Target className="h-8 w-8 text-blue-600" />,
      title: "Score Optimizer",
      description: "Personalized recommendations to improve your credit score effectively",
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Dispute Management",
      description: "Easily identify and resolve credit report errors across all bureaus",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      title: "Credit Monitoring",
      description: "Continuous tracking of your credit profile with monthly updates",
    },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Business Owner",
      content: "This platform helped me improve my credit score by 150 points in just 6 months!",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Software Engineer",
      content: "The multi-bureau aggregation gives me complete visibility into my credit health.",
      rating: 5,
    },
    {
      name: "SBI Bank",
      role: "Financial Institution",
      content: "Real-time risk assessment has reduced our loan default rate by 40%.",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "How accurate are the credit scores?",
      answer: "Our platform aggregates data from all major credit bureaus to provide 99.9% accurate scores.",
    },
    {
      question: "Is my financial data secure?",
      answer: "We use bank-grade encryption and comply with all financial data protection regulations.",
    },
    {
      question: "How often are scores updated?",
      answer: "Credit scores are updated in real-time as new information becomes available from bureaus.",
    },
    {
      question: "Can I dispute errors in my credit report?",
      answer: "Yes, our dispute management system allows you to identify and resolve errors across all bureaus.",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 p-2 rounded-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                Know Your Credit
              </h1>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 mt-1">
                Home Page
              </Badge>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              How It Works
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Testimonials
            </a>
            <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              About Us
            </Link>
            <a href="#faq" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              FAQ
            </a>
          </nav>
          <div className="flex items-center space-x-3">
            <Link to="/signin">
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between gap-12">
            {/* Left side - Content */}
            <div className="flex-1 text-left">
              <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
                Multi-Bureau Credit Scoring Platform
              </Badge>
              <motion.h1 
                className="text-5xl font-bold mb-6 text-gray-900"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Unified Credit Intelligence for
                <span className="text-blue-600"> Smart Lending</span>
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 mb-8 max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Integrate and aggregate credit data from multiple bureaus. Our solution normalizes diverse credit scores into a unified profile, handles bureau downtime gracefully, and optimizes real-time lending decisions.
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div 
                className="flex space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Link to="/credit-lookup">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="lg" className="text-white px-8 bg-blue-600 hover:bg-blue-700">
                      Check Credit Score
                    </Button>
                  </motion.div>
                </Link>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    className="text-lg px-8 bg-transparent border-2 border-blue-600 text-blue-600 transition-colors duration-300 hover:bg-blue-600 hover:text-black"
                    onClick={() => setIsVideoModalOpen(true)}
                  >
                    Watch Demo
                  </Button>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Right side - Animation */}
            <motion.div 
              className="flex-1 hidden lg:block"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <AnimatedHeroSection showStats={false} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <motion.section 
        className="py-12 bg-white/80 backdrop-blur-sm"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, value: "90%", label: "Customer Satisfaction", color: "text-blue-600" },
              { icon: TrendingUp, value: "200K+", label: "Active Users", color: "text-green-600" },
              { icon: FileText, value: "15M+", label: "Credit Reports Generated", color: "text-purple-600" },
              { icon: Globe, value: "50+", label: "Banking Partners", color: "text-yellow-600" }
            ].map((metric, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <metric.icon className={`h-10 w-10 ${metric.color} mb-2`} />
                <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Key Features</h2>
            <p className="text-xl text-gray-600">Powerful tools for both individuals and financial institutions</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-full">
                  <CardHeader className="text-center">
                    <motion.div 
                      className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <CardTitle className="text-lg text-gray-800">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-gray-600">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to access comprehensive credit insights</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-gray-200 shadow-lg">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Connect Your Data</h3>
              <p className="text-gray-600">Securely link your accounts and provide consent for bureau access</p>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-gray-200 shadow-lg">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Analysis & Aggregation</h3>
              <p className="text-gray-600">We aggregate and normalize data from multiple credit bureaus</p>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-gray-200 shadow-lg">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Get Insights</h3>
              <p className="text-gray-600">Receive unified credit profile with actionable recommendations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">What Our Users Say</h2>
            <p className="text-xl text-gray-600">Trusted by thousands of individuals and financial institutions</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-xl">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic text-gray-600">"{testimonial.content}"</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about our platform</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg text-gray-800">
                    {faq.question}
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600">{faq.answer}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Credit Intelligence?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands who trust us with their credit decisions</p>
          <div className="flex justify-center space-x-4">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="text-lg px-18 bg-white text-blue-600 hover:bg-gray-100">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6" />
                <span className="text-xl font-bold">CreditScore</span>
              </div>
              <p className="text-gray-400">Unified credit intelligence for smart lending decisions.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
            <p>&copy; 2025 CreditScore. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Video Modal */}
      <VideoModal 
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoSrc="/KYC Demo.mov"
      />
    </div>
  );
};

export default Index;
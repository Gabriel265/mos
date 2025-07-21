import React from 'react';
import { Check, Plane, Send, MousePointer } from 'lucide-react';

interface PackageFeature {
  text: string;
  included: boolean;
}

interface PackageProps {
  title: string;
  price: number;
  currency: string;
  features: PackageFeature[];
  icon: React.ReactNode;
  isPopular?: boolean;
}

const PackageCard: React.FC<PackageProps> = ({ title, price, currency, features, icon, isPopular = false }) => {
  // Determine background image based on title
  const getBackgroundImage = () => {
    if (title === "Marketing") {
      return 'url(https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)';
    } else if (title === "Personal Assistant") {
      return 'url(https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)';
    } else if (isPopular) {
      return 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)';
    }
    return null;
  };

  const backgroundImage = getBackgroundImage();
  
  return (
    <div className={`relative p-8 rounded-3xl ${isPopular ? 'text-white border-4 border-white shadow-2xl' : backgroundImage ? 'text-gray-800 border-4 border-gray-200 shadow-lg hover:shadow-xl' : 'bg-gray-50 text-gray-800 border-4 border-gray-200 shadow-lg hover:shadow-xl'} flex flex-col items-center text-center w-80 h-96 transition-all duration-300 overflow-hidden`}>
      {backgroundImage && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage }}
          ></div>
          <div className={`absolute inset-0 ${
            isPopular 
              ? 'bg-gradient-to-t from-[#c54d42]/80 via-[#9e1b1b]/60 to-[#c54d42]/40 hover:from-[#9e1b1b]/80 hover:via-[#c54d42]/60 hover:to-[#9e1b1b]/40' 
              : 'bg-white/85 hover:bg-white/90'
          } transition-all duration-500`}></div>
        </>
      )}
      
      <div className="relative z-10 flex flex-col items-center text-center h-full">
        {/* Icon */}
        <div className="mb-4 transform hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        
        {/* Title */}
        {title && (
          <h3 className="text-lg font-bold mb-4 uppercase tracking-wide">{title}</h3>
        )}
        
        {/* Features */}
        <div className="flex-1 space-y-3 mb-4 w-full">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start justify-start text-sm leading-relaxed">
              <Check className="w-4 h-4 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-left">{feature.text}</span>
            </div>
          ))}
        </div>
        
        {/* Price */}
        {price && currency && (
          <div className="text-2xl font-bold">
            {currency}.{price.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

const Business: React.FC = () => {
  const packages = [
    {
      title: "Marketing",
      price: "",
      currency: "",
      icon: <Send className="w-8 h-8" />,
      features: [
        { text: "Search Engine Optimization (SEO)", included: true },
        { text: "Social Media Management", included: true },
        { text: "Brand Building Strategies", included: true },
        { text: "Digital Marketing Campaigns", included: true },
      ]
    },
    {
      title: "",
      price: "",
      currency: "",
      icon: <Plane className="w-12 h-12" />,
      isPopular: true,
      features: [
        { text: "Grow your reach and influence with targeted strategies", included: true },
        { text: "Administrative support for busy professionals", included: true },
        { text: "Custom solutions tailored to your business needs", included: true },
      ]
    },
    {
      title: "Personal Assistant",
      price: "",
      currency: "",
      icon: <MousePointer className="w-8 h-8" />,
      features: [
        { text: "Administrative Tasks", included: true },
        { text: "Scheduling & Calendar Management", included: true },
        { text: "Document & Task Management", included: true },
        { text: "Copywriting Services", included: true },
        { text: "Social Media Management", included: true },
        { text: "Email Marketing", included: true },
        { text: "Content Creation", included: true },
        { text: "Errands & Personal Tasks", included: true },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-8" style={{ backgroundColor: '#fefef7' }}>
      {/* Header */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-between mb-8">
          <div></div>
          
          {/* Decorative dots */}
          <div className="grid grid-cols-3 gap-2">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-500 rounded-full opacity-60 hover:opacity-100 transition-opacity duration-300"></div>
            ))}
          </div>
        </div>
        
        <h1 className="text-5xl font-bold text-gray-800 mb-4 tracking-tight">Marketing & Business</h1>
        <h2 className="text-6xl font-bold text-gray-800 mb-4">Support</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Comprehensive solutions to elevate your business and streamline your operations</p>
      </div>

      {/* Package Cards with improved spacing */}
      <div className="flex justify-center items-center mb-16 max-w-7xl mx-auto relative">
        <div className="flex items-center gap-8">
          {/* Left Card */}
          <div className="transform hover:scale-105 transition-all duration-300 hover:z-30 relative">
            <PackageCard {...packages[0]} />
          </div>
          
          {/* Center Card (Popular) */}
          <div className="transform scale-110 hover:scale-115 transition-all duration-300 z-20 relative">
            <PackageCard {...packages[1]} />
          </div>
          
          {/* Right Card */}
          <div className="transform hover:scale-105 transition-all duration-300 hover:z-30 relative">
            <PackageCard {...packages[2]} />
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mb-12">
        <a 
          href="./Contact" 
          className="inline-block bg-[#c54d42] hover:bg-[#9e1b1b] text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Get Started Today
        </a>
        <p className="text-gray-600 mt-4">Contact us for a customized quote</p>
      </div>

      {/* Footer */}
      <div className="text-center">
        {/* Decorative elements */}
        <div className="flex justify-center items-center mb-6 space-x-8">
          <div className="grid grid-cols-3 gap-2">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-400 rounded-full opacity-50"></div>
            ))}
          </div>
          <div className="w-12 h-12 border-3 border-gray-400 rounded-full flex items-center justify-center hover:border-[#c54d42] transition-colors duration-300">
            <div className="w-6 h-6 bg-gray-400 rounded-full hover:bg-[#c54d42] transition-colors duration-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Business;
import React from 'react';
import { Camera, MessageCircle, ArrowRight, Zap, Clock, Target, TrendingUp } from 'lucide-react';

interface AutomationProps {
  className?: string;
}

const Automation: React.FC<AutomationProps> = ({ className = '' }) => {
  const handleNavClick = (path: string) => {
    console.log(`Navigating to: ${path}`);
  };

  return (
    <div className={`w-full min-h-screen bg-white ${className}`}>
      <div className="w-full px-2 sm:px-4 md:px-8 lg:px-12 py-4 md:py-8 lg:py-12">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
          
          {/* Card 1: Main Webinar Info */}
          <div className="bg-gradient-to-br from-stone-100 to-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 relative overflow-hidden shadow-lg">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-bl from-[#b8934d]/10 to-transparent rounded-full transform translate-x-10 sm:translate-x-16 md:translate-x-20 -translate-y-10 sm:-translate-y-16 md:-translate-y-20"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 bg-gradient-to-tr from-[#b8934d]/15 to-transparent rounded-full transform -translate-x-8 sm:-translate-x-12 md:-translate-x-16 translate-y-8 sm:translate-y-12 md:translate-y-16"></div>
            
            <div className="relative z-10">
              {/* Header Section */}
              <div className="flex flex-col space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                {/* Date and Platform */}
                <div className="text-center sm:text-left">
                  <div className="text-gray-800">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#b8934d]">24H</div>
                    <div className="text-xs sm:text-sm text-gray-600 leading-tight">
                      ChatGPT<br />
                      DALL·E<br />
                      Workflow<br />
                      & process optimization
                    </div>
                  </div>
                </div>
                
                {/* Main content */}
                <div className="w-full">
                  <div className="bg-gradient-to-r from-[#b8934d] to-yellow-500 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-md">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">AI </h1>
                    <h2 className="text-base sm:text-lg md:text-xl text-white/90 mb-3 sm:mb-4">& Automation</h2>
                    
                    {/* Robot illustration */}
                    <div className="flex justify-center">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-white/20 to-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center relative backdrop-blur-sm">
                        <div className="text-2xl sm:text-3xl md:text-4xl">🤖</div>
                        <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-white/30 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="bg-gradient-to-r from-[#b8934d]/10 to-yellow-500/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-4 sm:mb-6 border border-[#0d1a2e]/10">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                  AI <br />
                  Services
                </h3>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-4 sm:mb-6">
                  create content, images, videos,<br />
                  and research with AI<br />
                </p>

                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                  Automation <br />
                  Services
                </h3>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-4 sm:mb-6">
                  Workflow and process optimization<br />
                  Let bots do the work for you.<br />
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Before vs After Automation */}
          <div className="bg-gradient-to-br from-stone-50 to-gray-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 relative overflow-hidden shadow-lg border border-gray-200">
            {/* Futuristic background effects */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-[#b8934d]/5 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 bg-blue-500/3 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute top-3/4 left-3/4 w-12 h-12 sm:w-18 sm:h-18 md:w-24 md:h-24 bg-purple-500/5 rounded-full blur-xl sm:blur-2xl animate-pulse delay-500"></div>
            </div>
            
            {/* Grid pattern overlay - hidden on very small screens */}
            <div className="absolute inset-0 opacity-3 hidden sm:block">
              <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className="border border-[#0d1a2e]/20"></div>
                ))}
              </div>
            </div>
            
            <div className="relative z-10 text-gray-800">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#b8934d] to-yellow-400 bg-clip-text text-transparent mb-2">
                  Before vs. After Automation
                </h2>
                <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#b8934d] to-yellow-400 mx-auto rounded-full"></div>
              </div>
              
              <div className="space-y-6 sm:space-y-8 mb-6 sm:mb-8 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
                {/* Before Section */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-red-500">Before Automation</h3>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    {[
                      'Tedious admin work',
                      'Constant follow-ups',
                      'Missed deadlines',
                      'Staff overwhelmed'
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-3 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg backdrop-blur-sm">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Arrow - only visible on large screens */}
                <div className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="bg-[#b8934d] p-3 rounded-full animate-pulse">
                    <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                {/* Mobile Arrow */}
                <div className="flex justify-center lg:hidden py-2">
                  <div className="bg-[#b8934d] p-2 rounded-full animate-pulse">
                    <ArrowRight className="w-4 h-4 text-white rotate-90" />
                  </div>
                </div>
                
                {/* After Section */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#b8934d]/20 rounded-full flex items-center justify-center">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-[#b8934d]" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-[#b8934d]">After Automation</h3>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    {[
                      'Repetitive tasks handled in seconds',
                      'Auto-reminders & workflows',
                      'On-time project delivery',
                      'Employees focus on growth'
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-3 p-2 sm:p-3 bg-[#b8934d]/5 border border-[#b8934d]/20 rounded-lg backdrop-blur-sm">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#b8934d] rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                        <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Call to Action */}
              <div className="text-center p-4 sm:p-6 bg-gradient-to-r from-[#b8934d]/10 to-yellow-500/10 rounded-xl sm:rounded-2xl border border-[#b8934d]/20 backdrop-blur-sm">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-[#b8934d] mx-auto mb-2 sm:mb-3" />
                <h4 className="text-base sm:text-lg md:text-xl font-bold text-[#b8934d] mb-3 leading-tight">
                  What's stopping you from making the switch?
                </h4>
                <button 
                  onClick={() => handleNavClick('/contact')}
                  className="w-full sm:w-auto bg-[#0d1a2e] hover:bg-[#b8934d] text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">Start Your Transformation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Automation;
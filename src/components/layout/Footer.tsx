import React from 'react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-5">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                  Helping Hand Tutor
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed max-w-md">
                  Empowering Learning & Digital Solutions for the Cambridge Syllabus and Beyond.
                </p>
              </div>
              
              {/* Academic Stats/Badges */}
              <div className="grid grid-cols-2 gap-4 max-w-sm">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">500+</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Students Helped</div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">98%</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Success Rate</div>
                </div>
              </div>
            </div>
            
            {/* Navigation Links */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Quick Links */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">
                  Navigation
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a href="/home" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm font-medium flex items-center group">
                      <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mr-3 group-hover:bg-blue-500 transition-colors"></span>
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="/services" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm font-medium flex items-center group">
                      <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mr-3 group-hover:bg-blue-500 transition-colors"></span>
                      Services
                    </a>
                  </li>
                  <li>
                    <a href="/tutoring" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm font-medium flex items-center group">
                      <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mr-3 group-hover:bg-blue-500 transition-colors"></span>
                      Find Tutors
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm font-medium flex items-center group">
                      <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mr-3 group-hover:bg-blue-500 transition-colors"></span>
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Support */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">
                  Resources
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a href="/contact" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm font-medium flex items-center group">
                      <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mr-3 group-hover:bg-blue-500 transition-colors"></span>
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm font-medium flex items-center group">
                      <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mr-3 group-hover:bg-blue-500 transition-colors"></span>
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm font-medium flex items-center group">
                      <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mr-3 group-hover:bg-blue-500 transition-colors"></span>
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm font-medium flex items-center group">
                      <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mr-3 group-hover:bg-blue-500 transition-colors"></span>
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Social Media & Tech Stack */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-8 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-6 lg:mb-0">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Connect:</span>
                <div className="flex space-x-3">
                  <a href="#" className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              {/* Tech Stack Indicator */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Platform Status: Online</span>
              </div>
            </div>
            
            {/* Academic Badge */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-3 py-2 rounded-full border border-blue-200 dark:border-blue-800">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L3 7v3c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/>
                </svg>
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Cambridge Curriculum</span>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 sm:mb-0 font-medium">
              © {currentYear} Helping Hand Tutor. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
              <span>Built with precision</span>
              <span>•</span>
              <span>Designed for excellence</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
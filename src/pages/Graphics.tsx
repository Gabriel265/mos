import React, { useState, useEffect, useRef } from 'react';
import { Instagram, X, ZoomIn } from 'lucide-react';

interface Service {
  name: string;
  description: string;
}

const Graphics: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const services: Service[] = [
    { name: "Logo Design", description: "Memorable brand identities that make you stand out" },
    { name: "Poster Design", description: "Eye-catching posters that grab attention" },
    { name: "UI/UX Design", description: "User-friendly interfaces that convert" },
    { name: "Brand Identity", description: "Complete branding solutions for your business" },
    { name: "Motion Graphics", description: "Dynamic animations that bring ideas to life" },
    { name: "Podcast Setup", description: "Professional podcast branding and assets" },
    { name: "Content Creation", description: "Engaging visuals for social media" },
    { name: "Canva Templates", description: "Ready-to-use designs for quick deployment" }
  ];

  const getImagePath = (serviceName: string) => {
    return `images/${serviceName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`;
  };

  // Video autoplay functionality
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(console.error);
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  const openImagePopup = (imagePath: string) => {
    setSelectedImage(imagePath);
  };

  const closeImagePopup = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <div className="bg-cream min-h-screen flex items-center justify-center p-2 sm:p-4" style={{ backgroundColor: '#f8f6f0' }}>
        <div className="max-w-6xl w-full bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Dark Section */}
            <div className="bg-slate-800 lg:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center text-white relative min-h-[300px] lg:min-h-[600px]">
              
              {/* Hire Us Badge */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 lg:top-8 lg:right-8">
                <div className="bg-gradient-to-r from-[#b8934d] to-[#b8934d] hover:from-[#b8934d] hover:to-[#b8934d] text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold transform rotate-12 shadow-lg cursor-pointer transition-all duration-300 hover:scale-105">
                  HIRE US TODAY!
                </div>
              </div>

              {/* Video */}
              <div className="relative w-full max-w-xs sm:max-w-sm">
                <video
                  ref={videoRef}
                  className="w-full rounded-lg shadow-xl"
                  controls
                  poster="/logo.jpg"
                  preload="metadata"
                  muted
                  loop
                  playsInline
                >
                  <source src="/graphics-video.mp4" type="video/mp4" />
                  <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* Right Light Section */}
            <div className="lg:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
              {/* Header */}
              <div className="mb-6 sm:mb-8">
                <p className="text-slate-600 text-xs sm:text-sm mb-2">Do you need professional</p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                  Graphic<br />
                  Design
                </h2>
                <div className="inline-block bg-gradient-to-r from-[#b8934d] to-[#b8934d] text-white px-3 sm:px-4 py-1 sm:py-2 rounded font-bold mt-2 text-sm sm:text-base">
                  Services?
                </div>
              </div>

              {/* Services List */}
              <div className="mb-6 sm:mb-8">
                <div className="bg-gradient-to-r from-[#b8934d] to-[#b8934d] text-white px-3 sm:px-4 py-2 rounded-t font-bold text-sm sm:text-base">
                  We Do
                </div>
                <div className="bg-slate-50 p-3 sm:p-4 lg:p-6 rounded-b-lg max-h-96 overflow-y-auto">
                  <div className="space-y-3">
                    {services.map((service, index) => (
                      <div
                        key={index}
                        className="group cursor-pointer bg-white rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] flex items-center gap-3 sm:gap-4"
                        onClick={() => openImagePopup(getImagePath(service.name))}
                      >
                        <div className="h-12 md:h-16 lg:h-20 aspect-square overflow-hidden rounded-lg bg-gray-200 flex-shrink-0 relative group">
                          <img
                            src={getImagePath(service.name)}
                            alt={service.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNHB4IiBmaWxsPSIjOTk5Ij5JbWFnZTwvdGV4dD48L3N2Zz4=';
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                            <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={20} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-800 text-sm sm:text-base mb-1 truncate">{service.name}</h3>
                          <p className="text-xs sm:text-sm text-slate-600 leading-tight line-clamp-2">{service.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Popup Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={closeImagePopup}>
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeImagePopup}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white text-black rounded-full p-1 sm:p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
            >
              <X size={20} />
            </button>
            <img
              src={selectedImage}
              alt="Service preview"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNHB4IiBmaWxsPSIjOTk5Ij5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Graphics;
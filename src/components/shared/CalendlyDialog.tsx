import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import { useState } from 'react'

export default function CalendlyDialog({
  trigger,
}: {
  trigger: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const handleIframeLoad = () => setIsLoading(false)
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-[95vw] max-w-4xl h-[95vh] max-h-[900px] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl bg-white">
        
        {/* Iframe container */}
        <div className="w-full h-full relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 z-10 bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-xs sm:text-sm">Loading calendar...</p>
              </div>
            </div>
          )}
          <iframe
            src="https://calendly.com/gabrielkadiwa/30min"
            title="Schedule with Gabriel"
            allow="camera; microphone"
            onLoad={handleIframeLoad}
            className="w-full h-full border-0"
            style={{
              opacity: isLoading ? 0 : 1,
              transition: 'opacity 0.3s ease-in-out',
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
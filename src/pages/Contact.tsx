import { useState } from 'react'
import { MapPin, Send, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'
import emailjs from '@emailjs/browser'

emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY)

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '', scheduled: false })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (isScheduled: boolean = false) => {
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields')
      return
    }

    const payload = { ...form, scheduled: isScheduled }

    setLoading(true)
    const { error } = await supabase.from('contact_messages').insert(payload)
    setLoading(false)

    if (error) return toast.error(error.message)

    const templateId = isScheduled
      ? import.meta.env.VITE_EMAILJS_TEMPLATE_SCHEDULED
      : import.meta.env.VITE_EMAILJS_TEMPLATE_GENERAL

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        templateId,
        {
          name: form.name,
          email: form.email,
          message: form.message
        }
      )
      toast.success('Message sent!')
      setForm({ name: '', email: '', message: '', scheduled: false })
    } catch (e) {
      toast.error('Failed to send email')
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Map and Contact Info */}
          <div className="lg:w-1/2 bg-gray-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 800 600" fill="none">
                <g stroke="currentColor" strokeWidth="1">
                  {[100, 200, 300, 400, 500].map(y => <line key={y} x1="0" y1={y} x2="800" y2={y} />)}
                  {[100, 200, 300, 400, 500, 600, 700].map(x => <line key={x} x1={x} y1="0" x2={x} y2="600" />)}
                  <path d="M 50 50 Q 200 150 350 100 T 650 200" strokeWidth="2" />
                </g>
              </svg>
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <MapPin className="w-8 h-8 text-gray-900" />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
              </div>
            </div>

            <div className="relative z-10 p-12 h-full flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-4">Contact us</h1>
                <p className="text-gray-300 mb-8">Get in touch with our team</p>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">Our Address</h3>
                  <div className="text-white space-y-1">
                    <p>Lilongwe</p>
                    <p>Malawi</p>
                    <p>Building 41, Office 304</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">Our Contacts</h3>
                  <div className="text-white space-y-1">
                    <p>hello@name.com</p>
                    <p>+7 900 900 90 90</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    {[Facebook, Twitter, Instagram, Youtube].map((Icon, idx) => (
                      <button key={idx} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                        <Icon className="w-5 h-5" />
                      </button>
                    ))}
                  </div>
                  <span className="text-gray-400 text-sm">follow us</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="lg:w-1/2 p-12">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(false) }} className="max-w-md mx-auto space-y-6">
              <div className="mb-8">
                <h2 className="text-sm font-semibold text-gray-400 uppercase mb-4">Reach Out</h2>
              </div>

              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-0 py-4 text-gray-900 placeholder-gray-500 border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none bg-transparent transition-colors"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-0 py-4 text-gray-900 placeholder-gray-500 border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none bg-transparent transition-colors"
                required
              />

              <textarea
                name="message"
                placeholder="Message"
                rows={4}
                value={form.message}
                onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                className="w-full px-0 py-4 text-gray-900 placeholder-gray-500 border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none bg-transparent resize-none transition-colors"
                required
              />

              <div className="flex items-center justify-between pt-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Send className="w-5 h-5" />
                      <span className="text-sm">Schedule Call</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl w-full">
                    <div className="h-[600px]">
                      <iframe
                        src="https://calendly.com/gabrielkadiwa/30min"
                        width="100%"
                        height="100%"
                        title="Schedule with Gabriel"
                        allow="fullscreen; camera; microphone"
                        className="rounded-xl border-none"
                      />
                    </div>
                    <button
                      type="button"
                      className="w-full mt-4 px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800"
                      onClick={() => handleSubmit(true)}
                    >
                      Schedule Call
                    </button>
                  </DialogContent>
                </Dialog>

                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-3 bg-gray-900 text-white rounded-full font-medium transition-all duration-200 ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800 hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Send Message</span>
                      <Send className="w-4 h-4" />
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        
      </div>
    </div>
  )
}

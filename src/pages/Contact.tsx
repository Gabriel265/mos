import { useState } from 'react'
import { MapPin, Send, Facebook, Twitter, Instagram, Youtube, Phone, Mail } from 'lucide-react'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'

// Mock functions to replace external dependencies
const supabase = {
  from: () => ({
    insert: async () => ({ error: null })
  })
}
const toast = {
  error: (msg) => console.log('Error:', msg),
  success: (msg) => console.log('Success:', msg)
}
const emailjs = {
  send: async () => Promise.resolve()
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '', scheduled: false })
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState('')

  const handleSubmit = async (isScheduled = false) => {
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields')
      return
    }

    const payload = { ...form, scheduled: isScheduled }

    setLoading(true)
    const { error } = await supabase.from('contact_messages').insert(payload)
    setLoading(false)

    if (error) return toast.error(error.message)

    try {
      await emailjs.send('service', 'template', {
        name: form.name,
        email: form.email,
        message: form.message
      })
      toast.success('Message sent!')
      setForm({ name: '', email: '', message: '', scheduled: false })
    } catch (e) {
      toast.error('Failed to send email')
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-7xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Left Side - Map and Contact Info */}
          <div className="lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
                {Array.from({ length: 96 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="border border-white/20 animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>

            {/* Floating Geometric Shapes */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/20 rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
              <div className="absolute top-1/3 right-10 w-16 h-16 bg-purple-500/20 rotate-45 animate-pulse" style={{ animationDuration: '2s' }} />
              <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-500/20 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
            </div>

            {/* Central Map Pin */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="relative group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rotate-45 shadow-lg" />
                
                {/* Ripple Effect */}
                <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" />
                <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>

            <div className="relative z-10 p-6 sm:p-8 lg:p-12 h-full flex flex-col justify-between">
              <div className="space-y-4 sm:space-y-6">
                <div className="transform transition-all duration-700 hover:translate-x-2">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Contact us
                  </h1>
                  <p className="text-gray-300 text-sm sm:text-base lg:text-lg">Get in touch with our team</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 sm:gap-8">
                  <div className="group transform transition-all duration-500 hover:translate-x-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-400 uppercase mb-3 flex items-center group-hover:text-blue-400 transition-colors">
                      <MapPin className="w-4 h-4 mr-2" />
                      Our Address
                    </h3>
                    <div className="text-white space-y-1 text-sm sm:text-base">
                      <p className="hover:text-blue-300 transition-colors cursor-pointer">Lilongwe</p>
                      <p className="hover:text-blue-300 transition-colors cursor-pointer">Malawi</p>
                      
                    </div>
                  </div>

                  <div className="group transform transition-all duration-500 hover:translate-x-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-400 uppercase mb-3 flex items-center group-hover:text-green-400 transition-colors">
                      <Phone className="w-4 h-4 mr-2" />
                      Our Contacts
                    </h3>
                    <div className="text-white space-y-2 text-sm sm:text-base">
                      <p className="flex items-center hover:text-green-300 transition-colors cursor-pointer">
                        <Mail className="w-4 h-4 mr-2" />
                        hello@name.com
                      </p>
                      <p className="flex items-center hover:text-green-300 transition-colors cursor-pointer">
                        <Phone className="w-4 h-4 mr-2" />
                        +7 900 900 90 90
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex space-x-3 sm:space-x-4">
                  {[
                    { Icon: Facebook, color: 'hover:bg-blue-600' },
                    { Icon: Twitter, color: 'hover:bg-sky-500' },
                    { Icon: Instagram, color: 'hover:bg-pink-600' },
                    { Icon: Youtube, color: 'hover:bg-red-600' }
                  ].map(({ Icon, color }, idx) => (
                    <button 
                      key={idx} 
                      className={`w-10 h-10 sm:w-12 sm:h-12 bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center ${color} transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:-translate-y-1`}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  ))}
                </div>
                <span className="text-gray-400 text-xs sm:text-sm font-medium tracking-wider">follow us</span>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="lg:w-1/2 p-6 sm:p-8 lg:p-12 flex items-center">
            <div className="w-full max-w-md mx-auto space-y-6 sm:space-y-8">
              <div className="mb-6 sm:mb-8 transform transition-all duration-700 hover:translate-x-1">
                <h2 className="text-sm font-semibold text-gray-400 uppercase mb-4 tracking-wider">Reach Out</h2>
              </div>

              {[
                { name: 'name', type: 'text', placeholder: 'Name' },
                { name: 'email', type: 'email', placeholder: 'E-mail' }
              ].map(({ name, type, placeholder }) => (
                <div key={name} className="relative group">
                  <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={form[name]}
                    onChange={(e) => setForm(f => ({ ...f, [name]: e.target.value }))}
                    onFocus={() => setFocusedField(name)}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-0 py-4 text-gray-900 placeholder-gray-500 border-0 border-b-2 focus:outline-none bg-transparent transition-all duration-300 ${
                      focusedField === name 
                        ? 'border-blue-500 transform scale-105' 
                        : form[name] 
                          ? 'border-green-400' 
                          : 'border-gray-200 group-hover:border-gray-400'
                    }`}
                    required
                  />
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ${
                    focusedField === name ? 'w-full' : 'w-0'
                  }`} />
                </div>
              ))}

              <div className="relative group">
                <textarea
                  name="message"
                  placeholder="Message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full px-0 py-4 text-gray-900 placeholder-gray-500 border-0 border-b-2 focus:outline-none bg-transparent resize-none transition-all duration-300 ${
                    focusedField === 'message' 
                      ? 'border-blue-500 transform scale-105' 
                      : form.message 
                        ? 'border-green-400' 
                        : 'border-gray-200 group-hover:border-gray-400'
                  }`}
                  required
                />
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ${
                  focusedField === 'message' ? 'w-full' : 'w-0'
                }`} />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between pt-6 space-y-4 sm:space-y-0">
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 group"
                    >
                      <div className="p-2 rounded-full bg-gray-100 group-hover:bg-blue-100 transition-colors">
                        <Send className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      </div>
                      <span className="text-sm font-medium">Schedule Call</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent
  className="w-full max-w-3xl bg-white p-0 overflow-hidden rounded-2xl sm:rounded-xl"
  style={{
    height: 'min(90vh, 700px)',
    padding: '0',
    animation: 'slideUp 0.4s ease-out',
    margin: '0 auto',
    borderRadius: '1.25rem',
  }}
>
  <div className="relative h-[75vh] sm:h-[600px]">
    <iframe
      src="https://calendly.com/gabrielkadiwa/30min"
      title="Schedule with Gabriel"
      allow="fullscreen; camera; microphone"
      className="absolute inset-0 w-full h-full border-0 rounded-2xl"
    />
  </div>
  <div className="p-4 sm:p-6">
    <button
      type="button"
      onClick={() => handleSubmit(true)}
      className="w-full px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-full font-medium hover:from-gray-800 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
    >
      Schedule Call
    </button>
  </div>

  <style>{`
    @keyframes slideUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
  `}</style>
</DialogContent>

                </Dialog>

                <button
                  type="submit"
                  disabled={loading}
                  onClick={() => handleSubmit(false)}
                  className={`px-6 sm:px-8 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-full font-medium transition-all duration-300 transform ${
                    loading 
                      ? 'opacity-50 cursor-not-allowed scale-95' 
                      : 'hover:from-gray-800 hover:to-gray-600 hover:shadow-xl hover:scale-105 hover:-translate-y-1'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm sm:text-base">Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 group">
                      <span className="text-sm sm:text-base">Send Message</span>
                      <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
import { useState } from 'react'
import { MapPin, Send, Facebook, Twitter, Instagram, Youtube, Phone, Mail, Clock, CheckCircle, User, AtSign, MessageCircle } from 'lucide-react'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import emailjs from '@emailjs/browser'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'
import CalendlyDialog from '@/components/shared/CalendlyDialog'


export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState('')

  const resetForm = () => setForm({ name: '', email: '', message: '' })

  const handleSubmit = async (isScheduled = false) => {
    const { name, email, message } = form
    if (!name || !email || !message) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    const { error } = await supabase.from('contact_messages').insert([
      { name, email, message, scheduled: isScheduled }
    ])
    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        isScheduled
          ? import.meta.env.VITE_EMAILJS_TEMPLATE_SCHEDULED
          : import.meta.env.VITE_EMAILJS_TEMPLATE_GENERAL,
        { name, email, message },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      toast.success('Message sent!')
      resetForm()
    } catch (err) {
      toast.error('Email failed to send')
      console.error(err)
    }
    setLoading(false)
  }

  const contactInfo = [
    { icon: MapPin, text: 'No 5 Lee Road Office, Number 5, BlackHeath, London, Se3 9RQ', color: 'text-blue-400' },
    { icon: Phone, text: '+44 7301 096908', color: 'text-green-400' },
    { icon: Mail, text: 'helpinhandtutor3@gmail.com', color: 'text-pink-400' }
  ]

  const socialIcons = [
    { icon: Facebook, color: 'hover:text-blue-400' },
    { icon: Twitter, color: 'hover:text-sky-400' },
    { icon: Instagram, color: 'hover:text-pink-400' },
    { icon: Youtube, color: 'hover:text-red-400' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="w-full max-w-7xl bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl border border-white/20">
        <div className="flex flex-col lg:flex-row min-h-[600px] md:min-h-[650px]">
          {/* Left Section - Contact Info */}
          <div className="lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden p-6 sm:p-8 md:p-10 flex flex-col justify-center">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  Get In <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">Touch</span>
                </h1>
                <p className="text-gray-300 text-base sm:text-lg mb-2">We'd love to hear from you.</p>
                <p className="text-gray-400 text-sm sm:text-base">Reach out today and let's start a conversation.</p>
              </div>

              <div className="space-y-6 mb-10">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 group cursor-pointer">
                    <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors duration-300 text-sm sm:text-base">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex space-x-4">
                {socialIcons.map((social, index) => (
                  <div key={index} className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 cursor-pointer transition-all duration-300 group">
                    <social.icon className={`w-5 h-5 text-gray-300 ${social.color} transition-colors duration-300`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Contact Form */}
          <div className="lg:w-1/2 p-6 sm:p-8 md:p-10 flex items-center">
            <div className="w-full space-y-6">
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Send us a message</h2>
                <p className="text-gray-600 text-sm sm:text-base">Fill out the form below and we'll get back to you soon.</p>
              </div>

              <div className="space-y-6">
                {/* Name Field */}
                <div className="relative">
                  <div className="relative">
                    <User className={`absolute left-0 top-3 w-5 h-5 transition-colors duration-300 ${
                      focusedField === 'name' ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField('')}
                      className="w-full border-b-2 border-gray-200 focus:outline-none py-3 pl-8 pr-4 placeholder-gray-500 bg-transparent transition-all duration-300 focus:border-blue-500 text-gray-900"
                    />
                  </div>
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${
                    focusedField === 'name' ? 'w-full' : 'w-0'
                  }`}></div>
                </div>

                {/* Email Field */}
                <div className="relative">
                  <div className="relative">
                    <AtSign className={`absolute left-0 top-3 w-5 h-5 transition-colors duration-300 ${
                      focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={form.email}
                      onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      className="w-full border-b-2 border-gray-200 focus:outline-none py-3 pl-8 pr-4 placeholder-gray-500 bg-transparent transition-all duration-300 focus:border-blue-500 text-gray-900"
                    />
                  </div>
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${
                    focusedField === 'email' ? 'w-full' : 'w-0'
                  }`}></div>
                </div>

                {/* Message Field */}
                <div className="relative">
                  <div className="relative">
                    <MessageCircle className={`absolute left-0 top-3 w-5 h-5 transition-colors duration-300 ${
                      focusedField === 'message' ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                    <textarea
                      name="message"
                      placeholder="Your Message"
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField('')}
                      className="w-full border-b-2 border-gray-200 focus:outline-none py-3 pl-8 pr-4 placeholder-gray-500 bg-transparent transition-all duration-300 focus:border-blue-500 resize-none text-gray-900"
                    />
                  </div>
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${
                    focusedField === 'message' ? 'w-full' : 'w-0'
                  }`}></div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
                
              <CalendlyDialog
                trigger={
                  <button className="px-4 sm:px-6 py-2 sm:py-3 bg-[#5a8a89] hover:bg-[#0d1a2e] rounded-full text-white text-sm sm:text-base font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Schedule a Call
                  </button>
                }
              />



                <button
                  disabled={loading}
                  onClick={() => handleSubmit(false)}
                  className={`group px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 ${
                    loading 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-900'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5  group-hover:translate-x-1 transition-transform duration-300" />
                      <span>Send Message</span>
                    </>
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
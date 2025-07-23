import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const AccordionItem = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-2 border-transparent bg-gradient-to-br from-[#f7f3ed] to-[#ede8e0] rounded-2xl mb-3 sm:mb-4 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative group
      before:absolute before:inset-0 before:rounded-2xl before:p-[2px] before:bg-gradient-to-br before:from-[#5a8a89]/20 before:to-[#7a9ca4]/20 before:-z-10 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-5 sm:px-7 py-5 sm:py-6 text-left hover:bg-gradient-to-r hover:from-[#f7f3ed] hover:to-[#ede8e0] transition-all duration-300 group/btn focus:outline-none focus:ring-2 focus:ring-[#5a8a89]/30 focus:ring-offset-2 rounded-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[#8b9da9]/5 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#5a8a89] group-hover/btn:scale-110 transition-transform duration-300"></div>
          <span className="text-base sm:text-lg font-bold text-[#425a66] group-hover/btn:text-[#2c3a42] transition-colors duration-300">
            {title}
          </span>
        </div>
        <div className="relative flex items-center">
          <ChevronDown
            className={`w-6 h-6 text-[#5a8a89] transform transition-all duration-300 ${
              isOpen ? 'rotate-180 scale-110' : 'group-hover/btn:scale-110 group-hover/btn:text-[#7a9ca4]'
            }`}
          />
        </div>
      </button>
      
      <div className={`transition-all duration-500 ease-out overflow-hidden ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-5 sm:px-7 pb-5 sm:pb-6 bg-gradient-to-br from-[#ede8e0] to-[#f7f3ed] relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-[#5a8a89] rounded-full"></div>
          <div className="space-y-4 sm:space-y-5 pt-4">
            {items.map((item, index) => (
              <div key={index} className="group/item bg-[#f7f3ed] rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-[#ede8e0] hover:border-[#5a8a89]/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#5a8a89]/5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                <div className="relative">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#5a8a89] mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                    <h4 className="font-bold text-[#2c3a42] text-sm sm:text-base group-hover/item:text-[#5a8a89] transition-colors duration-300 leading-tight">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-[#5a8a89] font-semibold text-xs sm:text-sm mb-2 ml-5 italic">
                    {item.subtitle}
                  </p>
                  <p className="text-[#8b9da9] text-xs sm:text-sm leading-relaxed ml-5 group-hover/item:text-[#425a66] transition-colors duration-300">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Services() {
  const groupedServices = [
    {
      title: 'Academic & Tutoring Services',
      items: [
        {
          title: 'Private Tutoring',
          subtitle: 'English, Math, Physics, Chemistry',
          description: 'One-on-one sessions for academic excellence.',
        },
      ],
    },
    {
      title: 'Software & IT Solutions',
      items: [
        {
          title: 'Custom Software Development',
          subtitle: 'Web, Android, and Desktop Apps + Hosting',
          description: 'Bespoke systems built for your needs.',
        },
        {
          title: 'Digital & IT Systems Support',
          subtitle: 'ICT troubleshooting, software setup, networking',
          description: 'Includes DHIS2, system onboarding, and user training.',
        },
      ],
    },
    {
      title: 'Creative & Digital Media',
      items: [
        {
          title: 'Graphic Design',
          subtitle: 'Logos, posters, UI/UX, branding',
          description: 'Creative visuals for all platforms.',
        },
        {
          title: 'Creative & Media Services',
          subtitle: 'Canva, motion graphics, podcast setup',
          description: 'Content tailored for your social & digital presence.',
        },
      ],
    },
    {
      title: 'Marketing & Business Support',
      items: [
        {
          title: 'Marketing Services',
          subtitle: 'SEO, social media, campaigns',
          description: 'Grow your reach and influence.',
        },
        {
          title: 'Personal Assistant',
          subtitle: 'Scheduling, document/task management',
          description: 'Administrative support for busy professionals.',
        },
      ],
    },
    {
      title: 'AI & Automation',
      items: [
        {
          title: 'AI Services',
          subtitle: 'ChatGPT, Jasper, DALL·E',
          description: 'Content, images, videos, and research with AI.',
        },
        {
          title: 'Automation',
          subtitle: 'Workflow and process optimization',
          description: 'Let bots do the work for you.',
        },
      ],
    },
    {
      title: 'Data & Analytics',
      items: [
        {
          title: 'Data Management',
          subtitle: 'Excel, Python, R, Power BI, Tableau',
          description: 'Data cleaning, analysis, and dashboards.',
        },
        {
          title: 'Research & Surveys',
          subtitle: 'KoboToolbox, ODK, MEL, supervision',
          description: 'Design and manage field research efficiently.',
        },
      ],
    },
  ]

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-2">
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-[#5a8a89] rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-[#f7f3ed] rounded-full"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-[#5a8a89] bg-clip-text text-transparent">
            Our Services
          </h2>
          <div className="w-8 h-8 bg-[#5a8a89] rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-[#f7f3ed] rounded-full"></div>
          </div>
        </div>
        <p className="text-[#8b9da9] text-sm sm:text-base max-w-2xl mx-auto">
          Discover our comprehensive range of professional services designed to help you succeed
        </p>
      </div>
      
      <div className="space-y-1">
        {groupedServices.map((group, index) => (
          <AccordionItem key={index} title={group.title} items={group.items} />
        ))}
      </div>
    </section>
  )
}
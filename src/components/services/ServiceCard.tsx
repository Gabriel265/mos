interface ServiceCardProps {
  title: string
  description: string
}

export const ServiceCard = ({ title, description }: ServiceCardProps) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow hover:shadow-lg transition-all">
    <h4 className="text-lg font-semibold mb-2">{title}</h4>
    <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
  </div>
)

import { motion } from 'framer-motion'

interface TutorCardProps {
  name: string
  bio: string
  mode: 'Online' | 'In-person' | 'Both'
  subjects: string[]
  index: number
}

export function TutorCard({ name, bio, mode, subjects, index }: TutorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4"
    >
      <h3 className="text-xl font-semibold mb-1">{name}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{mode}</p>
      <p className="text-sm mb-3 text-gray-700 dark:text-gray-300">{bio}</p>
      <div className="flex flex-wrap gap-2 text-sm">
        {subjects.map((subj, i) => (
          <span
            key={i}
            className="bg-blue-100 dark:bg-blue-900 dark:text-white text-blue-800 px-2 py-1 rounded-full"
          >
            {subj}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

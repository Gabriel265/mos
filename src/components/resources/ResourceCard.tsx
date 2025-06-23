import { FaFilePdf, FaFileWord, FaFileExcel, FaLink, FaYoutube } from 'react-icons/fa'
import ReactPlayer from 'react-player'

type Resource = {
  id: string
  title: string
  type: string
  link: string | null
  external_link: string | null
}

export const ResourceCard = ({ resource }: { resource: Resource }) => {
  const fileIcon = () => {
    const t = resource.type.toLowerCase()
    if (t.includes('pdf')) return <FaFilePdf className="text-red-500" />
    if (t.includes('doc')) return <FaFileWord className="text-blue-500" />
    if (t.includes('excel') || t.includes('xls')) return <FaFileExcel className="text-green-500" />
    if (resource.external_link?.includes('youtube')) return <FaYoutube className="text-red-600" />
    return <FaLink className="text-gray-500" />
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow hover:shadow-lg transition">
      <div className="flex items-center gap-2 mb-2 text-lg font-semibold">
        {fileIcon()} <span>{resource.title}</span>
      </div>

      {resource.external_link?.includes('youtube') ? (
        <div className="aspect-video">
          <ReactPlayer
            url={resource.external_link}
            controls
            width="100%"
            height="100%"
          />
        </div>
      ) : (
        <a
          href={resource.link || resource.external_link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary underline"
        >
          Open Resource
        </a>
      )}
    </div>
  )
}

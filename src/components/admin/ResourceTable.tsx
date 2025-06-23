import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'

export const ResourceTable = () => {
  const [resources, setResources] = useState([])

  const fetch = async () => {
    const { data } = await supabase.from('resources')
      .select('*, subject:subject_id(name)')
      .order('created_at', { ascending: false })
    setResources(data || [])
  }

  const archive = async (id: string) => {
    await supabase.from('resources').update({ archived: true }).eq('id', id)
    fetch()
  }

  useEffect(() => { fetch() }, [])

  return (
    <div className="overflow-auto mt-6">
      <h3 className="text-xl font-bold mb-2">All Resources</h3>
      <table className="w-full text-sm table-auto border">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th>Title</th><th>Subject</th><th>Level</th><th>Type</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((r: any) => (
            <tr key={r.id} className={r.archived ? 'opacity-50' : ''}>
              <td>{r.title}</td>
              <td>{r.subject?.name}</td>
              <td>{r.level}</td>
              <td>{r.type?.split('/')[1]}</td>
              <td>
                {!r.archived && (
                  <button onClick={() => archive(r.id)} className="text-red-500">
                    Archive
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

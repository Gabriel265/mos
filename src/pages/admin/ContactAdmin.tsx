import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'
import AdminLayout from '@/components/layout/AdminLayout'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  scheduled: boolean
  archived: boolean
  created_at: string
}

export default function ContactAdmin() {
  const [msgs, setMsgs] = useState<ContactMessage[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'archived'>('active')
  const [selected, setSelected] = useState<ContactMessage | null>(null)

  useEffect(() => {
    const fetchMsgs = async () => {
      let query = supabase.from('contact_messages').select('*')

      if (filter === 'active') query = query.eq('archived', false)
      if (filter === 'archived') query = query.eq('archived', true)

      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) {
        toast.error(error.message)
        return
      }
      setMsgs(data || [])
    }

    fetchMsgs()
  }, [filter])

  const toggleArchive = async (msg: ContactMessage) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ archived: !msg.archived })
      .eq('id', msg.id)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success(msg.archived ? 'Unarchived' : 'Archived')
    setSelected(null)
    // Refetch updated list
    const updated = msgs.map(m => m.id === msg.id ? { ...m, archived: !m.archived } : m)
    setMsgs(updated)
  }

  const deleteMsg = async (msg: ContactMessage) => {
    if (!confirm('Delete this message permanently?')) return

    const { error } = await supabase.from('contact_messages').delete().eq('id', msg.id)
    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Deleted')
    setSelected(null)
    setMsgs(msgs.filter(m => m.id !== msg.id))
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">📨 Contact Messages</h1>

        <div className="flex gap-2 mb-4">
          {(['active', 'archived', 'all'] as const).map(f => (
            <Button
              key={f}
              variant={filter === f ? 'primary' : 'outline'}
              onClick={() => setFilter(f)}
            >
              {f === 'active' ? 'Inbox' : f === 'archived' ? 'Archived' : 'All'}
            </Button>
          ))}
        </div>

        <div className="grid gap-3">
          {msgs.map(msg => (
            <div
              key={msg.id}
              className="p-4 rounded shadow hover:shadow-md bg-white dark:bg-gray-800 cursor-pointer"
              onClick={() => setSelected(msg)}
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">
                    {msg.name} {msg.scheduled && <span className="text-sm text-green-600">(Scheduled)</span>}
                  </p>
                  <p className="text-sm text-gray-500">{msg.email}</p>
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(msg.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          ))}

          {msgs.length === 0 && (
            <p className="text-center text-gray-500">No messages here.</p>
          )}
        </div>

        {selected && (
          <Dialog open onOpenChange={() => setSelected(null)}>
            <DialogTrigger asChild />
            <DialogContent>
              <h2 className="text-xl font-semibold mb-2">{selected.name}</h2>
              <p className="mb-1"><strong>Email:</strong> {selected.email}</p>
              <p className="mb-4"><strong>Received:</strong> {new Date(selected.created_at).toLocaleString()}</p>
              <p className="whitespace-pre-wrap mb-4">{selected.message}</p>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => toggleArchive(selected)}>
                  {selected.archived ? 'Unarchive' : 'Archive'}
                </Button>
                <Button variant="destructive" onClick={() => deleteMsg(selected)}>
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  )
}

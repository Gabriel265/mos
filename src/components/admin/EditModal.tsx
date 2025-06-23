import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function EditModal({
  type,
  item,
  onClose,
  onSaved
}: {
  type: 'category' | 'service'
  item: any
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState({ ...item })
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!(form.name || form.title)) {
      toast.error('Name or title is required')
      return
    }

    setLoading(true)
    const table = type === 'category' ? 'service_categories' : 'services'
    const { error } = await supabase.from(table).update(form).eq('id', item.id)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success(`${type === 'category' ? 'Category' : 'Service'} updated`)
      onSaved()
      onClose()
    }

    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className={cn(
        'bg-card text-card-foreground w-full max-w-md rounded-xl shadow-xl p-6 space-y-4 animate-in fade-in zoom-in-95'
      )}>
        <h2 className="text-xl font-bold">
          Edit {type === 'category' ? 'Category' : 'Service'}
        </h2>

        <Input
          placeholder={type === 'category' ? 'Category Name' : 'Service Title'}
          value={form.name || form.title}
          onChange={e =>
            setForm(prev => ({
              ...prev,
              ...(type === 'category'
                ? { name: e.target.value }
                : { title: e.target.value })
            }))
          }
        />

        <Textarea
          placeholder="Description"
          value={form.description || ''}
          onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  )
}

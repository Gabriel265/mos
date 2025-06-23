import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function ServiceForm({ categories, onSaved }: { categories: any[], onSaved: () => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !categoryId) {
      toast.error('Title and category are required')
      return
    }
    setLoading(true)
    const { error } = await supabase.from('services').insert({
      title,
      description,
      category_id: categoryId
    })
    if (error) {
      toast.error('Error saving service')
    } else {
      toast.success('Service added successfully')
      setTitle('')
      setDescription('')
      setCategoryId('')
      onSaved()
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card text-card-foreground shadow-glass rounded-xl p-6 space-y-4 animate-fade-in"
    >
      <h2 className="font-bold text-xl">Add Service</h2>
      <Input
        type="text"
        placeholder="Service Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <Textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <select
        value={categoryId}
        onChange={e => setCategoryId(e.target.value)}
        required
        className="w-full p-2 rounded-md border bg-background text-foreground dark:border-muted"
      >
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Saving...' : 'Add Service'}
      </Button>
    </form>
  )
}

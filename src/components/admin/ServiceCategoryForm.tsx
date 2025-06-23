import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function ServiceCategoryForm({ onSaved }: { onSaved: () => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Category name is required')
      return
    }

    setLoading(true)
    const { error } = await supabase.from('categories').insert({ name, description })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Category added')
      setName('')
      setDescription('')
      onSaved()
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card text-card-foreground rounded-xl shadow-glass p-6 space-y-4 animate-fade-in"
    >
      <h2 className="font-bold text-xl">Add Category</h2>
      <Input
        placeholder="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Saving...' : 'Add Category'}
      </Button>
    </form>
  )
}

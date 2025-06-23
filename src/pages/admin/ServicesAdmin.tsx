import { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { ServiceCategoryForm } from '@/components/admin/ServiceCategoryForm'
import { ServiceForm } from '@/components/admin/ServiceForm'
import EditModal from '@/components/admin/EditModal'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '@/components/layout/AdminLayout'
import { toast } from 'sonner'

const PAGE_SIZE = 3

export default function ServicesAdmin() {
  const [categories, setCategories] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [editType, setEditType] = useState<'category' | 'service' | null>(null)
  const [filter, setFilter] = useState<'all' | 'archived' | 'unarchived'>('all')
  const observerRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  const fetchCategories = async (append = false, pageOverride?: number) => {
    setLoading(true)
    const activePage = pageOverride ?? page
    const from = (activePage - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
      .from('categories')
      .select('*, services:services(*)')
      .order('created_at', { ascending: false })
      .range(from, to)

    if (filter === 'archived') {
      query = query.eq('archived', true)
    } else if (filter === 'unarchived') {
      query = query.eq('archived', false)
    }

    const { data, error } = await query

    if (!error) {
      if (data.length < PAGE_SIZE) setHasMore(false)
      setCategories(prev => append ? [...prev, ...data] : data)
    }

    setLoading(false)
  }

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1)
    }
  }, [hasMore, loading])

  useEffect(() => {
    fetchCategories(page > 1, page)
  }, [page, filter])

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) navigate('/admin/login')
    }
    checkAuth()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { threshold: 1 }
    )
    if (observerRef.current) observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [loadMore])

  const confirmAndToggleArchive = async (table: string, id: string, archived: boolean) => {
    const confirmed = window.confirm(`Are you sure you want to ${archived ? 'unarchive' : 'archive'} this item?`)
    if (!confirmed) return
    await supabase.from(table).update({ archived: !archived }).eq('id', id)
    setPage(1)
    setHasMore(true)
    fetchCategories(false, 1)
  }

  const openEditModal = (type: 'category' | 'service', item: any) => {
    setEditType(type)
    setEditingItem(item)
  }

  const deleteItem = async (table: string, id: string, name: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)
    if (!confirmed) return

    if (table === 'categories') {
      const { error: serviceErr } = await supabase.from('services').delete().eq('category_id', id)
      if (serviceErr) {
        toast.error('Failed to delete related services.')
        return
      }
    }

    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) {
      toast.error(`Failed to delete ${table.slice(0, -1)}.`)
    } else {
      toast.success(`${table.slice(0, -1)} deleted successfully.`)
      setPage(1)
      setHasMore(true)
      fetchCategories(false, 1)
    }
  }

  return (
    <AdminLayout>
      <div className="p-4 max-w-screen-lg mx-auto space-y-8 bg-background text-foreground">
        <h1 className="text-3xl font-bold text-center animate-fade-in">Services Admin Panel</h1>

        {/* Filter Dropdown */}
        <div className="flex justify-end">
          <select
            value={filter}
            onChange={e => {
              setPage(1)
              setHasMore(true)
              setFilter(e.target.value as 'all' | 'archived' | 'unarchived')
            }}
            className="p-2 border rounded-md text-sm bg-card text-card-foreground dark:border-muted"
          >
            <option value="all">All</option>
            <option value="unarchived">Unarchived</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ServiceCategoryForm onSaved={() => { setPage(1); setHasMore(true); fetchCategories(false, 1) }} />
          <ServiceForm categories={categories} onSaved={() => { setPage(1); setHasMore(true); fetchCategories(false, 1) }} />
        </div>

        {categories.map(cat => (
          <div key={cat.id} className="mt-8 rounded-xl shadow-glass p-6 bg-card text-card-foreground transition duration-300">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">{cat.name}</h2>
              <div className="flex gap-3 text-sm">
                <button onClick={() => openEditModal('category', cat)} className="text-cambridgeBlue hover:underline">Edit</button>
                <button onClick={() => confirmAndToggleArchive('categories', cat.id, cat.archived)} className="text-warningAmber hover:underline">
                  {cat.archived ? 'Unarchive' : 'Archive'}
                </button>
                <button onClick={() => deleteItem('categories', cat.id, cat.name)} className="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{cat.description}</p>

            <div className="mt-4 grid md:grid-cols-2 gap-4">
              {cat.services?.map((s: any) => (
                <div key={s.id} className="bg-muted text-muted-foreground p-4 rounded-lg hover:shadow-md transition-transform duration-200">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{s.title}</h3>
                      <p className="text-sm text-muted-foreground">{s.description}</p>
                    </div>
                    <div className="text-right text-xs space-y-1">
                      <button onClick={() => openEditModal('service', s)} className="text-electricBlue hover:underline block">Edit</button>
                      <button onClick={() => confirmAndToggleArchive('services', s.id, s.archived)} className="text-cyberOrange hover:underline block">
                        {s.archived ? 'Unarchive' : 'Archive'}
                      </button>
                      <button onClick={() => deleteItem('services', s.id, s.title)} className="text-red-500 hover:underline block">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {loading && <p className="text-center text-muted-foreground">Loading more...</p>}
        <div ref={observerRef} className="h-10" />

        {editType && editingItem && (
          <EditModal
            type={editType}
            item={editingItem}
            onClose={() => setEditType(null)}
            onSaved={() => { setPage(1); setHasMore(true); fetchCategories(false, 1) }}
          />
        )}
      </div>
    </AdminLayout>
  )
}

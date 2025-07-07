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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-7xl">
          
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Services Admin Panel
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Manage your service categories and offerings
            </p>
          </div>

          {/* Filter Section */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span className="hidden sm:inline">Filter:</span>
              <select
                value={filter}
                onChange={e => {
                  setPage(1)
                  setHasMore(true)
                  setFilter(e.target.value as 'all' | 'archived' | 'unarchived')
                }}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <option value="all">All Items</option>
                <option value="unarchived">Active Only</option>
                <option value="archived">Archived Only</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>{categories.length} categories loaded</span>
            </div>
          </div>

          {/* Forms Section */}
          <div className="mb-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Add Category
                </h2>
                <ServiceCategoryForm onSaved={() => { setPage(1); setHasMore(true); fetchCategories(false, 1) }} />
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Add Service
                </h2>
                <ServiceForm categories={categories} onSaved={() => { setPage(1); setHasMore(true); fetchCategories(false, 1) }} />
              </div>
            </div>
          </div>

          {/* Categories List */}
          <div className="space-y-6">
            {categories.map(cat => (
              <div 
                key={cat.id} 
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Category Header */}
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-750 dark:to-slate-700 p-4 sm:p-6 border-b border-slate-200 dark:border-slate-600">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 truncate">
                          {cat.name}
                        </h2>
                        {cat.archived && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Archived
                          </span>
                        )}
                      </div>
                      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 line-clamp-2">
                        {cat.description}
                      </p>
                    </div>
                    
                    {/* Category Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => openEditModal('category', cat)} 
                        className="px-3 py-1.5 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-lg transition-all duration-200 hover:scale-105"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => confirmAndToggleArchive('categories', cat.id, cat.archived)} 
                        className="px-3 py-1.5 text-xs sm:text-sm font-medium text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 rounded-lg transition-all duration-200 hover:scale-105"
                      >
                        {cat.archived ? 'Unarchive' : 'Archive'}
                      </button>
                      <button 
                        onClick={() => deleteItem('categories', cat.id, cat.name)} 
                        className="px-3 py-1.5 text-xs sm:text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-all duration-200 hover:scale-105"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Services Grid */}
                <div className="p-4 sm:p-6">
                  {cat.services?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {cat.services.map((service: any) => (
                        <div 
                          key={service.id} 
                          className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all duration-200 hover:scale-105 group"
                        >
                          <div className="flex flex-col h-full">
                            <div className="flex-1 mb-3">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm sm:text-base line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {service.title}
                                </h3>
                                {service.archived && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 ml-2 flex-shrink-0">
                                    Archived
                                  </span>
                                )}
                              </div>
                              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                                {service.description}
                              </p>
                            </div>
                            
                            {/* Service Actions */}
                            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-600">
                              <button 
                                onClick={() => openEditModal('service', service)} 
                                className="px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded transition-all duration-200 hover:scale-105"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => confirmAndToggleArchive('services', service.id, service.archived)} 
                                className="px-2 py-1 text-xs font-medium text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 rounded transition-all duration-200 hover:scale-105"
                              >
                                {service.archived ? 'Unarchive' : 'Archive'}
                              </button>
                              <button 
                                onClick={() => deleteItem('services', service.id, service.title)} 
                                className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded transition-all duration-200 hover:scale-105"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">No services in this category yet</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">Loading more categories...</span>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && categories.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">No categories found</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Get started by creating your first service category above.</p>
            </div>
          )}

          {/* Intersection Observer Target */}
          <div ref={observerRef} className="h-1" />

          {/* Edit Modal */}
          {editType && editingItem && (
            <EditModal
              type={editType}
              item={editingItem}
              onClose={() => setEditType(null)}
              onSaved={() => { setPage(1); setHasMore(true); fetchCategories(false, 1) }}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
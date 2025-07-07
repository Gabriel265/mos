import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'
import AdminLayout from '@/components/layout/AdminLayout'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Search, Inbox, Archive, List, Calendar, User, Mail, Clock, Trash2, ArchiveRestore, Eye, Filter } from 'lucide-react'

interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  scheduled: boolean
  archived: boolean
  created_at: string
}

const PAGE_SIZE = 10

export default function ContactAdmin() {
  const [msgs, setMsgs] = useState<ContactMessage[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'archived'>('active')
  const [selected, setSelected] = useState<ContactMessage | null>(null)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    const fetchMsgs = async () => {
      setLoading(true)

      let query = supabase.from('contact_messages').select('*', { count: 'exact' })

      if (filter === 'active') query = query.eq('archived', false)
      else if (filter === 'archived') query = query.eq('archived', true)

      if (searchTerm.trim()) {
        // Case-insensitive partial search on name OR email
        query = query
          .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      }

      query = query.order('created_at', { ascending: false })

      const from = (page - 1) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1
      query = query.range(from, to)

      const { data, count, error } = await query

      if (error) {
        toast.error(error.message)
        setLoading(false)
        return
      }

      setMsgs(data || [])
      setTotalCount(count || 0)
      setLoading(false)
    }

    fetchMsgs()
  }, [filter, page, searchTerm])

  const handleFilterChange = (newFilter: 'all' | 'active' | 'archived') => {
    setFilter(newFilter)
    setPage(1)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setPage(1)
  }

  const openDialog = (msg: ContactMessage) => {
    setSelected(msg)
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setSelected(null)
  }

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
    closeDialog()

    setMsgs(msgs.map(m => (m.id === msg.id ? { ...m, archived: !m.archived } : m)))
  }

  const deleteMsg = async (msg: ContactMessage) => {
    if (!confirm('Delete this message permanently?')) return

    const { error } = await supabase.from('contact_messages').delete().eq('id', msg.id)
    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Deleted')
    closeDialog()
    setMsgs(msgs.filter(m => m.id !== msg.id))
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const filterOptions = [
    { value: 'active', label: 'Inbox', icon: Inbox, color: 'bg-blue-500 hover:bg-blue-600' },
    { value: 'archived', label: 'Archived', icon: Archive, color: 'bg-gray-500 hover:bg-gray-600' },
    { value: 'all', label: 'All', icon: List, color: 'bg-purple-500 hover:bg-purple-600' }
  ]

  const getMessagePreview = (message: string) => {
    return message.length > 100 ? message.substring(0, 100) + '...' : message
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Contact Messages</h1>
          </div>
          <p className="text-gray-600">Manage and respond to customer inquiries</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => {
                const Icon = option.icon
                const isActive = filter === option.value
                return (
                  <Button
                    key={option.value}
                    onClick={() => handleFilterChange(option.value as any)}
                    disabled={loading}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                      isActive
                        ? `${option.color} text-white shadow-lg transform scale-105`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{option.label}</span>
                  </Button>
                )
              })}
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full lg:w-80 pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-300"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">Loading messages...</p>
              </div>
            </div>
          )}

          {!loading && msgs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">No messages here</p>
              <p className="text-gray-400 text-sm mt-1">
                {filter === 'active' ? 'Your inbox is empty' : 
                 filter === 'archived' ? 'No archived messages' : 'No messages found'}
              </p>
            </div>
          )}

          {!loading && msgs.length > 0 && (
            <div className="divide-y divide-gray-200">
              {msgs.map((msg, index) => (
                <div
                  key={msg.id}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-all duration-300 group"
                  onClick={() => openDialog(msg)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {msg.name}
                            </h3>
                            {msg.scheduled && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <Calendar className="w-3 h-3 mr-1" />
                                Scheduled
                              </span>
                            )}
                            {msg.archived && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                <Archive className="w-3 h-3 mr-1" />
                                Archived
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">{msg.email}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {getMessagePreview(msg.message)}
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-4 text-right">
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(msg.created_at)}</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-gray-700 font-medium">
                Showing {(page - 1) * PAGE_SIZE + 1} -{' '}
                {Math.min(page * PAGE_SIZE, totalCount)} of {totalCount} messages
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1 || loading}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition-all duration-300 disabled:opacity-50"
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        disabled={loading}
                        className={`w-10 h-10 rounded-full font-medium transition-all duration-300 ${
                          page === pageNum
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <Button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages || loading}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition-all duration-300 disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Message Detail Modal */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-white text-gray-900 shadow-xl rounded-xl p-6 max-w-2xl max-h-[90vh] overflow-y-auto z-50">

            {selected && (
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selected.name}</h2>
                      <p className="text-gray-600">{selected.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selected.scheduled && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <Calendar className="w-4 h-4 mr-1" />
                        Scheduled
                      </span>
                    )}
                    {selected.archived && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        <Archive className="w-4 h-4 mr-1" />
                        Archived
                      </span>
                    )}
                  </div>
                </div>

                {/* Message Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Received: {new Date(selected.created_at).toLocaleString()}</span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Message:</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3">
                  <Button
                    onClick={() => toggleArchive(selected)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition-all duration-300"
                  >
                    {selected.archived ? (
                      <>
                        <ArchiveRestore className="w-4 h-4" />
                        <span>Unarchive</span>
                      </>
                    ) : (
                      <>
                        <Archive className="w-4 h-4" />
                        <span>Archive</span>
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => deleteMsg(selected)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
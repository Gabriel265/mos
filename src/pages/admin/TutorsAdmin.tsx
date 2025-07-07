import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import AdminLayout from '@/components/layout/AdminLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'

interface Subject {
  id: string
  name: string
}

interface Tutor {
  id: string
  name: string
  bio: string
  mode: 'Online' | 'In-person' | 'Both'
  profile_url: string | null
  archived: boolean
  created_at: string
  updated_at: string
}

export default function TutorsAdmin() {
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [form, setForm] = useState<any>(initForm())
  const [openId, setOpenId] = useState<string | null>(null)

  function initForm() {
    return {
      id: '',
      name: '',
      bio: '',
      mode: 'Online',
      profile_url: '',
      file: null,
      subjectIds: [] as string[],
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data: tutorData } = await supabase
      .from('tutors')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: subjectData } = await supabase
      .from('subjects')
      .select('*')
      .eq('archived', false)

    if (tutorData && subjectData) {
      setSubjects(subjectData)

      const tutorsWithSubjects = await Promise.all(
        tutorData.map(async (tutor) => {
          const { data: linkData } = await supabase
            .from('tutor_subjects')
            .select('subject_id')
            .eq('tutor_id', tutor.id)

          const subjectIds = linkData?.map(l => l.subject_id) || []
          return { ...tutor, subjectIds }
        })
      )

      setTutors(tutorsWithSubjects)
    }
  }

  function openEdit(tutor: Tutor & { subjectIds: string[] }) {
    setForm({ ...tutor, file: null })
    setOpenId(tutor.id)
  }

  async function handleSubmit() {
    const isEdit = !!form.id
    let profile_url = form.profile_url

    if (form.file) {
      const ext = form.file.name.split('.').pop()
      const fileName = `${Date.now()}.${ext}`
      const { data, error } = await supabase
        .storage
        .from('tutorspictures')
        .upload(fileName, form.file, { upsert: true })

      if (error || !data) {
        toast.error('Upload failed')
        return
      }

      const { data: publicUrl } = supabase
        .storage
        .from('tutorspictures')
        .getPublicUrl(data.path)

      profile_url = publicUrl.publicUrl
    }

    const payload = {
      name: form.name,
      bio: form.bio,
      mode: form.mode,
      profile_url,
      updated_at: new Date().toISOString(),
    }

    let tutorId = form.id
    if (isEdit) {
      const { error } = await supabase.from('tutors').update(payload).eq('id', tutorId)
      if (error) return toast.error(error.message)
    } else {
      const { data, error } = await supabase
        .from('tutors')
        .insert({ ...payload, created_at: new Date().toISOString() })
        .select()
        .single()
      if (error || !data) return toast.error('Create failed')
      tutorId = data.id
    }

    // Sync subject links
    await supabase.from('tutor_subjects').delete().eq('tutor_id', tutorId)
    const newLinks = form.subjectIds.map((subject_id: string) => ({
      tutor_id: tutorId,
      subject_id
    }))
    if (newLinks.length) {
      const { error } = await supabase.from('tutor_subjects').insert(newLinks)
      if (error) toast.error('Subject links failed')
    }

    toast.success(isEdit ? 'Tutor updated' : 'Tutor created')
    setForm(initForm())
    setOpenId(null)
    fetchData()
  }

  async function archiveTutor(id: string) {
    if (!confirm('Are you sure?')) return
    const { error } = await supabase
      .from('tutors')
      .update({ archived: true, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) toast.error(error.message)
    else toast.success('Archived')
    fetchData()
  }

  const activeTutors = tutors.filter(t => !t.archived)

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-3 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-cyan-600 rounded-2xl mb-4 sm:mb-6">
              <span className="text-2xl sm:text-3xl">👨‍🏫</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2 sm:mb-4">
              Tutors Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto mb-6 sm:mb-8">
              Manage your tutors, their profiles, and subject specializations
            </p>
            
            <Dialog open={openId === 'new'} onOpenChange={(v) => setOpenId(v ? 'new' : null)}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => setForm(initForm())}
                  className="bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-600 hover:to-cyan-700 
                           text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium text-sm sm:text-base
                           transition-all duration-200 transform hover:scale-105 active:scale-95
                           shadow-lg hover:shadow-xl"
                >
                  <span className="mr-2">➕</span>
                  Add New Tutor
                </Button>
              </DialogTrigger>
              <TutorDialogContent
                form={form}
                setForm={setForm}
                subjects={subjects}
                onSubmit={handleSubmit}
              />
            </Dialog>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tutors</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{activeTutors.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">👥</span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Online Tutors</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {activeTutors.filter(t => t.mode === 'Online' || t.mode === 'Both').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">💻</span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In-Person Tutors</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {activeTutors.filter(t => t.mode === 'In-person' || t.mode === 'Both').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">🏢</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tutors Grid */}
          <div className="grid gap-4 sm:gap-6">
            {activeTutors.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="text-6xl sm:text-8xl mb-4 opacity-50">👨‍🏫</div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No tutors yet
                </h3>
                <p className="text-gray-500 dark:text-gray-500 text-sm sm:text-base">
                  Add your first tutor to get started
                </p>
              </div>
            ) : (
              activeTutors.map((tutor) => (
                <div key={tutor.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 
                                               hover:shadow-xl transition-all duration-200 overflow-hidden">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {/* Profile Image */}
                      <div className="flex-shrink-0 self-center sm:self-start">
                        {tutor.profile_url ? (
                          <img
                            src={tutor.profile_url}
                            alt={`${tutor.name}'s profile`}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full border-4 border-gray-200 dark:border-gray-600 shadow-md"
                          />
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-2xl sm:text-3xl text-white">👤</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                              {tutor.name}
                            </h2>
                            
                            {/* Mode Badge */}
                            <div className="flex items-center gap-2 mb-3">
                              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium
                                            ${tutor.mode === 'Online' 
                                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                              : tutor.mode === 'In-person'
                                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                <div className={`w-2 h-2 rounded-full mr-2 
                                              ${tutor.mode === 'Online' 
                                                ? 'bg-green-500' 
                                                : tutor.mode === 'In-person'
                                                ? 'bg-purple-500'
                                                : 'bg-blue-500'}`}></div>
                                {tutor.mode === 'Online' && '💻 Online'}
                                {tutor.mode === 'In-person' && '🏢 In-person'}
                                {tutor.mode === 'Both' && '🌐 Both'}
                              </div>
                            </div>

                            {/* Bio */}
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                              {tutor.bio}
                            </p>

                            {/* Subjects */}
                            <div className="flex flex-wrap gap-2">
                              {tutor.subjectIds.map((id) => {
                                const subj = subjects.find(s => s.id === id)
                                return subj ? (
                                  <span
                                    key={id}
                                    className="px-2 sm:px-3 py-1 rounded-full bg-gradient-to-r from-indigo-100 to-cyan-100 
                                             text-indigo-800 dark:from-indigo-900/30 dark:to-cyan-900/30 dark:text-indigo-400 
                                             text-xs sm:text-sm font-medium"
                                  >
                                    {subj.name}
                                  </span>
                                ) : null
                              })}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-start flex-shrink-0">
                            <Dialog open={openId === tutor.id} onOpenChange={(v) => setOpenId(v ? tutor.id : null)}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  onClick={() => openEdit(tutor)}
                                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                                           text-white border-0 px-4 py-2 rounded-lg font-medium text-sm
                                           transition-all duration-200 transform hover:scale-105 active:scale-95
                                           shadow-md hover:shadow-lg"
                                >
                                  ✏️ Edit
                                </Button>
                              </DialogTrigger>
                              <TutorDialogContent
                                form={form}
                                setForm={setForm}
                                subjects={subjects}
                                onSubmit={handleSubmit}
                              />
                            </Dialog>
                            <Button 
                              variant="destructive" 
                              onClick={() => archiveTutor(tutor.id)}
                              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                                       text-white px-4 py-2 rounded-lg font-medium text-sm
                                       transition-all duration-200 transform hover:scale-105 active:scale-95
                                       shadow-md hover:shadow-lg"
                            >
                              🗄️ Archive
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

function TutorDialogContent({ form, setForm, subjects, onSubmit }: any) {
  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 bg-white dark:bg-gray-900 
                              text-black dark:text-white rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-cyan-600 rounded-2xl mb-4">
          <span className="text-xl sm:text-2xl">👨‍🏫</span>
        </div>
        <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
          {form.id ? 'Edit Tutor' : 'Add New Tutor'}
        </DialogTitle>
        <DialogDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
          {form.id ? 'Update the tutor\'s information below' : 'Fill in the tutor\'s information below'}
        </DialogDescription>
      </div>

      <div className="space-y-6">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Enter tutor's full name"
            value={form.name}
            onChange={(e) => setForm((f: any) => ({ ...f, name: e.target.value }))}
            className="w-full p-3 sm:p-4 border border-gray-300 dark:border-gray-600 rounded-xl 
                     bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     transition-all duration-200"
          />
        </div>

        {/* Bio Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bio <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Tell us about the tutor's background and experience"
            value={form.bio}
            onChange={(e) => setForm((f: any) => ({ ...f, bio: e.target.value }))}
            className="w-full p-3 sm:p-4 border border-gray-300 dark:border-gray-600 rounded-xl 
                     bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     transition-all duration-200"
          />
        </div>

        {/* Mode Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Teaching Mode <span className="text-red-500">*</span>
          </label>
          <Select
            value={form.mode}
            onValueChange={(val) => setForm((f: any) => ({ ...f, mode: val }))}
          >
            <SelectTrigger className="w-full p-3 sm:p-4 border border-gray-300 dark:border-gray-600 rounded-xl 
                                    bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                                    transition-all duration-200">
              <SelectValue placeholder="Select teaching mode" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg">
              <SelectItem value="Online" className="hover:bg-gray-100 dark:hover:bg-gray-700 p-3">
                <div className="flex items-center gap-2">
                  <span>💻</span>
                  <span>Online</span>
                </div>
              </SelectItem>
              <SelectItem value="In-person" className="hover:bg-gray-100 dark:hover:bg-gray-700 p-3">
                <div className="flex items-center gap-2">
                  <span>🏢</span>
                  <span>In-person</span>
                </div>
              </SelectItem>
              <SelectItem value="Both" className="hover:bg-gray-100 dark:hover:bg-gray-700 p-3">
                <div className="flex items-center gap-2">
                  <span>🌐</span>
                  <span>Both</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Subjects Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Subject Specializations
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-40 overflow-y-auto p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800">
            {subjects.map((subj: Subject) => (
              <label key={subj.id} className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.subjectIds.includes(subj.id)}
                  onChange={() =>
                    setForm((f: any) => ({
                      ...f,
                      subjectIds: f.subjectIds.includes(subj.id)
                        ? f.subjectIds.filter((id: string) => id !== subj.id)
                        : [...f.subjectIds, subj.id]
                    }))
                  }
                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{subj.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Profile Picture */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Profile Picture
          </label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm((f: any) => ({
                ...f,
                file: e.target.files?.[0] || null
              }))
            }
            className="w-full p-3 sm:p-4 border border-gray-300 dark:border-gray-600 rounded-xl 
                     bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     transition-all duration-200"
          />
          {form.profile_url && (
            <div className="mt-4 flex justify-center">
              <div className="relative">
                <img
                  src={form.profile_url}
                  alt="Profile preview"
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full border-4 border-gray-200 dark:border-gray-600 shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button 
          onClick={onSubmit} 
          className="w-full bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-600 hover:to-cyan-700 
                   text-white px-6 py-3 sm:py-4 rounded-xl font-medium text-sm sm:text-base
                   transition-all duration-200 transform hover:scale-105 active:scale-95
                   shadow-lg hover:shadow-xl"
          disabled={!form.name.trim() || !form.bio.trim()}
        >
          {form.id ? '✅ Update Tutor' : '➕ Create Tutor'}
        </Button>
      </div>
    </DialogContent>
  )
}
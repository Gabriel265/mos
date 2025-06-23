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

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tutors Admin</h1>
          <Dialog open={openId === 'new'} onOpenChange={(v) => setOpenId(v ? 'new' : null)}>
            <DialogTrigger asChild>
              <Button onClick={() => setForm(initForm())}>Add Tutor</Button>
            </DialogTrigger>
            <TutorDialogContent
              form={form}
              setForm={setForm}
              subjects={subjects}
              onSubmit={handleSubmit}
            />
          </Dialog>
        </div>

        <div className="grid gap-4">
          {tutors.filter(t => !t.archived).map((tutor) => (
            <div key={tutor.id} className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {tutor.profile_url && (
                    <img
                      src={tutor.profile_url}
                      alt="Profile"
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  )}
                  <div>
                    <h2 className="font-semibold text-lg">{tutor.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{tutor.mode}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Dialog open={openId === tutor.id} onOpenChange={(v) => setOpenId(v ? tutor.id : null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => openEdit(tutor)}>Edit</Button>
                    </DialogTrigger>
                    <TutorDialogContent
                      form={form}
                      setForm={setForm}
                      subjects={subjects}
                      onSubmit={handleSubmit}
                    />
                  </Dialog>
                  <Button variant="destructive" onClick={() => archiveTutor(tutor.id)}>Archive</Button>
                </div>
              </div>
              <p className="text-sm mt-2">{tutor.bio}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {tutor.subjectIds.map((id) => {
                  const subj = subjects.find(s => s.id === id)
                  return subj ? (
                    <span
                      key={id}
                      className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-white text-xs"
                    >
                      {subj.name}
                    </span>
                  ) : null
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}

function TutorDialogContent({ form, setForm, subjects, onSubmit }: any) {
  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto p-6 sm:p-8 bg-white dark:bg-gray-900 text-black dark:text-white rounded-md shadow-xl">

      <DialogTitle className="text-xl font-bold">
        {form.id ? 'Edit Tutor' : 'Add Tutor'}
      </DialogTitle>
      <DialogDescription className="text-sm text-muted-foreground mb-4">
        Fill in the tutor's information below.
      </DialogDescription>

      <div className="space-y-4">
        <Input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((f: any) => ({ ...f, name: e.target.value }))}
        />
        <Input
          placeholder="Bio"
          value={form.bio}
          onChange={(e) => setForm((f: any) => ({ ...f, bio: e.target.value }))}
        />
        <Select
          value={form.mode}
          onValueChange={(val) => setForm((f: any) => ({ ...f, mode: val }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Online">Online</SelectItem>
            <SelectItem value="In-person">In-person</SelectItem>
            <SelectItem value="Both">Both</SelectItem>
          </SelectContent>
        </Select>

        <div>
          <label className="block font-medium mb-1">Subjects</label>
          <div className="grid grid-cols-2 gap-2">
            {subjects.map((subj: Subject) => (
              <label key={subj.id} className="flex items-center gap-2 text-sm">
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
                />
                {subj.name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Profile Picture</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm((f: any) => ({
                ...f,
                file: e.target.files?.[0] || null
              }))
            }
          />
          {form.profile_url && (
            <img
              src={form.profile_url}
              alt="Preview"
              className="w-20 h-20 mt-2 object-cover rounded-full"
            />
          )}
        </div>

        <Button onClick={onSubmit} className="w-full">
          {form.id ? 'Update' : 'Create'} Tutor
        </Button>
      </div>
    </DialogContent>
  )
}

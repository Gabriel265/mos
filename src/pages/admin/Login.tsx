import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else navigate('/admin/resources')
  }

  return (
    <div className="max-w-sm mx-auto py-10">
      <h2 className="text-xl font-bold mb-4">Admin Login</h2>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full mb-2 p-2 border rounded"
      />
      <button onClick={login} className="bg-primary text-cyan px-4 py-2 rounded w-full">
        Sign In
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}

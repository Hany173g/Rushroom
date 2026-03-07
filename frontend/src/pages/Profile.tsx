import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Container from '../components/Container'
import { useToast } from '../hooks/useToast'
import { apiFetch } from '../lib/api'
import { getErrorMessage } from '../lib/errorHandling'
import { getUserFromToken, removeAccessToken } from '../lib/auth'

interface UserProfile {
  _id: string
  name: string
  email: string
  googleId: string
  photo?: string
  status: string
  gender?: string
  role: string
  createdAt: string
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { showToast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [errorShown, setErrorShown] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editGender, setEditGender] = useState<'male' | 'female' | ''>('')
  const [editPhoto, setEditPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get ID from URL params, or fallback to current user's ID
        const userId = id || getUserFromToken()?._id || getUserFromToken()?.id
        
        if (!userId) {
          if (!errorShown) {
            showToast('معرف المستخدم غير موجود', 'error')
            setErrorShown(true)
          }
          setLoading(false)
          return
        }

        const response = await apiFetch(`/user/getUserProfile?id=${userId}`)
        const data = await response.json()
        setProfile(data.user)
        setIsOwner(data.isOwner)
        setEditName(data.user.name || '')
        setEditGender(data.user.gender as 'male' | 'female' || '')
      } catch (err: any) {
        if (!errorShown) {
          const message = err?.message?.includes('id') || err?.message?.includes('معرف')
            ? 'معرف المستخدم غير صحيح'
            : getErrorMessage(err)
          showToast(message, 'error')
          setErrorShown(true)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [id]) // Re-fetch when ID changes

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    try {
      const formData = new FormData()
      
      // Only send changed fields
      const changedData: any = {}
      if (editName !== profile.name) changedData.name = editName
      if (editGender !== profile.gender) changedData.gender = editGender
      
      // Add userData as JSON string
      if (Object.keys(changedData).length > 0) {
        formData.append('userData', JSON.stringify(changedData))
      }
      
      // Add photo if selected
      if (editPhoto) {
        formData.append('image', editPhoto)
      }
      
      const response = await apiFetch('/user/updateProfileData', {
        method: 'PATCH',
        body: formData
      })
      
      const data = await response.json()
      
      // Update profile with new data from server
      if (data.userUpdate) {
        setProfile({ ...profile, ...data.userUpdate })
      } else {
        // Fallback: update locally
        setProfile({ ...profile, name: editName, gender: editGender })
      }
      
      // Clear photo states
      setEditPhoto(null)
      setPhotoPreview(null)
      setIsEditing(false)
      showToast('تم تحديث الملف الشخصي بنجاح', 'success')
    } catch (err) {
      showToast(getErrorMessage(err), 'error')
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setEditPhoto(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleLogout = () => {
    removeAccessToken()
    showToast('تم تسجيل الخروج بنجاح', 'success')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-3 border-slate-900 border-t-transparent" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">لم يتم العثور على الملف الشخصي</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-sm font-extrabold text-white shadow-lg">
                R
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">Rushroom</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                الرئيسية
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </Container>
      </header>

      <main className="py-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            {/* Profile Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
              {/* Cover Photo */}
              <div className="h-48 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              {/* Profile Info */}
              <div className="px-8 pb-8">
                {/* Avatar */}
                <div className="relative -mt-20 mb-6">
                  <div className="h-36 w-36 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                    <img
                      src={profile.photo || 'https://res.cloudinary.com/dtt1a0arw/image/upload/v1772754757/download_1_bhbkyx.png'}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {isOwner && (
                    <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Name & Status */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{profile.name}</h1>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      profile.status === 'Approved' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {profile.status === 'Approved' ? 'مفعل' : 'معلق'}
                    </span>
                  </div>
                </div>

                {/* Edit Button - Only for Owner */}
                {isOwner && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full mb-8 flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    تعديل الملف الشخصي
                  </button>
                )}

                {/* Edit Form - Only for Owner when editing */}
                {isOwner && isEditing && (
                  <div className="mb-8 bg-white rounded-2xl p-6 border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">تعديل الملف الشخصي</h3>
                    
                    {/* Photo Upload */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">الصورة الشخصية</label>
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-slate-200">
                          <img
                            src={photoPreview || profile?.photo || 'https://res.cloudinary.com/dtt1a0arw/image/upload/v1772754757/download_1_bhbkyx.png'}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <label className="flex-1 cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                          />
                          <div className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-medium text-slate-700 text-center transition-colors">
                            اختيار صورة
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Name Input */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">الاسم</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        placeholder="أدخل اسمك"
                      />
                    </div>

                    {/* Gender Select */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-700 mb-2">النوع</label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setEditGender('male')}
                          className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                            editGender === 'male'
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          ذكر
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditGender('female')}
                          className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                            editGender === 'female'
                              ? 'border-pink-500 bg-pink-50 text-pink-700'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          أنثى
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
                      >
                        {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        disabled={saving}
                        className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-200 transition-colors disabled:opacity-50"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-slate-50 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-slate-600">النوع</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-900">
                      {profile.gender === 'male' ? 'ذكر' : profile.gender === 'female' ? 'أنثى' : 'غير محدد'}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-slate-600">الدور</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-900">
                      {profile.role === 'admin' ? 'مدير' : 'مستخدم'}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5 md:col-span-2">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-slate-600">تاريخ الانضمام</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-900">
                      {new Date(profile.createdAt).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  )
}

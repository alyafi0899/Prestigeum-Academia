import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { dataService } from '../data/dataService'

const STEP_TITLES = [
  'Training Information',
  'Participant Information',
  'Participant Background',
  'Training Insights',
  'Confirmation',
]

const STATUS_OPTIONS = ['Student', 'Fresh Graduate', 'Entry-Level Engineer', 'Junior Engineer', 'Professional / Experienced', 'Other']
const FIELD_OPTIONS = ['Civil Engineering', 'Architecture', 'Urban & Regional Planning', 'Mechanical Engineering', 'Industrial Engineering', 'Aerospace Engineering', 'Materials Engineering', 'Metallurgical Engineering', 'Chemical Engineering', 'Environmental Engineering', 'Mining Engineering', 'Geophysical Engineering', 'Petroleum Engineering', 'Geological Engineering', 'Electrical Engineering', 'Computer Engineering', 'Other']
const SOURCE_OPTIONS = ['Instagram', 'LinkedIn', 'WhatsApp', 'Telegram', 'Campus / University', 'Friend / Colleague Recommendation', 'Community / Organization', 'Other']
const FAMILIARITY_OPTIONS = ['No Prior Knowledge', 'Basic Understanding', 'Some Knowledge / Exposure', 'Practical Experience']

export default function Register() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [training, setTraining] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    whatsapp: user?.wa_number || '',
    city: '',
    institution: '',
    jobTitle: '',
    status: '',
    field: '',
    years: '',
    source: '',
    familiarity: '',
    expectation: '',
    confirmed: '',
    consent: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (id) {
      dataService.getTrainingById(id)
        .then(setTraining)
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [id])

  if (loading) return <div className="p-10 text-center">Loading training details...</div>
  if (!training) return <div className="p-10 text-center">Training not found. <Link to="/training" className="text-[#A577D5]">Go back</Link></div>

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (step === 2) {
      if (!form.fullName.trim()) e.fullName = 'Full name is required'
      if (!form.email.trim()) e.email = 'Email is required'
      if (!form.whatsapp.trim()) e.whatsapp = 'WhatsApp number is required'
      if (!form.city.trim()) e.city = 'City is required'
    }
    if (step === 3) {
      if (!form.status) e.status = 'Please select your current status'
      if (!form.field) e.field = 'Please select your engineering field'
    }
    if (step === 5) {
      if (!form.confirmed) e.confirmed = 'Please confirm your participation'
      if (!form.consent) e.consent = 'You must confirm data consent'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = async () => {
    if (!validate()) return
    if (step < 5) {
      setStep((s) => s + 1)
    } else {
      if (!user) {
        navigate('/login', { state: { from: window.location.pathname } })
        return
      }

      try {
        await dataService.createRegistration({
          user_id: user.id,
          training_id: training.id,
          status: 'Registered'
        })
        navigate(`/training/${id}/register/success`, { state: { form, training } })
      } catch (err) {
        console.error('Registration failed:', err)
        setErrors({ submit: 'Failed to submit registration. Please try again.' })
      }
    }
  }

  const inputClass = (field: string) =>
    `w-full border ${errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#A577D5] focus:ring-2 focus:ring-[#A577D5]/20 transition-all text-gray-800 placeholder-gray-400`

  return (
    <div className="min-h-screen bg-[#F2EFFD]">
      {/* Header */}
      <div className="bg-[#2F2454] px-6 py-5">
        <div className="max-w-3xl mx-auto">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">Prestigium Academia</p>
          <h1 className="text-white font-bold text-base md:text-lg">Training Registration</h1>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#2F2454]">Step {step} of 5</span>
            <span className="text-xs text-gray-500">{STEP_TITLES[step - 1]}</span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex-1 h-2 rounded-full overflow-hidden bg-gray-100">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: s <= step ? '100%' : '0%', background: s < step ? '#A577D5' : s === step ? '#2F2454' : 'transparent' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            {/* Step 1: Training Info */}
            {step === 1 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#2F2454] text-white flex items-center justify-center font-bold">1</div>
                  <div>
                    <h2 className="font-bold text-[#2F2454] text-lg">Training Information</h2>
                    <p className="text-xs text-gray-500">Review the training details before proceeding.</p>
                  </div>
                </div>
                <div className="bg-[#F2EFFD] rounded-2xl p-5 mb-5">
                  <div className="relative h-36 rounded-xl overflow-hidden mb-4">
                    <img src={training.image_url} alt={training.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2F2454]/60 to-transparent" />
                    <span className="absolute bottom-3 left-3 bg-[#A577D5] text-white text-xs font-semibold px-2.5 py-1 rounded-full">{training.category}</span>
                  </div>
                  <h3 className="font-bold text-[#2F2454] text-base mb-2">{training.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{training.shortDesc}</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {[['📅 Date', training.date], ['⏰ Time', training.time], ['⏱ Duration', training.duration], ['📍 Location', training.location.split(',')[0]], ['👤 Instructor', training.instructor.split(',')[0]], ['🎓 Level', training.level]].map(([l, v]) => (
                      <div key={l as string} className="bg-white rounded-xl p-3">
                        <p className="text-gray-400 mb-0.5">{l as string}</p>
                        <p className="font-semibold text-gray-700 text-xs">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-700">
                  <strong>Note:</strong> The information you provide will be used for training administration, attendance, communication, and certificate purposes.
                </div>
              </div>
            )}

            {/* Step 2: Participant Info */}
            {step === 2 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#2F2454] text-white flex items-center justify-center font-bold">2</div>
                  <div>
                    <h2 className="font-bold text-[#2F2454] text-lg">Participant Information</h2>
                    <p className="text-xs text-gray-500">Data Diri Peserta</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Full Name <span className="text-red-400">*</span></label>
                    <input value={form.fullName} onChange={(e) => set('fullName', e.target.value)} placeholder="Your full legal name" className={inputClass('fullName')} />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email Address <span className="text-red-400">*</span></label>
                    <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="your@email.com" className={inputClass('email')} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">WhatsApp Number <span className="text-red-400">*</span></label>
                    <input value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="+62 8xx xxxx xxxx" className={inputClass('whatsapp')} />
                    {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">City of Residence <span className="text-red-400">*</span></label>
                    <input value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="e.g. Jakarta" className={inputClass('city')} />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Institution / Company <span className="text-gray-400">(optional)</span></label>
                    <input value={form.institution} onChange={(e) => set('institution', e.target.value)} placeholder="Your employer or university" className={inputClass('institution')} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Job Title <span className="text-gray-400">(optional)</span></label>
                    <input value={form.jobTitle} onChange={(e) => set('jobTitle', e.target.value)} placeholder="e.g. Site Engineer" className={inputClass('jobTitle')} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Background */}
            {step === 3 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#2F2454] text-white flex items-center justify-center font-bold">3</div>
                  <div>
                    <h2 className="font-bold text-[#2F2454] text-lg">Participant Background</h2>
                    <p className="text-xs text-gray-500">Latar Belakang Peserta</p>
                  </div>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-3 block">Current Status <span className="text-red-400">*</span></label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                      {STATUS_OPTIONS.map((o) => (
                        <button key={o} type="button" onClick={() => set('status', o)}
                          className={`py-2.5 px-4 rounded-xl text-sm font-medium border transition-all text-left ${form.status === o ? 'bg-[#2F2454] text-white border-[#2F2454]' : 'bg-white border-gray-200 text-gray-600 hover:border-[#A577D5]'}`}>
                          {o}
                        </button>
                      ))}
                    </div>
                    {errors.status && <p className="text-red-500 text-xs mt-2">{errors.status}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-3 block">Engineering Field <span className="text-red-400">*</span></label>
                    <select value={form.field} onChange={(e) => set('field', e.target.value)}
                      className={`${inputClass('field')} cursor-pointer`}>
                      <option value="">Select your engineering field</option>
                      {FIELD_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                    {errors.field && <p className="text-red-500 text-xs mt-1">{errors.field}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Years of Experience <span className="text-gray-400">(optional)</span></label>
                    <input value={form.years} onChange={(e) => set('years', e.target.value)} placeholder="e.g. 3 years" className={inputClass('years')} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Insights */}
            {step === 4 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#2F2454] text-white flex items-center justify-center font-bold">4</div>
                  <div>
                    <h2 className="font-bold text-[#2F2454] text-lg">Training Insights</h2>
                    <p className="text-xs text-gray-500">Insight Peserta</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">How did you hear about this training?</label>
                    <div className="flex flex-wrap gap-2">
                      {SOURCE_OPTIONS.map((o) => (
                        <button key={o} type="button" onClick={() => set('source', o)}
                          className={`py-2 px-4 rounded-full text-sm font-medium border transition-all ${form.source === o ? 'bg-[#2F2454] text-white border-[#2F2454]' : 'bg-white border-gray-200 text-gray-600 hover:border-[#A577D5]'}`}>
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">How familiar are you with this topic?</label>
                    <div className="flex flex-col gap-2">
                      {FAMILIARITY_OPTIONS.map((o) => (
                        <button key={o} type="button" onClick={() => set('familiarity', o)}
                          className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all text-left flex items-center gap-3 ${form.familiarity === o ? 'bg-[#2F2454] text-white border-[#2F2454]' : 'bg-white border-gray-200 text-gray-600 hover:border-[#A577D5]'}`}>
                          <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${form.familiarity === o ? 'border-white' : 'border-gray-300'}`}>
                            {form.familiarity === o && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">What do you expect to gain from this training?</label>
                    <textarea value={form.expectation} onChange={(e) => set('expectation', e.target.value)}
                      rows={4} placeholder="Tell us what you want to learn, understand, or improve through this training."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#A577D5] focus:ring-2 focus:ring-[#A577D5]/20 transition-all text-gray-800 placeholder-gray-400 resize-none" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Confirmation */}
            {step === 5 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#2F2454] text-white flex items-center justify-center font-bold">5</div>
                  <div>
                    <h2 className="font-bold text-[#2F2454] text-lg">Registration Confirmation</h2>
                    <p className="text-xs text-gray-500">Konfirmasi Pendaftaran</p>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-[#F2EFFD] rounded-2xl p-5 mb-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Registration Summary</p>
                  <div className="space-y-2.5">
                    {[['Training', training.title], ['Participant', form.fullName], ['Date', training.date], ['Time', training.time], ['Location', training.location.split(',')[0]], ['Instructor', training.instructor.split(',')[0]]].map(([l, v]) => (
                      <div key={l as string} className="flex items-start justify-between gap-4 text-sm">
                        <span className="text-gray-400 shrink-0">{l as string}</span>
                        <span className="font-semibold text-gray-800 text-right">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Participation */}
                <div className="mb-5">
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Participation Confirmation <span className="text-red-400">*</span></label>
                  {['Yes, I confirm my participation', 'I am unable to participate'].map((o) => (
                    <button key={o} type="button" onClick={() => set('confirmed', o)}
                      className={`w-full mb-2 py-3 px-4 rounded-xl text-sm font-medium border transition-all text-left flex items-center gap-3 ${form.confirmed === o ? 'bg-[#2F2454] text-white border-[#2F2454]' : 'bg-white border-gray-200 text-gray-600 hover:border-[#A577D5]'}`}>
                      <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${form.confirmed === o ? 'border-white' : 'border-gray-300'}`}>
                        {form.confirmed === o && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      {o}
                    </button>
                  ))}
                  {errors.confirmed && <p className="text-red-500 text-xs mt-1">{errors.confirmed}</p>}
                </div>

                {/* Consent */}
                <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${form.consent ? 'border-[#A577D5] bg-[#F2EFFD]' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                  <input type="checkbox" checked={form.consent} onChange={(e) => set('consent', e.target.checked)} className="w-4 h-4 mt-0.5 rounded accent-[#A577D5] shrink-0" />
                  <span className="text-xs text-gray-600 leading-relaxed">
                    I confirm that the information I provide is accurate and may be used for training registration, communication, administration, attendance, and certificate issuance.
                  </span>
                </label>
                {errors.consent && <p className="text-red-500 text-xs mt-1">{errors.consent}</p>}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            {step > 1 ? (
              <button onClick={() => setStep((s) => s - 1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-medium text-sm transition-colors">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 4L5 8l5 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Back
              </button>
            ) : (
              <Link to={`/training/${id}`} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-medium text-sm transition-colors">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 4L5 8l5 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Back to Training
              </Link>
            )}
            <button onClick={next}
              className="bg-[#2F2454] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#A577D5] transition-all text-sm">
              {step === 5 ? 'Submit Registration' : 'Continue →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useLocation, Link } from 'react-router'

export default function RegisterSuccess() {
  const loc = useLocation()
  const { form, training } = (loc.state || {}) as { form: Record<string, string>; training: { title: string; date: string; location: string; instructor: string } }
  const regId = `PA-${Date.now().toString().slice(-8)}`

  if (!training) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-500 mb-4">No registration data found.</p>
        <Link to="/training" className="text-[#A577D5] hover:underline">Browse Training</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F2EFFD] flex items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* Success header */}
          <div className="bg-gradient-to-br from-[#2F2454] to-[#5b3d9e] px-8 py-10 text-center">
            <div className="w-20 h-20 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-4">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                <svg width="28" height="28" fill="none" stroke="#2F2454" strokeWidth="3" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <h1 className="text-white text-2xl font-bold mb-2">Registration Confirmed!</h1>
            <p className="text-white/70 text-sm">Your registration has been successfully submitted.</p>
          </div>

          <div className="px-8 py-6">
            {/* Registration details */}
            <div className="bg-[#F2EFFD] rounded-2xl p-5 mb-6 space-y-3">
              {[
                ['Registration ID', regId],
                ['Training', training.title],
                ['Participant', form?.fullName || 'Participant'],
                ['Date', training.date],
                ['Location', (training.location || '').split(',')[0]],
                ['Status', 'Registered ✓'],
              ].map(([l, v]) => (
                <div key={l as string} className="flex items-start justify-between gap-4">
                  <span className="text-xs text-gray-400 shrink-0">{l as string}</span>
                  <span className={`text-xs font-semibold text-right ${l === 'Status' ? 'text-green-600' : 'text-gray-800'}`}>{v}</span>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-xs text-blue-700">
              Training information and reminders will be available in your dashboard. Check your WhatsApp for updates.
            </div>

            <div className="flex flex-col gap-3">
              <Link to="/dashboard" className="w-full bg-[#2F2454] text-white text-sm font-semibold py-3.5 rounded-xl text-center hover:bg-[#A577D5] transition-all">
                Go to Dashboard
              </Link>
              <Link to="/training" className="w-full border border-gray-200 text-gray-600 text-sm font-medium py-3.5 rounded-xl text-center hover:bg-gray-50 transition-all">
                Browse More Training
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

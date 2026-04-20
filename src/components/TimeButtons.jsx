function TimeButtons({ onTimeIn, onTimeOut, onRequestOvertime, activeTimeIn }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

      {/* TIME IN */}
      <button
        onClick={onTimeIn}
        disabled={!!activeTimeIn}
        className={`${
          activeTimeIn
            ? "bg-slate-700 cursor-not-allowed p-6 rounded-2xl shadow-lg text-left border border-slate-800/20"
            : "bg-teal-600/80 hover:bg-teal-500/80 transition p-6 rounded-2xl shadow-lg text-left border border-teal-400/20"
        }`}
      >
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#09e9da">
            <polygon points="5,3 19,12 5,21"/>
          </svg>
          <h3 className="text-lg font-semibold">Time In</h3>
        </div>
        <p className="text-green-100 text-sm mt-1">Start your work session</p>
      </button>

      {/* TIME OUT */}
      <button
        onClick={onTimeOut}
        className="bg-amber-600/80 hover:bg-amber-500/80 transition p-6 rounded-2xl shadow-lg text-left border border-amber-400/20"
      >
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24">
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
          </svg>
          <h3 className="text-lg font-semibold">Time Out</h3>
        </div>
        <p className="text-red-100 text-sm mt-1">End your work session</p>
      </button>

      {/* REQUEST OVERTIME */}
      <button
        onClick={onRequestOvertime}
        className="bg-green-600/80 hover:bg-green-500/80 transition p-6 rounded-2xl shadow-lg text-left border border-green-400/20"
      >
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h3 className="text-lg font-semibold">Request Overtime</h3>
        </div>
        <p className="text-green-100 text-sm mt-1">Request additional hours</p>
      </button>

    </div>
  )
}

export default TimeButtons
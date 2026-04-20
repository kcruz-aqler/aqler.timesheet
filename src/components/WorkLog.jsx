import { useState } from "react"

function WorkLog({ logs }) {
  const [limit, setLimit] = useState(10)

  const visibleLogs = logs.slice(0, limit)

  return (
    <div className="max-w-5xl mx-auto px-6 pb-16">
      <h2 className="text-xl font-semibold mb-4 text-white">
        Work Log
      </h2>

      <div className="space-y-3">
        {visibleLogs.map((log, index) => {
          const duration = parseFloat(log.duration) || 0
          const durationInMinutes = Math.round(duration * 60)
          const isIncomplete = duration < 9
          const displayTime = duration < 1 
            ? `${durationInMinutes <= 1 ? "minute" : "minutes"}`
            : `${duration <= 1 ? "hour" : "hours"}`

          // cleaner formatting
          const formattedHours =
            duration % 1 === 0 ? duration : duration.toFixed(2)

          return (
            <div
              key={`${log.date}-${log.time}-${index}`}
              className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center"
            >
              {/* LEFT SIDE */}
              <div>
                <p className="font-medium text-slate-100">
                  {log.type === "IN"
                    ? "Time In"
                    : log.type === "OUT"
                    ? "Time Out"
                    : "Unknown"}
                </p>

                <p className="text-sm text-slate-400">
                  {log.date} • {log.time}
                </p>
              </div>

              {/* RIGHT SIDE */}
              {log.duration != null && (
                <div className="text-right">
                  <p
                    className={`text-2xl md:text-3xl font-bold tracking-tight ${
                      isIncomplete
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {duration < 1
                      ? durationInMinutes
                      : formattedHours}

                    <span className="text-xl ml-1 text-slate-400 font-medium">
                      {displayTime}
                    </span>
                  </p>

                  <p className="text-xs text-slate-500 font-medium">
                    {isIncomplete ? "Incomplete" : "Complete"}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-6 gap-4">
        {limit < logs.length && (
          <button
            onClick={() => setLimit((x) => x + 10)}
            className="text-sm text-slate-400 hover:text-white transition"
          >
            Show more ({logs.length - limit} remaining)
          </button>
        )}

        {limit > 10 && (
          <button
            onClick={() => setLimit(10)}
            className="text-sm text-slate-400 hover:text-red-400 transition"
          >
            Show less
          </button>
        )}
      </div>
    </div>
  )
}

export default WorkLog
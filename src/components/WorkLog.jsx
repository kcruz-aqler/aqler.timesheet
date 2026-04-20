function WorkLog({ logs }) {
  return (
    <div className="max-w-5xl mx-auto px-6 pb-16">
      <h2 className="text-xl font-semibold mb-4">Work Log</h2>
      <div className="space-y-3">
        {logs.map((log, index) => (
          <div
            key={index}
            className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between"
          >
            <div>
              <p className="font-medium">
                {log.type === "IN" ? "Time In" : "Time Out"}
              </p>
              <p className="text-sm text-slate-400">
                {log.date} • {log.time}
              </p>
            </div>
            {log.duration && (
              <div className="text-right">
                <p className={`text-xl font-bold ${
                  parseFloat(log.duration) <= 9.0 ? "text-red-400" : "text-green-400"
                }`}>
                  {log.duration}
                </p>
                <p className="text-xs text-slate-500">
                  {parseFloat(log.duration) <= 9.0 ? "Incomplete" : "Complete"}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorkLog
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import AlertMessage from '../components/AlertMessage'
import TimeButtons from '../components/TimeButtons'
import WorkLog from '../components/WorkLog'

function Home({ session }) {
  const user = session.user
  const [logs, setLogs] = useState([])
  const [activeTimeIn, setActiveTimeIn] = useState(null)
  const [alertMessage, setAlertMessage] = useState("")
  const timerRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      // fetch logs
      const { data: logsData } = await supabase
        .from('logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (logsData) setLogs(logsData)

      // fetch active session
      const { data: sessionData } = await supabase
        .from('active_sessions')
        .select('*')
        .eq('user_id', user.id)
        .single()
      if (sessionData) setActiveTimeIn(new Date(sessionData.time_in))
    }
    fetchData()
  }, [user.id])

  const showAlert = (msg) => {
    setAlertMessage(msg)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setAlertMessage(""), 10000)
  }

  const timeIn = async () => {
    if (activeTimeIn) {
      showAlert("You are already timed in!")
      return
    }
    const now = new Date()
    setActiveTimeIn(now)
    showAlert("You have successfully timed in at " + now.toLocaleTimeString())

    await supabase.from('active_sessions').upsert({
      user_id: user.id,
      time_in: now.toISOString()
    })

    const { data, error } = await supabase
      .from('logs')
      .insert({
        user_id: user.id,
        type: "IN",
        time: now.toLocaleTimeString(),
        date: now.toLocaleDateString()
      })
      .select()
    if (!error) setLogs(prev => [data[0], ...prev])
  }

  const timeOut = async () => {
    if (!activeTimeIn) return

    const now = new Date()

    // find last Time In log from logs array
    const lastTimeIn = logs.find(log => log.type === "IN")
    const savedTimeIn = lastTimeIn ? new Date(lastTimeIn.created_at) : new Date(activeTimeIn)
    const hours = ((now - savedTimeIn) / (1000 * 60 * 60)).toFixed(2)

    await supabase
      .from('active_sessions')
      .delete()
      .eq('user_id', user.id)

    setActiveTimeIn(null)

    const { data, error } = await supabase
      .from('logs')
      .insert({
        user_id: user.id,
        type: "OUT",
        time: now.toLocaleTimeString(),
        date: now.toLocaleDateString(),
        duration: `${hours} hrs`
      })
      .select()
    if (!error) setLogs(prev => [data[0], ...prev])
  }

  const requestOvertime = () => {
    showAlert("Overtime request submitted! - Not functional yet :)")
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navbar user={user} onSignOut={handleSignOut} />
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-6">Welcome back, {user.user_metadata?.full_name.split(' ')[0]}!</h1>
        <p className="text-lg text-slate-300 mb-8">Here's a quick overview of your timesheet activities.</p>
        <AlertMessage message={alertMessage} />
        <TimeButtons onTimeIn={timeIn} onTimeOut={timeOut} onRequestOvertime={requestOvertime} activeTimeIn={activeTimeIn} />
        <WorkLog logs={logs} />
      </div>
    </div>
  )
}

export default Home
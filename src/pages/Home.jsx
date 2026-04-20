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
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (!error) setLogs(data)
    }
    fetchLogs()
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

    const { data, error } = await supabase
      .from('logs')
      .insert({ user_id: user.id, type: "IN", time: now.toLocaleTimeString(), date: now.toLocaleDateString() })
      .select()
    if (!error) setLogs(prev => [data[0], ...prev])
  }

  const timeOut = async () => {
    if (!activeTimeIn) return
    const now = new Date()
    const hours = ((now - activeTimeIn) / (1000 * 60 * 60)).toFixed(2)

    const { data, error } = await supabase
      .from('logs')
      .insert({ user_id: user.id, type: "OUT", time: now.toLocaleTimeString(), date: now.toLocaleDateString(), duration: `${hours} hrs` })
      .select()
    if (!error) setLogs(prev => [data[0], ...prev])
    setActiveTimeIn(null)
  }

  const requestOvertime = () => {
    showAlert("Overtime request submitted!")
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
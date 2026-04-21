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
  const [activeSession, setActiveSession] = useState(null)

  const [alertMessage, setAlertMessage] = useState("")
  const timerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      // logs
      const { data: logsData } = await supabase
        .from('logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (logsData) setLogs(logsData)

      // active session (ONLY ONE allowed)
      const { data: sessionData } = await supabase
        .from('active_sessions')
        .select('*')
        .eq('user_id', user.id)
        .is('time_out', null)
        .maybeSingle()

      setActiveSession(sessionData)

      if (sessionData) {
        setActiveTimeIn(new Date(sessionData.time_in))
      } else {
        setActiveTimeIn(null)
      }

      setIsLoading(false)
    }

    fetchData()
  }, [user.id])

  // ---------------- ALERT ----------------
  const showAlert = (msg) => {
    setAlertMessage(msg)
    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      setAlertMessage("")
    }, 5000)
  }

  // ---------------- TIME IN ----------------
  const timeIn = async () => {
    if (isLoading || activeSession) {
      showAlert("You are already timed in!")
      return
    }

    const now = new Date()

    setActiveTimeIn(now)
    showAlert("Timed in at " + now.toLocaleTimeString())

    const { error, data } = await supabase
      .from('active_sessions')
      .insert({
        user_id: user.id,
        time_in: now.toISOString()
      })
      .select()

    if (error) {
      showAlert("Failed to time in (maybe already active session)")
      setActiveTimeIn(null)
      return
    }

    setActiveSession(data?.[0] || null)

    // log
    const { data: logData } = await supabase
      .from('logs')
      .insert({
        user_id: user.id,
        type: "IN",
        time: now.toLocaleTimeString(),
        date: now.toLocaleDateString()
      })
      .select()

    if (logData) setLogs(prev => [logData[0], ...prev])
  }

  // ---------------- TIME OUT ----------------
  const timeOut = async () => {
    if (!activeSession) {
      showAlert("You are not currently timed in!")
      return
    }

    const now = new Date()

    const savedTimeIn = new Date(activeSession.time_in)
    const hours = ((now - savedTimeIn) / (1000 * 60 * 60)).toFixed(2)

    // update session (NOT delete)
    const { error } = await supabase
      .from('active_sessions')
      .update({
        time_out: now.toISOString()
      })
      .eq('id', activeSession.id)

    if (error) {
      showAlert("Failed to time out")
      return
    }

    setActiveSession(null)
    setActiveTimeIn(null)

    // log OUT
    const { data: logData } = await supabase
      .from('logs')
      .insert({
        user_id: user.id,
        type: "OUT",
        time: now.toLocaleTimeString(),
        date: now.toLocaleDateString(),
        duration: hours
      })
      .select()

    if (logData) setLogs(prev => [logData[0], ...prev])
  }

  // ---------------- OTHER ACTIONS ----------------
  const requestOvertime = () => {
    showAlert("Under development :)")
  }

  const requestLeave = () => {
    showAlert("Not functional yet :)")
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navbar user={user} onSignOut={handleSignOut} />

      <div className="p-8">
        <h1 className="text-4xl font-bold mb-6">
          Welcome back, {user.user_metadata?.full_name?.split(' ')[0]}!
        </h1>

        <p className="text-lg text-slate-300 mb-8">
          Here's a quick overview of your timesheet activities.
        </p>

        <AlertMessage message={alertMessage} />

        <TimeButtons
          isLoading={isLoading}
          onTimeIn={timeIn}
          onTimeOut={timeOut}
          onRequestOvertime={requestOvertime}
          onLeaveRequest={requestLeave}
          activeTimeIn={activeTimeIn}
        />

        <WorkLog logs={logs} />
      </div>
    </div>
  )
}

export default Home
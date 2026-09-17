import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'

function AdminDashboard() {
  const { profile, logout } = useAuth()

  const [usersCount, setUsersCount] = useState(0)
  const [activeSubscriptions, setActiveSubscriptions] = useState(0)
  const [charityTotal, setCharityTotal] = useState(0)
  const [draws, setDraws] = useState([])
  const [selectedDraw, setSelectedDraw] = useState(null)

  const [drawMonth, setDrawMonth] = useState('2026-11-01')
  const [eligibleUsers, setEligibleUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const [prizeName, setPrizeName] = useState('')
  const [prizeAmount, setPrizeAmount] = useState('')

  const [message, setMessage] = useState('')

  const loadStats = async () => {
    const { count: userCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    const { count: subscriptionCount } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    const { data: charityData } = await supabase
      .from('charity_contributions')
      .select('amount')

    const totalCharity = (charityData || []).reduce(
      (sum, item) => sum + Number(item.amount),
      0
    )

    setUsersCount(userCount || 0)
    setActiveSubscriptions(subscriptionCount || 0)
    setCharityTotal(totalCharity)
  }

  const loadDraws = async () => {
    const { data } = await supabase
      .from('monthly_draws')
      .select('*')
      .order('draw_month', { ascending: false })

    setDraws(data || [])

    if (data && data.length > 0) {
      setSelectedDraw(data[0])
    }
  }

  const loadEligibleUsers = async (drawId) => {
    const { data } = await supabase
      .from('draw_entries')
      .select('user_id, eligibility_score, users(full_name, email)')
      .eq('draw_id', drawId)

    setEligibleUsers(data || [])
  }

  useEffect(() => {
    loadStats()
    loadDraws()
  }, [])

  const handleCreateDraw = async () => {
    setMessage('')

    const { data, error } = await supabase
      .from('monthly_draws')
      .insert({
        draw_month: drawMonth,
        status: 'scheduled',
      })
      .select()
      .single()

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage('Monthly draw created successfully!')
    setSelectedDraw(data)
    setDraws((prev) => [data, ...prev])
  }

  const handleAddEligibleUser = async () => {
    setMessage('')

    if (!selectedDraw) {
      setMessage('Please create or select a draw first.')
      return
    }

    if (!selectedUser) {
      setMessage('Please select a user.')
      return
    }

    const { error } = await supabase
      .from('draw_entries')
      .insert({
        draw_id: selectedDraw.id,
        user_id: selectedUser,
        eligibility_score: 100,
      })

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage('User added to draw successfully!')
    loadEligibleUsers(selectedDraw.id)
  }

  const handleSelectWinner = async () => {
    setMessage('')

    if (!selectedDraw) {
      setMessage('Please select a draw.')
      return
    }

    if (!selectedUser) {
      setMessage('Please select a winner.')
      return
    }

    const { error: drawError } = await supabase
      .from('monthly_draws')
      .update({
        winner_user_id: selectedUser,
        status: 'completed',
      })
      .eq('id', selectedDraw.id)

    if (drawError) {
      setMessage(drawError.message)
      return
    }

    setMessage('Winner selected successfully!')

    setSelectedDraw({
      ...selectedDraw,
      winner_user_id: selectedUser,
      status: 'completed',
    })

    loadDraws()
  }

  const handleCreatePrize = async () => {
    setMessage('')

    if (!selectedDraw) {
      setMessage('Please select a draw.')
      return
    }

    if (!prizeName || !prizeAmount) {
      setMessage('Please enter prize name and amount.')
      return
    }

    const { error } = await supabase
      .from('prizes')
      .insert({
        draw_id: selectedDraw.id,
        prize_name: prizeName,
        prize_amount: Number(prizeAmount),
        winner_user_id: selectedDraw.winner_user_id,
      })

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage('Prize created successfully!')
    setPrizeName('')
    setPrizeAmount('')
  }

  const getWinnerName = async (winnerId) => {
    if (!winnerId) return 'Not selected'

    const { data } = await supabase
      .from('users')
      .select('full_name')
      .eq('id', winnerId)
      .maybeSingle()

    return data?.full_name || 'Winner'
  }

  const [winnerName, setWinnerName] = useState('Not selected')

  useEffect(() => {
    if (selectedDraw?.winner_user_id) {
      getWinnerName(selectedDraw.winner_user_id).then(setWinnerName)
    } else {
      setWinnerName('Not selected')
    }

    if (selectedDraw?.id) {
      loadEligibleUsers(selectedDraw.id)
    }
  }, [selectedDraw])

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Digital Heroes
            </h1>
            <p className="text-slate-300 mt-1">
              Admin Management Dashboard
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm text-slate-400">
                Logged in as
              </p>
              <p className="font-semibold">
                {profile?.full_name || 'Admin'}
              </p>
            </div>

            <button
              onClick={logout}
              className="px-5 py-2.5 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Admin Overview
          </h2>

          <p className="text-slate-500 mt-2">
            Manage users, subscriptions, charity contributions and monthly draws.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border-t-4 border-blue-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500">
                  Total Users
                </p>
                <p className="text-4xl font-bold text-blue-600 mt-2">
                  {usersCount}
                </p>
              </div>

              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                👥
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border-t-4 border-amber-500 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500">
                  Active Subscriptions
                </p>
                <p className="text-4xl font-bold text-amber-500 mt-2">
                  {activeSubscriptions}
                </p>
              </div>

              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-xl">
                💳
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border-t-4 border-green-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500">
                  Total Charity
                </p>
                <p className="text-4xl font-bold text-green-600 mt-2">
                  ₹{charityTotal}
                </p>
              </div>

              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-xl">
                ❤️
              </div>
            </div>
          </div>
        </div>

        {/* Create Draw */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Create Monthly Draw
          </h2>

          <p className="text-slate-500 mt-1">
            Schedule a new monthly prize draw.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Draw Month
              </label>

              <input
                type="date"
                value={drawMonth}
                onChange={(e) => setDrawMonth(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleCreateDraw}
                className="w-full p-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Create Draw
              </button>
            </div>
          </div>
        </div>

        {/* Draw Selection */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Monthly Draws
          </h2>

          <div className="mt-5">
            {draws.length === 0 ? (
              <p className="text-slate-500">
                No draws available.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {draws.map((draw) => (
                  <button
                    key={draw.id}
                    onClick={() => setSelectedDraw(draw)}
                    className={`text-left border rounded-xl p-5 transition ${
                      selectedDraw?.id === draw.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:shadow-md'
                    }`}
                  >
                    <p className="text-sm text-slate-500">
                      Draw Month
                    </p>

                    <p className="text-lg font-bold text-slate-900 mt-1">
                      {draw.draw_month}
                    </p>

                    <p className="mt-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          draw.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {draw.status}
                      </span>
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Draw Management */}
        {selectedDraw && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Manage Eligible Users
              </h2>

              <p className="text-slate-500 mt-1">
                Add users who are eligible for this draw.
              </p>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Select User
                </label>

                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    Select a user
                  </option>

                  {eligibleUsers.map((entry) => (
                    <option
                      key={entry.user_id}
                      value={entry.user_id}
                    >
                      {entry.users?.full_name || entry.users?.email}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleAddEligibleUser}
                  className="w-full mt-4 p-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                >
                  Add Eligible User
                </button>
              </div>

              <div className="mt-6">
                <h3 className="font-bold text-slate-800">
                  Eligible Entries
                </h3>

                {eligibleUsers.length === 0 ? (
                  <p className="text-sm text-slate-500 mt-2">
                    No eligible users added yet.
                  </p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {eligibleUsers.map((entry) => (
                      <div
                        key={entry.user_id}
                        className="flex justify-between items-center bg-slate-50 rounded-lg p-3"
                      >
                        <span className="font-medium text-slate-700">
                          {entry.users?.full_name || entry.users?.email}
                        </span>

                        <span className="text-sm text-blue-600 font-semibold">
                          Score: {entry.eligibility_score}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Select Winner
              </h2>

              <p className="text-slate-500 mt-1">
                Select the winner for the selected monthly draw.
              </p>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Winner
                </label>

                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    Select winner
                  </option>

                  {eligibleUsers.map((entry) => (
                    <option
                      key={entry.user_id}
                      value={entry.user_id}
                    >
                      {entry.users?.full_name || entry.users?.email}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleSelectWinner}
                  className="w-full mt-4 p-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Select Winner
                </button>
              </div>

              <div className="mt-6 p-5 rounded-xl bg-green-50 border border-green-100">
                <p className="text-sm text-slate-500">
                  Current Winner
                </p>

                <p className="text-xl font-bold text-green-700 mt-1">
                  {winnerName}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Prize */}
        {selectedDraw && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Create Prize
            </h2>

            <p className="text-slate-500 mt-1">
              Add the prize for the selected monthly draw.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Prize Name
                </label>

                <input
                  type="text"
                  value={prizeName}
                  onChange={(e) => setPrizeName(e.target.value)}
                  placeholder="Example: Golf Equipment"
                  className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Prize Amount
                </label>

                <input
                  type="number"
                  value={prizeAmount}
                  onChange={(e) => setPrizeAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="0"
                  className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleCreatePrize}
                  className="w-full p-3 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 transition"
                >
                  Create Prize
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Latest Draw */}
        {selectedDraw && (
          <div className="mt-8 bg-slate-900 text-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold">
              Latest Draw Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
              <div className="bg-slate-800 rounded-xl p-5">
                <p className="text-slate-400 text-sm">
                  Draw Month
                </p>
                <p className="text-lg font-bold mt-1">
                  {selectedDraw.draw_month}
                </p>
              </div>

              <div className="bg-slate-800 rounded-xl p-5">
                <p className="text-slate-400 text-sm">
                  Status
                </p>
                <p className="text-lg font-bold mt-1">
                  {selectedDraw.status}
                </p>
              </div>

              <div className="bg-slate-800 rounded-xl p-5">
                <p className="text-slate-400 text-sm">
                  Winner
                </p>
                <p className="text-lg font-bold mt-1">
                  {winnerName}
                </p>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className="mt-8 p-4 rounded-xl bg-blue-50 border border-blue-100 text-center text-blue-700 font-medium">
            {message}
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-sm text-slate-500">
        © 2026 Digital Heroes
      </footer>
    </div>
  )
}

export default AdminDashboard
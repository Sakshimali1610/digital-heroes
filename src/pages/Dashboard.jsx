import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'

function Dashboard() {
  const { user, profile, logout } = useAuth()

  const [score, setScore] = useState('')
  const [playedAt, setPlayedAt] = useState('')
  const [scores, setScores] = useState([])
  const [average, setAverage] = useState(0)
  const [message, setMessage] = useState('')
  const [subscription, setSubscription] = useState(null)
  const [charityAmount, setCharityAmount] = useState(0)

  const loadScores = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('golf_scores')
      .select('*')
      .eq('user_id', user.id)
      .order('played_at', { ascending: false })
      .order('id', { ascending: false })

    if (error) {
      setMessage(error.message)
      return
    }

    setScores(data || [])

    const latestFive = (data || []).slice(0, 5)

    if (latestFive.length > 0) {
      const total = latestFive.reduce(
        (sum, item) => sum + item.score,
        0
      )

      setAverage((total / latestFive.length).toFixed(2))
    } else {
      setAverage(0)
    }
  }

  const loadSubscription = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      setMessage(error.message)
      return
    }

    setSubscription(data)
  }

  const loadCharity = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('charity_contributions')
      .select('amount')
      .eq('user_id', user.id)

    if (error) {
      setMessage(error.message)
      return
    }

    const total = (data || []).reduce(
      (sum, item) => sum + Number(item.amount),
      0
    )

    setCharityAmount(total)
  }

  useEffect(() => {
    if (user) {
      loadScores()
      loadSubscription()
      loadCharity()
    }
  }, [user])

  const handleAddScore = async (e) => {
    e.preventDefault()
    setMessage('')

    if (!user) {
      setMessage('User not logged in')
      return
    }

    const { error } = await supabase
      .from('golf_scores')
      .insert({
        user_id: user.id,
        score: Number(score),
        played_at: playedAt,
      })

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage('Golf score added successfully!')
    setScore('')
    setPlayedAt('')

    loadScores()
  }

  const handleSubscribe = async () => {
    setMessage('')

    if (!user) {
      setMessage('User not logged in')
      return
    }

    const { error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        plan_name: 'Monthly Plan',
        amount: 499,
        status: 'active',
        start_date: new Date().toISOString().split('T')[0],
      })

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage('Subscription activated successfully!')
    loadSubscription()
  }

  const handleCharity = async () => {
    setMessage('')

    if (!user) {
      setMessage('User not logged in')
      return
    }

    const { error } = await supabase
      .from('charity_contributions')
      .insert({
        user_id: user.id,
        amount: 50,
        charity_name: 'Digital Heroes Charity',
      })

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage('Charity contribution added successfully!')
    loadCharity()
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="bg-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold">
              Digital Heroes
            </h1>

            <p className="text-slate-300 mt-1">
              Golf Performance Dashboard
            </p>
          </div>

          <button
            onClick={logout}
            className="px-5 py-2.5 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
          >
            Logout
          </button>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Welcome, {profile?.full_name || user?.email}
          </h2>

          <p className="text-slate-500 mt-2">
            Track your golf performance, subscription and charity contribution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white rounded-2xl shadow-sm border-t-4 border-blue-600 p-6">

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                Golf Performance
              </h3>

              <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                ⛳
              </div>
            </div>

            <p className="text-slate-500 mt-5">
              Rolling 5 Score Average
            </p>

            <p className="text-4xl font-bold text-blue-600 mt-2">
              {average}
            </p>

            <p className="text-sm text-slate-400 mt-2">
              Based on your latest scores
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-sm border-t-4 border-amber-500 p-6">

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                Subscription
              </h3>

              <div className="w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center text-xl">
                💳
              </div>
            </div>

            {subscription ? (
              <>
                <p className="text-slate-500 mt-5">
                  Plan
                </p>

                <p className="text-lg font-bold text-slate-800">
                  {subscription.plan_name}
                </p>

                <p className="text-slate-600 mt-2">
                  Amount: ₹{subscription.amount}
                </p>

                <p className="text-green-600 font-semibold mt-1">
                  ● {subscription.status}
                </p>
              </>
            ) : (
              <>
                <p className="text-slate-500 mt-5">
                  No active subscription.
                </p>

                <button
                  onClick={handleSubscribe}
                  className="mt-4 px-5 py-2.5 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 transition"
                >
                  Subscribe ₹499
                </button>
              </>
            )}

          </div>

          <div className="bg-white rounded-2xl shadow-sm border-t-4 border-green-600 p-6">

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                Charity
              </h3>

              <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center text-xl">
                ❤️
              </div>
            </div>

            <p className="text-slate-500 mt-5">
              Total Contribution
            </p>

            <p className="text-4xl font-bold text-green-600 mt-2">
              ₹{charityAmount}
            </p>

            <button
              onClick={handleCharity}
              className="mt-4 px-5 py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Contribute ₹50
            </button>

          </div>

        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-sm border p-6">

          <h2 className="text-2xl font-bold text-slate-900">
            Add Golf Score
          </h2>

          <p className="text-slate-500 mt-1">
            Add your latest golf score to update your performance.
          </p>

          <form
            onSubmit={handleAddScore}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6"
          >

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Score
              </label>

              <input
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="Enter score"
                min="1"
                required
                className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Played Date
              </label>

              <input
                type="date"
                value={playedAt}
                onChange={(e) => setPlayedAt(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full p-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Add Score
              </button>
            </div>

          </form>

          {message && (
            <div className="mt-5 p-3 rounded-lg bg-blue-50 border border-blue-100 text-center text-blue-700">
              {message}
            </div>
          )}

        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-sm border p-6">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Recent Golf Scores
              </h2>

              <p className="text-slate-500 mt-1">
                Your latest recorded scores
              </p>
            </div>

            <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-xl">
              📊
            </div>

          </div>

          <div className="mt-6">

            {scores.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No scores added yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {scores.map((item) => (
                  <div
                    key={item.id}
                    className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition"
                  >

                    <p className="text-slate-500 text-sm">
                      Golf Score
                    </p>

                    <p className="text-3xl font-bold text-blue-600 mt-1">
                      {item.score}
                    </p>

                    <p className="text-slate-500 mt-2">
                      Date: {item.played_at}
                    </p>

                  </div>
                ))}

              </div>
            )}

          </div>

        </div>

      </main>

      <footer className="text-center py-6 text-sm text-slate-500">
        © 2026 Digital Heroes
      </footer>

    </div>
  )
}

export default Dashboard
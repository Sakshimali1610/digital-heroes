import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navbar */}
      <header className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-xl shadow-lg shadow-blue-600/30">
              ⛳
            </div>

            <div>
              <h1 className="text-xl font-bold">
                Digital Heroes
              </h1>
              <p className="text-xs text-slate-400">
                Golf Performance Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-lg text-slate-200 font-semibold hover:bg-slate-800 transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold">
                ⛳ Smart Golf Performance
              </div>

              <h2 className="text-4xl md:text-6xl font-bold leading-tight mt-6">
                Improve Your Game.
                <span className="text-blue-500">
                  {' '}Support a Cause.
                </span>
              </h2>

              <p className="text-lg text-slate-400 mt-6 max-w-xl leading-relaxed">
                Track your golf performance, manage your subscription,
                contribute to charity and participate in monthly prize draws
                through one simple platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link
                  to="/register"
                  className="px-7 py-3.5 rounded-lg bg-blue-600 text-white font-semibold text-center hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
                >
                  Create Your Account
                </Link>

                <Link
                  to="/login"
                  className="px-7 py-3.5 rounded-lg border border-slate-700 text-slate-200 font-semibold text-center hover:bg-slate-800 transition"
                >
                  Login
                </Link>
              </div>
            </div>

            {/* Hero Card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-600/10 rounded-3xl blur-2xl" />

              <div className="relative bg-slate-800 border border-slate-700 rounded-3xl p-7 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">
                      Your Performance
                    </p>

                    <p className="text-4xl font-bold mt-2">
                      85.00
                    </p>

                    <p className="text-green-400 text-sm mt-2">
                      ● Rolling 5 Score Average
                    </p>
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl">
                    ⛳
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-slate-900 rounded-xl p-5">
                    <p className="text-slate-400 text-sm">
                      Charity
                    </p>

                    <p className="text-2xl font-bold text-green-400 mt-2">
                      ₹50
                    </p>
                  </div>

                  <div className="bg-slate-900 rounded-xl p-5">
                    <p className="text-slate-400 text-sm">
                      Monthly Draw
                    </p>

                    <p className="text-2xl font-bold text-amber-400 mt-2">
                      Active
                    </p>
                  </div>
                </div>

                <div className="mt-5 bg-blue-600/10 border border-blue-500/20 rounded-xl p-5">
                  <p className="text-blue-300 font-semibold">
                    Track. Improve. Give back.
                  </p>

                  <p className="text-slate-400 text-sm mt-1">
                    Your golf journey can also make a positive impact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-slate-950 border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold">
                Everything in One Place
              </h2>

              <p className="text-slate-400 mt-3">
                A simple platform for golf performance, charity and rewards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-600 transition">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center text-xl">
                  📊
                </div>

                <h3 className="text-xl font-bold mt-5">
                  Golf Performance
                </h3>

                <p className="text-slate-400 mt-2 leading-relaxed">
                  Record your golf scores and monitor your rolling 5-score
                  average.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-green-600 transition">
                <div className="w-12 h-12 rounded-xl bg-green-600/10 text-green-400 flex items-center justify-center text-xl">
                  ❤️
                </div>

                <h3 className="text-xl font-bold mt-5">
                  Charity Contribution
                </h3>

                <p className="text-slate-400 mt-2 leading-relaxed">
                  Support charitable initiatives through your platform
                  contributions.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-amber-500 transition">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xl">
                  🏆
                </div>

                <h3 className="text-xl font-bold mt-5">
                  Monthly Draws
                </h3>

                <p className="text-slate-400 mt-2 leading-relaxed">
                  Eligible members can participate in monthly prize draws.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-blue-600 rounded-3xl p-8 md:p-12 text-center shadow-xl shadow-blue-600/20">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Your Golf Journey?
            </h2>

            <p className="text-blue-100 mt-3 max-w-2xl mx-auto">
              Create your Digital Heroes account and start tracking your
              performance today.
            </p>

            <Link
              to="/register"
              className="inline-block mt-7 px-7 py-3.5 rounded-lg bg-white text-blue-700 font-bold hover:bg-slate-100 transition"
            >
              Get Started
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-slate-500">
          © 2026 Digital Heroes. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default Home
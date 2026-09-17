import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-600 text-4xl shadow-lg shadow-blue-600/30">
          ⛳
        </div>

        <p className="text-blue-400 font-bold text-7xl mt-8">
          404
        </p>

        <h1 className="text-3xl font-bold mt-4">
          Page Not Found
        </h1>

        <p className="text-slate-400 mt-3 leading-relaxed">
          Sorry, the page you are looking for does not exist or may have
          been moved.
        </p>

        <Link
          to="/"
          className="inline-block mt-8 px-7 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
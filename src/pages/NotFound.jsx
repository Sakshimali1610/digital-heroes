import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold">
          404
        </h1>

        <p className="mt-4 text-xl">
          Page Not Found
        </p>

        <Link
          to="/"
          className="inline-block mt-6 px-6 py-3 rounded-lg bg-black text-white"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
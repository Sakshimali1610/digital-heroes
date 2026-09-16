function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center">
          Login
        </h1>

        <div className="mt-6">
          <label className="block mb-2">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div className="mt-4">
          <label className="block mb-2">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full border rounded-lg p-3"
          />
        </div>

        <button className="w-full mt-6 p-3 rounded-lg bg-black text-white">
          Login
        </button>
      </div>
    </div>
  )
}

export default Login
function AdminDashboard() {
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">

        <div className="border rounded-xl p-6">
          <h2 className="text-xl font-semibold">
            Total Users
          </h2>
          <p className="text-3xl font-bold mt-3">
            0
          </p>
        </div>

        <div className="border rounded-xl p-6">
          <h2 className="text-xl font-semibold">
            Active Subscriptions
          </h2>
          <p className="text-3xl font-bold mt-3">
            0
          </p>
        </div>

        <div className="border rounded-xl p-6">
          <h2 className="text-xl font-semibold">
            Monthly Draws
          </h2>
          <p className="text-3xl font-bold mt-3">
            0
          </p>
        </div>

        <div className="border rounded-xl p-6">
          <h2 className="text-xl font-semibold">
            Charity
          </h2>
          <p className="text-3xl font-bold mt-3">
            ₹0
          </p>
        </div>

      </div>
    </div>
  )
}

export default AdminDashboard
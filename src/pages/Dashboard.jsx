function Dashboard() {
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold">
        User Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        <div className="border rounded-xl p-6">
          <h2 className="text-xl font-semibold">
            Golf Score
          </h2>
          <p className="mt-2">
            No scores added yet.
          </p>
        </div>

        <div className="border rounded-xl p-6">
          <h2 className="text-xl font-semibold">
            Subscription
          </h2>
          <p className="mt-2">
            No active subscription.
          </p>
        </div>

        <div className="border rounded-xl p-6">
          <h2 className="text-xl font-semibold">
            Charity Contribution
          </h2>
          <p className="mt-2">
            ₹0 contributed
          </p>
        </div>

      </div>
    </div>
  )
}

export default Dashboard
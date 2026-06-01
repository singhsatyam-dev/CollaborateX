import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">CollaborateX</h1>

            <p className="text-gray-500">Realtime Collaboration Platform</p>
          </div>

          <div className="flex gap-3">
            <Link to="/login" className="px-5 py-2 border rounded-lg">
              Login
            </Link>

            <Link
              to="/signup"
              className="px-5 py-2 bg-black text-white rounded-lg"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h1 className="text-6xl font-bold mb-6">
          Collaborate on Documents
          <br />
          in Real Time
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          Create, edit and share documents with your team instantly.
        </p>

        <div className="flex gap-4">
          <Link
            to="/signup"
            className="bg-black text-white px-6 py-3 rounded-xl"
          >
            Get Started
          </Link>

          <Link to="/login" className="border px-6 py-3 rounded-xl">
            Login
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-24">
        <h2 className="text-4xl font-bold text-center mb-12">Features</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-bold mb-3">⚡ Realtime</h3>

            <p>Collaborate instantly with Socket.IO powered editing.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-bold mb-3">📝 Rich Text</h3>

            <p>Format documents using a powerful editor.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-bold mb-3">👥 Sharing</h3>

            <p>Invite collaborators with a single click.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-bold mb-3">🔒 Secure</h3>

            <p>JWT authentication and protected routes.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;

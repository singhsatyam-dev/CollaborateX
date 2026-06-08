import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 px-6">
      <h1 className="text-8xl font-bold text-slate-800">404</h1>

      <h2 className="text-3xl font-semibold mt-4">Page Not Found</h2>

      <p className="text-gray-500 mt-3 text-center max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-8 bg-black text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default NotFoundPage;

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  getUserDocuments,
  createDocument,
  deleteDocument,
} from "../api/dashboardApi";
import { logout } from "../features/auth/authSlice";

function DashboardPage() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { token, user } = useSelector((state) => state.auth);

  const [documents, setDocuments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [documentTitle, setDocumentTitle] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  //for searching
  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  //FOR FETCHING USER DOCUMENTS
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await getUserDocuments(token);

        setDocuments(data.documents);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, [token]);

  //create document
  const handleCreateDocument = async () => {
    try {
      const data = await createDocument(token, documentTitle);

      setDocumentTitle("");

      setShowCreateModal(false);

      toast.success("Document created");

      navigate(`/documents/${data.document._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  //delete document
  const handleDeleteDocument = async (id) => {
    const result = await Swal.fire({
      title: "Delete Document?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteDocument(id, token);

      setDocuments(documents.filter((doc) => doc._id !== id));

      toast.success("Document deleted");
    } catch (error) {
      console.log(error);
    }
  };

  //for logout
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "You will need to login again.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Logout",
    });

    if (!result.isConfirmed) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    dispatch(logout());

    toast.success("Logged out");

    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">CollaborateX</h1>
            <p className="text-sm text-slate-500">
              Realtime Collaboration Platform
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-3xl p-8 mb-8">
          <h1 className="text-4xl font-bold mb-3">
            Welcome Back, {user?.name}
          </h1>

          <p className="text-slate-300 mb-6">
            Create, edit and collaborate on documents in real time.
          </p>

          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-slate-200 transition"
          >
            + New Document
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-gray-500 text-sm">Total Documents</h3>

            <p className="text-3xl font-bold mt-2">{documents.length}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-gray-500 text-sm">Account</h3>

            <p className="text-lg font-semibold mt-2">Active</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-gray-500 text-sm">Collaboration</h3>

            <p className="text-lg font-semibold mt-2">Enabled</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Documents Section */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-slate-800">My Documents</h2>
        </div>

        {documents.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm">
            <h2 className="text-3xl font-bold mb-4">No Documents Yet</h2>

            <p className="text-gray-500 mb-6">
              Create your first document and start collaborating.
            </p>

            <button
              onClick={handleCreateDocument}
              className="bg-black text-white px-6 py-3 rounded-xl"
            >
              Create Document
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div
                key={doc._id}
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-slate-800">
                    {doc.title}
                  </h2>

                  <p className="text-sm text-gray-500 mt-2">
                    Updated {new Date(doc.updatedAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/documents/${doc._id}`)}
                    className="flex-1 bg-black text-white py-2 rounded-xl hover:bg-slate-800"
                  >
                    Open
                  </button>

                  <button
                    onClick={() => handleDeleteDocument(doc._id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create new document pop up */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create New Document</h2>

            <input
              type="text"
              placeholder="Document Title"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateDocument}
                className="bg-black text-white px-4 py-2 rounded-lg"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;

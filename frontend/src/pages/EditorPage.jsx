import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import { socket } from "../sockets/socket";
import api from "../api/axios";
import {
  getCollaborators,
  shareDocument,
  removeCollaborator,
  togglePublicAccess,
} from "../api/collaboratorApi";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline"],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const EditorPage = () => {
  const [title, setTitle] = useState("");

  const [content, setContent] = useState("");

  const [activeUsers, setActiveUsers] = useState([]);

  const [showShareModal, setShowShareModal] = useState(false);

  const [email, setEmail] = useState("");

  const [collaborators, setCollaborators] = useState([]);

  const [owner, setOwner] = useState(null);

  const [isPublic, setIsPublic] = useState(false);

  const [saveStatus, setSaveStatus] = useState("Saved");

  const [lastSaved, setLastSaved] = useState(null);

  const [role, setRole] = useState("owner");

  const { id: documentId } = useParams();

  const { token, user } = useSelector((state) => state.auth);

  if (!token || !user) {
    return <div>Loading...</div>;
  }

  //FOR LOADING DOCS
  useEffect(() => {
    const loadDocument = async () => {
      try {
        const response = await api.get(`/documents/${documentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setContent(response.data.document.content);
        setTitle(response.data.document.title);

        const access = await api.get(`/documents/${documentId}/access`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRole(access.data.role);

        socket.emit("join-document", {
          documentId,
          user: {
            id: user.id,
            name: user.name,
          },
        });
      } catch (error) {
        console.log(error);
      }
    };

    loadDocument();

    socket.off("receive-changes");

    socket.on("receive-changes", (newContent) => {
      setContent(newContent);
    });

    socket.off("active-users");

    socket.on("active-users", (users) => {
      setActiveUsers(users);
    });

    return () => {
      socket.off("receive-changes");
      socket.off("active-users");
    };
  }, [documentId, token, user]);

  //FOR AUTOSAVE
  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        await api.put(
          `/documents/${documentId}`,
          {
            title,
            content,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setSaveStatus("Saved");
        setLastSaved(new Date());
      } catch (error) {
        console.log(error);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [content]);

  //fetch all collaborators
  const fetchCollaborators = async () => {
    try {
      const data = await getCollaborators(documentId, token);

      setCollaborators(data.collaborators);
    } catch (error) {
      console.log(error);
    }
  };

  //fetch all members (owner + collaborators)
  const fetchMembers = async () => {
    try {
      const response = await api.get(`/documents/${documentId}/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOwner(response.data.owner);

      setCollaborators(response.data.collaborators);
      setIsPublic(response.data.isPublic);
    } catch (error) {
      console.log(error);
    }
  };

  //for sharing with new collaboarators
  const handleShare = async () => {
    try {
      await shareDocument(documentId, email, token);

      toast.success("Collaborator added successfully");

      setEmail("");

      await fetchCollaborators();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  //remove existing collaborators
  const handleRemoveCollaborator = async (userId) => {
    const result = await Swal.fire({
      title: "Remove Collaborator?",
      text: "They will lose access to this document.",
      icon: "warning",
      showCancelButton: true,
    });

    if (!result.isConfirmed) return;

    try {
      await removeCollaborator(documentId, userId, token);

      toast.success("Collaborator removed");

      await fetchCollaborators();
    } catch (error) {
      toast.error("Failed to remove collaborator");
    }
  };

  //toggle between public and private access
  const handlePublicToggle = async () => {
    try {
      const data = await togglePublicAccess(documentId, !isPublic, token);

      setIsPublic(data.isPublic);

      toast.success(
        data.isPublic ? "Document is now public" : "Document is now private",
      );
    } catch (error) {
      toast.error("Failed to update access");
    }
  };

  // for copying link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);

      toast.success("Link copied");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  //for sharing
  const openShareModal = async () => {
    await fetchMembers();

    setShowShareModal(true);
  };

  //handling changes in document
  const handleChange = (value) => {
    setContent(value);

    setSaveStatus("Saving...");

    socket.emit("send-changes", {
      documentId,
      content: value,
    });
  };

  return (
    <div className="editor-container">
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-4xl font-bold w-full outline-none"
          />

          <div className="flex items-center gap-3 mt-2">
            <p className="text-gray-500">Active Users ({activeUsers.length})</p>

            <div className="flex -space-x-2">
              {activeUsers.map((user) => (
                <div
                  key={user.id}
                  className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm border-2 border-white"
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          </div>

          <p
            className={`text-sm mt-1 ${
              saveStatus === "Saving..." ? "text-orange-500" : "text-green-600"
            }`}
          >
            {saveStatus}
          </p>

          {lastSaved && (
            <p className="text-xs text-gray-500">
              Last saved at{" "}
              {lastSaved.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>

        <button
          onClick={openShareModal}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Share
        </button>
      </div>

      {/* SHARE POPUP */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Share Document</h2>

              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-2 mb-6">
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2"
              />

              <button
                onClick={handleShare}
                className="bg-black text-white px-4 py-2 rounded-lg"
              >
                Add
              </button>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Owner</h3>

              {owner && (
                <div className="border rounded-lg p-3 bg-gray-50">
                  <p className="font-medium">{owner.name}</p>

                  <p className="text-sm text-gray-500">{owner.email}</p>
                </div>
              )}
            </div>

            <div className="border rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-lg mb-2">Public Access</h3>

              <p className="text-gray-500 mb-4">
                Anyone with the link can view
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handlePublicToggle}
                  className={`px-4 py-2 rounded-lg text-white ${
                    isPublic ? "bg-green-500" : "bg-gray-500"
                  }`}
                >
                  {isPublic ? "ON" : "OFF"}
                </button>

                <button
                  onClick={handleCopyLink}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Copy Link
                </button>
              </div>
            </div>

            <h3 className="font-semibold text-lg mb-3">Collaborators</h3>

            {/* COLLABORATERS NAME WITH EMAIL */}
            {collaborators.length === 0 ? (
              <p className="text-gray-500">No collaborators yet</p>
            ) : (
              <div className="space-y-3">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator._id}
                    className="flex justify-between items-center border rounded-lg p-3"
                  >
                    <div>
                      <p className="font-medium">{collaborator.name}</p>

                      <p className="text-sm text-gray-500">
                        {collaborator.email}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemoveCollaborator(collaborator._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {role === "viewer" && (
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg mb-4">
          👁 View Only Access
        </div>
      )}

      {/* REACT EDITOR */}
      <ReactQuill
        theme="snow"
        value={content}
        onChange={handleChange}
        modules={modules}
        readOnly={role === "viewer"}
      />
    </div>
  );
};

export default EditorPage;

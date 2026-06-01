import express from "express";
import {
  createDocument,
  getUserDocument,
  getSingleDocument,
  updateDocument,
  shareDocument,
  getCollaborators,
  getDocumentMembers,
  togglePublicAccess,
  getDocumentAccess,
  removeCollaborator,
  deleteDocument,
} from "../controllers/document.controller.js";
import protectedRoute from "../middlewares/auth.middleware.js";

const documentRouter = express.Router();

documentRouter.post("/", protectedRoute, createDocument);
documentRouter.get("/", protectedRoute, getUserDocument);
documentRouter.get("/:id", protectedRoute, getSingleDocument);
documentRouter.put("/:id", protectedRoute, updateDocument);
documentRouter.post("/:id/share", protectedRoute, shareDocument);
documentRouter.get("/:id/collaborators", protectedRoute, getCollaborators);
documentRouter.get("/:id/members", protectedRoute, getDocumentMembers);
documentRouter.patch("/:id/public", protectedRoute, togglePublicAccess);
documentRouter.get("/:id/access", protectedRoute, getDocumentAccess);
documentRouter.delete(
  "/:id/collaborators/:userId",
  protectedRoute,
  removeCollaborator,
);
documentRouter.delete("/:id", protectedRoute, deleteDocument);

export default documentRouter;

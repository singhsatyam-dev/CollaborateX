import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import Document from "../models/document.schema.js";
import User from "../models/user.schema.js";

//CREATE DOC
export const createDocument = asyncHandler(async (req, res) => {
  const { title } = req.body;

  const document = await Document.create({
    title: title || "Untitled Document",
    owner: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Document created successfully",
    document,
  });
});

//getting all user documents
export const getUserDocument = asyncHandler(async (req, res) => {
  const documents = await Document.find({
    owner: req.user._id,
  }).sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    count: documents.length,
    documents,
  });
});

// GET SINGLE DOC BASED ON ID
export const getSingleDocument = asyncHandler(async (req, res) => {
  console.log("PARAM ID:", req.params.id);

  const document = await Document.findById(req.params.id);

  console.log("FOUND DOC:", document);

  if (!document) {
    throw new ApiError(404, "Document not found");
  }

  const isOwner = document.owner.toString() === req.user._id.toString();

  const isCollaborator = document.collaborators.some(
    (collaboratorId) => collaboratorId.toString() === req.user._id.toString(),
  );

  if (!isOwner && !isCollaborator && !document.isPublic) {
    throw new ApiError(403, "Access denied");
  }

  res.status(200).json({
    success: true,
    document,
  });
});

// UPDATE DOC (PUT)
export const updateDocument = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const document = await Document.findById(req.params.id);

  if (!document) {
    throw new ApiError(404, "Document not found");
  }

  if (document.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only owner can update document");
  }

  document.title = title || document.title;

  document.content = content !== undefined ? content : document.content;

  await document.save();

  res.status(200).json({
    success: true,
    message: "Document updated successfully",
    document,
  });
});

//SHARE DOC
export const shareDocument = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const document = await Document.findById(req.params.id);

  if (!document) {
    throw new ApiError(404, "Document not found");
  }

  if (document.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only owner can share document");
  }

  const collaborator = await User.findOne({ email });

  if (!collaborator) {
    throw new ApiError(404, "User not found");
  }

  const alreadyCollaborator = document.collaborators.includes(collaborator._id);

  if (alreadyCollaborator) {
    throw new ApiError(400, "User already collaborator");
  }

  document.collaborators.push(collaborator._id);

  await document.save();

  res.status(200).json({
    success: true,
    message: "Collaborator added successfully",
  });
});

// GET ALL COLLABORATORS
export const getCollaborators = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id).populate(
    "collaborators",
    "name email",
  );

  if (!document) {
    throw new ApiError(404, "Document not found");
  }

  if (document.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only owner can view collaborators");
  }

  res.status(200).json({
    success: true,
    collaborators: document.collaborators,
  });
});

//GET MEMBERS
export const getDocumentMembers = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id)
    .populate("owner", "name email")
    .populate("collaborators", "name email");

  if (!document) {
    throw new ApiError(404, "Document not found");
  }

  res.status(200).json({
    success: true,
    owner: document.owner,
    collaborators: document.collaborators,
    isPublic: document.isPublic,
  });
});

//GET ACESS TO DOCUMENT
export const getDocumentAccess = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    throw new ApiError(404, "Document not found");
  }

  const userId = req.user._id.toString();

  if (document.owner.toString() === userId) {
    return res.json({
      role: "owner",
    });
  }

  const collaborator = document.collaborators.some(
    (id) => id.toString() === userId,
  );

  if (collaborator) {
    return res.json({
      role: "collaborator",
    });
  }

  if (document.isPublic) {
    return res.json({
      role: "viewer",
    });
  }

  throw new ApiError(403, "Access denied");
});

//TOGGLE PUBLIC AND PRIVATE DOCUMENT ACCESS
export const togglePublicAccess = asyncHandler(async (req, res) => {
  const { isPublic } = req.body;

  const document = await Document.findById(req.params.id);

  if (!document) {
    throw new ApiError(404, "Document not found");
  }

  if (document.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only owner can change access");
  }

  document.isPublic = isPublic;

  await document.save();

  res.status(200).json({
    success: true,
    isPublic: document.isPublic,
  });
});

//REMOVE COLLABORATORS
export const removeCollaborator = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    throw new ApiError(404, "Document not found");
  }

  if (document.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only owner can remove collaborators");
  }

  document.collaborators = document.collaborators.filter(
    (collaboratorId) => collaboratorId.toString() !== req.params.userId,
  );

  await document.save();

  res.status(200).json({
    success: true,
    message: "Collaborator removed successfully",
  });
});

// DELETE DOC
export const deleteDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    throw new ApiError(404, "Document not found");
  }

  if (document.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only owner can delete document");
  }

  await document.deleteOne();

  res.status(200).json({
    success: true,
    message: "Document deleted successfully",
  });
});

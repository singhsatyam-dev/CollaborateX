import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Untitled Document",
      trim: true,
    },

    content: {
      type: String,
      default: "",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Document = mongoose.model("Document", documentSchema);

export default Document;
import api from "./axios";

export const getUserDocuments = async (token) => {
  const response = await api.get("/documents", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createDocument = async (token, title) => {
  const { data } = await api.post(
    "/documents",
    { title },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return data;
};

export const leaveDocument = async (documentId, token) => {
  const { data } = await api.delete(`/documents/${documentId}/leave`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const deleteDocument = async (documentId, token) => {
  const response = await api.delete(`/documents/${documentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

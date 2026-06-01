import api from "./axios";

export const shareDocument = async (documentId, email, token) => {
  const { data } = api.post(
    `/documents/${documentId}/share`,
    { email },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return data;
};

export const getCollaborators = async (documentId, token) => {
  const { data } = await api.get(`/documents/${documentId}/collaborators`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const togglePublicAccess = async (documentId, isPublic, token) => {
  const { data } = await api.patch(
    `/documents/${documentId}/public`,
    {
      isPublic,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};

export const removeCollaborator = async (documentId, userId, token) => {
  const { data } = await api.delete(
    `/documents/${documentId}/collaborators/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};

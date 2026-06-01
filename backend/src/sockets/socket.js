const activeUsers = {};

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join-document", ({ documentId, user }) => {
      socket.join(documentId);

      socket.userId = user.id;

      if (!activeUsers[documentId]) {
        activeUsers[documentId] = [];
      }

      const userExists = activeUsers[documentId].find((u) => u.id === user.id);

      if (!userExists) {
        activeUsers[documentId].push(user);
      }

      io.to(documentId).emit("active-users", activeUsers[documentId]);

      console.log(`Socket ${socket.id} joined document ${documentId}`);
    });

    socket.on("send-changes", ({ documentId, content }) => {
      socket.to(documentId).emit("receive-changes", content);
    });

    socket.on("disconnect", () => {
      for (const documentId in activeUsers) {
        activeUsers[documentId] = activeUsers[documentId].filter(
          (u) => u.id !== socket.userId,
        );

        io.to(documentId).emit("active-users", activeUsers[documentId]);
      }

      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export default initializeSocket;

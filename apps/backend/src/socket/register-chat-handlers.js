const messageService = require("../services/message-service");

function registerChatHandlers(io) {
  io.on("connection", function onConnection(socket) {
    socket.emit("connection:state", { state: "online" });

    socket.on("ticket:join", function onJoinTicket(ticketId, callback) {
      const roomName = String(ticketId || "");

      if (!roomName) {
        if (typeof callback === "function") {
          callback({ ok: false, message: "ticketId is required" });
        }
        return;
      }

      socket.join(roomName);

      if (typeof callback === "function") {
        callback({ ok: true, room: roomName });
      }
    });

    socket.on("ticket:message", async function onTicketMessage(payload, callback) {
      try {
        const ticketId = Number(payload.ticketId);
        const senderType = String(payload.senderType || "").trim();
        const messageText = String(payload.messageText || "").trim();

        if (!ticketId || !senderType || !messageText) {
          if (typeof callback === "function") {
            callback({ ok: false, message: "ticketId, senderType, and messageText are required" });
          }
          return;
        }

        const savedMessage = await messageService.insertMessage({
          ticketId: ticketId,
          senderType: senderType,
          messageText: messageText
        });

        io.to(String(savedMessage.ticketId)).emit("ticket:message", savedMessage);

        if (typeof callback === "function") {
          callback({ ok: true, message: savedMessage });
        }
      } catch (error) {
        if (typeof callback === "function") {
          callback({ ok: false, message: error.message });
        }
      }
    });
  });
}

module.exports = registerChatHandlers;

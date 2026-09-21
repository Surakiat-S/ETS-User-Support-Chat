const sqlConfig = require("../config/sql");

function mapMessage(record) {
  return {
    id: record.Id,
    ticketId: record.TicketId,
    senderType: record.SenderType,
    messageText: record.MessageText,
    createdAt: record.CreatedAt
  };
}

async function getTicketMessages(ticketId) {
  const pool = await sqlConfig.getPool();
  const request = pool.request();

  request.input("ticketId", sqlConfig.sql.Int, ticketId);

  const result = await request.query(
    "SELECT Id, TicketId, SenderType, MessageText, CreatedAt " +
      "FROM ChatMessages WHERE TicketId = @ticketId ORDER BY CreatedAt ASC;"
  );

  return result.recordset.map(mapMessage);
}

async function insertMessage(payload) {
  const pool = await sqlConfig.getPool();
  const request = pool.request();

  request.input("ticketId", sqlConfig.sql.Int, payload.ticketId);
  request.input("senderType", sqlConfig.sql.NVarChar(50), payload.senderType);
  request.input("messageText", sqlConfig.sql.NVarChar(sqlConfig.sql.MAX), payload.messageText);

  const result = await request.query(
    "INSERT INTO ChatMessages (TicketId, SenderType, MessageText, CreatedAt) " +
      "OUTPUT INSERTED.Id, INSERTED.TicketId, INSERTED.SenderType, INSERTED.MessageText, INSERTED.CreatedAt " +
      "VALUES (@ticketId, @senderType, @messageText, SYSUTCDATETIME());"
  );

  return mapMessage(result.recordset[0]);
}

module.exports = {
  getTicketMessages: getTicketMessages,
  insertMessage: insertMessage
};

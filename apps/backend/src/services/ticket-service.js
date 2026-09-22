const sqlConfig = require("../config/sql");

function mapTicket(record) {
  return {
    id: record.Id,
    locationId: record.LocationId,
    shiftName: record.ShiftName,
    category: record.Category,
    status: record.Status,
    openedAt: record.OpenedAt,
    closedAt: record.ClosedAt,
    latestMessageText: record.LatestMessageText || "",
    latestMessageAt: record.LatestMessageAt || null
  };
}

async function createTicket(payload) {
  const pool = await sqlConfig.getPool();
  const request = pool.request();

  request.input("locationId", sqlConfig.sql.Int, payload.locationId);
  request.input("shiftName", sqlConfig.sql.NVarChar(100), payload.shiftName);
  request.input("category", sqlConfig.sql.NVarChar(255), payload.category);

  const result = await request.query(
    "INSERT INTO Tickets (LocationId, ShiftName, Category, Status, OpenedAt, ClosedAt) " +
      "OUTPUT INSERTED.Id, INSERTED.LocationId, INSERTED.ShiftName, INSERTED.Category, INSERTED.Status, INSERTED.OpenedAt, INSERTED.ClosedAt, " +
      "CAST(NULL AS NVARCHAR(MAX)) AS LatestMessageText, CAST(NULL AS DATETIME2) AS LatestMessageAt " +
      "VALUES (@locationId, @shiftName, @category, 'Open', SYSUTCDATETIME(), NULL);"
  );

  return mapTicket(result.recordset[0]);
}

async function getActiveTickets() {
  const pool = await sqlConfig.getPool();
  const result = await pool.request().query(
    "SELECT t.Id, t.LocationId, t.ShiftName, t.Category, t.Status, t.OpenedAt, t.ClosedAt, " +
      "lastMessage.MessageText AS LatestMessageText, lastMessage.CreatedAt AS LatestMessageAt " +
      "FROM Tickets t " +
      "OUTER APPLY (" +
      "SELECT TOP 1 MessageText, CreatedAt FROM ChatMessages cm " +
      "WHERE cm.TicketId = t.Id ORDER BY cm.CreatedAt DESC" +
      ") lastMessage " +
      "WHERE t.Status = 'Open' " +
      "ORDER BY COALESCE(lastMessage.CreatedAt, t.OpenedAt) DESC;"
  );

  return result.recordset.map(mapTicket);
}

async function closeTicket(ticketId) {
  const pool = await sqlConfig.getPool();
  const request = pool.request();

  request.input("ticketId", sqlConfig.sql.Int, ticketId);

  const result = await request.query(
    "UPDATE Tickets " +
      "SET Status = 'Closed', ClosedAt = SYSUTCDATETIME() " +
      "OUTPUT INSERTED.Id, INSERTED.LocationId, INSERTED.ShiftName, INSERTED.Category, INSERTED.Status, INSERTED.OpenedAt, INSERTED.ClosedAt, " +
      "CAST(NULL AS NVARCHAR(MAX)) AS LatestMessageText, CAST(NULL AS DATETIME2) AS LatestMessageAt " +
      "WHERE Id = @ticketId;"
  );

  return result.recordset[0] ? mapTicket(result.recordset[0]) : null;
}

module.exports = {
  createTicket: createTicket,
  getActiveTickets: getActiveTickets,
  closeTicket: closeTicket
};

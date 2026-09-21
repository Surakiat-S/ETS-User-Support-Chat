const express = require("express");
const ticketService = require("../services/ticket-service");
const messageService = require("../services/message-service");

function createTicketsRouter(io) {
  const router = express.Router();

  router.post("/", async function createTicketHandler(req, res, next) {
    try {
      const locationId = Number(req.body.locationId);
      const shiftName = String(req.body.shiftName || "").trim();
      const category = String(req.body.category || "").trim();

      if (!locationId || !shiftName || !category) {
        res.status(400).json({ message: "locationId, shiftName, and category are required" });
        return;
      }

      const ticket = await ticketService.createTicket({
        locationId: locationId,
        shiftName: shiftName,
        category: category
      });

      io.emit("ticket:new", ticket);
      res.status(201).json(ticket);
    } catch (error) {
      next(error);
    }
  });

  router.get("/", async function getActiveTicketsHandler(req, res, next) {
    try {
      const tickets = await ticketService.getActiveTickets();
      res.json(tickets);
    } catch (error) {
      next(error);
    }
  });

  router.post("/:id/close", async function closeTicketHandler(req, res, next) {
    try {
      const ticketId = Number(req.params.id);

      if (!ticketId) {
        res.status(400).json({ message: "Valid ticket id is required" });
        return;
      }

      const ticket = await ticketService.closeTicket(ticketId);

      if (!ticket) {
        res.status(404).json({ message: "Ticket not found" });
        return;
      }

      io.emit("ticket:closed", ticket);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id/messages", async function getTicketMessagesHandler(req, res, next) {
    try {
      const ticketId = Number(req.params.id);

      if (!ticketId) {
        res.status(400).json({ message: "Valid ticket id is required" });
        return;
      }

      const messages = await messageService.getTicketMessages(ticketId);
      res.json(messages);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = createTicketsRouter;

import json

from api_client import ApiClient
from socket_client import SocketChatClient


class ChatController(object):
    def __init__(self, config):
        self._config = config
        self._api_client = ApiClient(config["api_base_url"])
        self._window = None
        self._active_ticket = None
        self._status = "Offline"
        self._socket_client = SocketChatClient(
            config["socket_url"],
            self._handle_connection_state,
            self._handle_message,
            self._handle_ticket_closed,
        )

    def bind_window(self, window):
        self._window = window

    def get_initial_state(self):
        return {
            "stationName": self._config["station_name"],
            "locationId": self._config["location_id"],
            "shiftName": self._config["shift_name"],
            "operatorName": self._config["operator_name"],
            "status": self._status,
            "activeTicket": self._active_ticket,
        }

    def open_ticket(self, category, shift_name=None):
        shift_value = (shift_name or self._config["shift_name"]).strip()
        category_value = (category or "").strip()

        if not category_value:
            raise RuntimeError("Issue category is required.")

        ticket = self._api_client.create_ticket(
            self._config["location_id"],
            shift_value,
            category_value,
        )
        self._active_ticket = ticket
        self._socket_client.connect()
        self._socket_client.join_ticket(ticket["id"])
        self._emit_ui_event(
            "ticketOpened",
            {
                "ticket": ticket,
                "messages": self._api_client.get_messages(ticket["id"]),
            },
        )
        return ticket

    def send_message(self, message_text):
        if not self._active_ticket:
            raise RuntimeError("No active ticket.")

        value = (message_text or "").strip()
        if not value:
            return

        self._socket_client.send_message(
            self._active_ticket["id"],
            "Operator",
            value,
        )

    def close_ticket(self):
        if not self._active_ticket:
            return

        ticket_id = self._active_ticket["id"]
        self._api_client.close_ticket(ticket_id)
        self._active_ticket = None
        self._socket_client.disconnect()
        self._emit_ui_event("ticketClosed", {"ticketId": ticket_id})

    def shutdown(self):
        self._socket_client.disconnect()

    def _handle_connection_state(self, status):
        self._status = status
        self._emit_ui_event("statusChanged", {"status": status})

    def _handle_message(self, message):
        self._emit_ui_event("messageReceived", {"message": message})

    def _handle_ticket_closed(self, ticket):
        self._active_ticket = None
        self._emit_ui_event("ticketClosed", {"ticketId": ticket.get("id")})

    def _emit_ui_event(self, name, payload):
        if not self._window:
            return

        script = "window.etsClient.receive({0});".format(
            json.dumps({"name": name, "payload": payload})
        )
        self._window.evaluate_js(script)

import json

from api_client import ApiClient
from socket_client import SocketChatClient


class ChatController(object):
    def __init__(self, config):
        self._config = config
        self._api_client = ApiClient(config["api_base_url"])
        self._tray = None
        self._window = None
        self._active_ticket = None
        self._status = "Offline"
        self._window_visible = not config.get("start_hidden", False)
        self._window_active = not config.get("start_hidden", False)
        self._unread_count = 0
        self._socket_client = SocketChatClient(
            config["socket_url"],
            self._handle_connection_state,
            self._handle_message,
            self._handle_ticket_closed,
        )

    def bind_tray(self, tray):
        self._tray = tray
        self._sync_tray_state()

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
        self._clear_attention()
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
        self._clear_attention()
        self._socket_client.disconnect()
        self._emit_ui_event("ticketClosed", {"ticketId": ticket_id})

    def shutdown(self):
        self._socket_client.disconnect()

    def set_window_visible(self, is_visible):
        self._window_visible = bool(is_visible)
        if self._window_visible and self._window_active:
            self._clear_attention()

    def set_window_active(self, is_active):
        self._window_active = bool(is_active)
        if self._window_visible and self._window_active:
            self._clear_attention()

    def _handle_connection_state(self, status):
        self._status = status
        self._emit_ui_event("statusChanged", {"status": status})

    def _handle_message(self, message):
        if (
            message.get("senderType") == "Admin"
            and self._active_ticket
            and message.get("ticketId") == self._active_ticket.get("id")
            and self._should_notify_attention()
        ):
            self._unread_count += 1
            self._sync_tray_state()
            self._notify_desktop(
                "ข้อความใหม่จากแอดมิน",
                "มีข้อความใหม่ในเคส #{0}".format(message.get("ticketId")),
            )
        self._emit_ui_event("messageReceived", {"message": message})

    def _handle_ticket_closed(self, ticket):
        self._active_ticket = None
        self._clear_attention()
        self._emit_ui_event("ticketClosed", {"ticketId": ticket.get("id")})

    def _emit_ui_event(self, name, payload):
        if not self._window:
            return

        script = "window.etsClient.receive({0});".format(
            json.dumps({"name": name, "payload": payload})
        )
        self._window.evaluate_js(script)

    def _should_notify_attention(self):
        return not self._window_visible or not self._window_active

    def _notify_desktop(self, title, message):
        if not self._tray:
            return

        self._tray.notify(title, message)

    def _clear_attention(self):
        self._unread_count = 0
        self._sync_tray_state()

    def _sync_tray_state(self):
        if not self._tray:
            return

        self._tray.set_unread_count(self._unread_count)

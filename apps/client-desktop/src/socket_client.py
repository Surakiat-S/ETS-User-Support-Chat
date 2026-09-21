import socketio


class SocketChatClient(object):
    def __init__(self, socket_url, on_state, on_message, on_ticket_closed):
        self._socket_url = socket_url
        self._on_state = on_state
        self._on_message = on_message
        self._on_ticket_closed = on_ticket_closed
        self._active_ticket_id = None
        self._intentional_disconnect = False
        self._client = socketio.Client(
            reconnection=True,
            reconnection_attempts=0,
            reconnection_delay=1,
            reconnection_delay_max=5,
            logger=False,
            engineio_logger=False,
        )
        self._register_handlers()

    def _register_handlers(self):
        @self._client.event
        def connect():
            self._intentional_disconnect = False
            self._on_state("Online")
            if self._active_ticket_id:
                self.join_ticket(self._active_ticket_id)

        @self._client.event
        def disconnect():
            if self._intentional_disconnect:
                self._on_state("Offline")
            else:
                self._on_state("Retrying")

        @self._client.event
        def connect_error(data):
            self._on_state("Retrying")

        @self._client.on("connection:state")
        def on_connection_state(payload):
            if payload and payload.get("state") == "online":
                self._on_state("Online")

        @self._client.on("ticket:message")
        def on_ticket_message(message):
            self._on_message(message)

        @self._client.on("ticket:closed")
        def on_ticket_closed(ticket):
            if self._active_ticket_id and ticket.get("id") == self._active_ticket_id:
                self._active_ticket_id = None
                self._on_ticket_closed(ticket)
                self._on_state("Offline")

    def connect(self):
        if self._client.connected:
            return

        self._client.connect(
            self._socket_url,
            transports=["websocket", "polling"],
            wait_timeout=10,
        )

    def disconnect(self):
        self._intentional_disconnect = True
        self._active_ticket_id = None
        if self._client.connected:
            self._client.disconnect()
        else:
            self._on_state("Offline")

    def join_ticket(self, ticket_id):
        self._active_ticket_id = ticket_id
        self._client.emit("ticket:join", ticket_id)

    def send_message(self, ticket_id, sender_type, message_text):
        self._client.emit(
            "ticket:message",
            {
                "ticketId": ticket_id,
                "senderType": sender_type,
                "messageText": message_text,
            },
        )

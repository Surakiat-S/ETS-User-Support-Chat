import os
import sys

import webview


def get_base_dir():
    if getattr(sys, "frozen", False):
        return sys._MEIPASS
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class ApiBridge(object):
    def __init__(self, controller):
        self._controller = controller
        self._window = None

    def bind_window(self, window):
        self._window = window
        self._controller.bind_window(window)

    def get_initial_state(self):
        return self._controller.get_initial_state()

    def open_ticket(self, category, shift_name):
        return self._controller.open_ticket(category, shift_name)

    def send_message(self, message_text):
        self._controller.send_message(message_text)
        return {"ok": True}

    def close_ticket(self):
        self._controller.close_ticket()
        return {"ok": True}

    def hide_window(self):
        if self._window:
            self._window.hide()
        return {"ok": True}


def create_window(controller, start_hidden):
    bridge = ApiBridge(controller)
    html_path = os.path.join(get_base_dir(), "web", "index.html")
    window = webview.create_window(
        "ETS Support",
        html_path,
        js_api=bridge,
        width=380,
        height=620,
        resizable=False,
        hidden=start_hidden,
    )
    bridge.bind_window(window)
    return window

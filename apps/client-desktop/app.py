import os
import sys

import webview

if getattr(sys, "frozen", False):
    BASE_DIR = os.path.dirname(sys.executable)
else:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.join(BASE_DIR, "src")

if SRC_DIR not in sys.path:
    sys.path.insert(0, SRC_DIR)

from chat_controller import ChatController
from config_loader import load_config
from tray import start_tray
from window import create_window


def main():
    config = load_config(BASE_DIR)
    controller = ChatController(config)
    window = create_window(controller, config["start_hidden"])

    def show_window():
        window.show()
        window.restore()

    def hide_window():
        window.hide()

    def exit_app():
        controller.shutdown()
        window.destroy()

    start_tray(show_window, hide_window, exit_app)
    webview.start(debug=False)


if __name__ == "__main__":
    main()

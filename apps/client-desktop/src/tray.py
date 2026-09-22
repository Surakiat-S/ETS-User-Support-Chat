import threading

import pystray
from PIL import Image, ImageDraw


def _create_image():
    image = Image.new("RGB", (64, 64), "#2563eb")
    draw = ImageDraw.Draw(image)
    draw.rectangle((10, 10, 54, 54), outline="white", width=4)
    draw.text((19, 18), "ET", fill="white")
    return image


class TrayController(object):
    def __init__(self, icon):
        self._icon = icon
        self._default_title = "ETS Support"

    def notify(self, title, message):
        try:
            self._icon.notify(message, title)
        except Exception:
            pass

    def set_unread_count(self, count):
        if count > 0:
            self._icon.title = "{0} ({1})".format(self._default_title, count)
        else:
            self._icon.title = self._default_title


def start_tray(on_show, on_hide, on_exit):
    icon = pystray.Icon(
        "ets-support-chat",
        _create_image(),
        "ETS Support",
        menu=pystray.Menu(
            pystray.MenuItem("แสดงหน้าต่าง", lambda icon, item: on_show()),
            pystray.MenuItem("ซ่อนหน้าต่าง", lambda icon, item: on_hide()),
            pystray.MenuItem("ออกจากโปรแกรม", lambda icon, item: _exit(icon, on_exit)),
        ),
    )

    worker = threading.Thread(target=icon.run, daemon=True)
    worker.start()
    return TrayController(icon)


def _exit(icon, on_exit):
    on_exit()
    icon.stop()

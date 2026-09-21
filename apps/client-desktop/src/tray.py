import threading

import pystray
from PIL import Image, ImageDraw


def _create_image():
    image = Image.new("RGB", (64, 64), "#2563eb")
    draw = ImageDraw.Draw(image)
    draw.rectangle((10, 10, 54, 54), outline="white", width=4)
    draw.text((19, 18), "ET", fill="white")
    return image


def start_tray(on_show, on_hide, on_exit):
    icon = pystray.Icon(
        "ets-support-chat",
        _create_image(),
        "ETS Support",
        menu=pystray.Menu(
            pystray.MenuItem("Show", lambda icon, item: on_show()),
            pystray.MenuItem("Hide", lambda icon, item: on_hide()),
            pystray.MenuItem("Exit", lambda icon, item: _exit(icon, on_exit)),
        ),
    )

    worker = threading.Thread(target=icon.run, daemon=True)
    worker.start()
    return icon


def _exit(icon, on_exit):
    on_exit()
    icon.stop()

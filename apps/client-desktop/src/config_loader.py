import configparser
import os


def load_config(base_dir):
    config_path = os.path.join(base_dir, "config.ini")
    sample_path = os.path.join(base_dir, "config.sample.ini")

    if not os.path.exists(config_path):
        raise RuntimeError("Missing config.ini. Copy config.sample.ini and adjust the values.")

    parser = configparser.ConfigParser()
    parser.read(config_path)

    if "client" not in parser:
        raise RuntimeError("Missing [client] section in config.ini")

    client = parser["client"]
    station_name = client.get("station_name", "").strip()
    location_id = client.getint("location_id", fallback=0)
    shift_name = client.get("shift_name", "").strip()
    operator_name = client.get("operator_name", "Operator").strip()
    api_base_url = client.get("api_base_url", "").strip().rstrip("/")
    socket_url = client.get("socket_url", "").strip().rstrip("/")
    start_hidden = client.getboolean("start_hidden", fallback=False)

    if not station_name or not location_id or not shift_name or not api_base_url or not socket_url:
        raise RuntimeError(
            "config.ini must define station_name, location_id, shift_name, api_base_url, and socket_url."
        )

    return {
        "config_path": config_path,
        "sample_path": sample_path,
        "station_name": station_name,
        "location_id": location_id,
        "shift_name": shift_name,
        "operator_name": operator_name,
        "api_base_url": api_base_url,
        "socket_url": socket_url,
        "start_hidden": start_hidden,
    }

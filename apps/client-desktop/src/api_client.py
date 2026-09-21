import requests


class ApiClient(object):
    def __init__(self, base_url):
        self._base_url = base_url.rstrip("/")
        self._session = requests.Session()
        self._session.headers.update({"Content-Type": "application/json"})

    def create_ticket(self, location_id, shift_name, category):
        response = self._session.post(
            self._base_url + "/api/tickets",
            json={
                "locationId": location_id,
                "shiftName": shift_name,
                "category": category,
            },
            timeout=15,
        )
        response.raise_for_status()
        return response.json()

    def get_messages(self, ticket_id):
        response = self._session.get(
            self._base_url + "/api/tickets/{0}/messages".format(ticket_id),
            timeout=15,
        )
        response.raise_for_status()
        return response.json()

    def close_ticket(self, ticket_id):
        response = self._session.post(
            self._base_url + "/api/tickets/{0}/close".format(ticket_id),
            timeout=15,
        )
        response.raise_for_status()

import datetime
from http.cookiejar import CookieJar
import requests


class HoyolabAccount:
    def __init__(self, cookie_jar: CookieJar):
        cookie_dict: dict = requests.utils.dict_from_cookiejar(cookie_jar)

        self._session = requests.Session()
        self._session.cookies.update(cookie_dict)
        self._account_data = self.get_account_data()["data"]

        self.ltuid = cookie_dict["ltuid_v2"]
        self.nickname = self._account_data["nickname"]
        self.human_expiration_date = datetime.datetime.fromtimestamp(cookie_dict["expires"]).strftime("%Y-%M-%D")

    def get_account_username(self):
        # todo: Error Handling
        res = self._session.get(f"https://bbs-api-os.hoyolab.com/community/painter/wapi/user/full?uid={self.ltuid}")
        return res.json()["data"]["user_info"]["nickname"]

    def get_account_data(self):
        res = self._session.get(f"https://bbs-api-os.hoyolab.com/community/painter/wapi/user/full?uid={self.ltuid}")
        return res.json()

    def get_genshin_account(self):
        res = self._session.get(f"https://bbs-api-os.hoyolab.com/game_record/card/wapi/getGameRecordCard?uid={self.ltuid}",
                                headers={"x-rpc-language": "en-us"})
        return res.json()

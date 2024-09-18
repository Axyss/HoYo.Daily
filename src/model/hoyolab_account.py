from http.cookiejar import CookieJar
import requests
from requests import Session


class HoyolabAccount:
    def __init__(self, cookie_jar: CookieJar):
        cookie_dict: dict = requests.utils.dict_from_cookiejar(cookie_jar)

        self._session: Session = Session()
        self._session.cookies.update(cookie_dict)

        self.uid: str = cookie_dict["ltuid_v2"]
        # self.human_expiration_date: str = datetime.datetime.fromtimestamp(cookie_dict["expires"]).strftime("%Y-%M-%D")

        self._account_data: dict = self.get_hoyolab_data()
        self._genshin_data: dict = self.get_genshin_accounts() # todo Support Multiple Genshin Accounts

    # Properties
    @property
    def hoyo_nick(self):
        return self._account_data["nickname"]

    @property
    def genshin_nick(self):
        return self._genshin_data["role"]["nickname"]

    @property
    def genshin_uid(self):
        return self._genshin_data["nickname"]

    @property
    def genshin_level(self):
        return self._genshin_data["role"]["level"]

    @property
    def genshin_avatar_url(self):
        return self._genshin_data["role"]["game_head_icon"]

    # Regular Methods
    def get_hoyolab_data(self):
        res = self._session.get(f"https://bbs-api-os.hoyolab.com/community/painter/wapi/user/full?uid={self.uid}")
        return res.json()["data"]["user_info"]

    # todo Another Call to Retrieve Genshin UID is Needed
    def get_genshin_accounts(self) -> dict:
        res = self._session.get(f"https://bbs-api-os.hoyolab.com/game_record/genshin/api/index?server=os_euro&role_id=721959946",
                                headers={"x-rpc-language": "en-us"})
        return res.json()["data"]

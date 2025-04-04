import pprint
from http.cookiejar import CookieJar

import requests
import rookiepy
from PySide6 import QtCore
from PySide6.QtCore import QFile
from PySide6.QtGui import QPixmap, Qt
from PySide6.QtWidgets import QLabel, QWidget
from model.hoyolab_account import HoyolabAccount

if __name__ == "__main__":
    
    import sys
    from PySide6 import QtWidgets
    from PySide6.QtUiTools import QUiLoader

    loader = QUiLoader()
    app = QtWidgets.QApplication(sys.argv)
    window = loader.load("view/untitled.ui", None)


    HOYO_DOMAIN = "hoyoverse.com"

    cookie_jar = rookiepy.to_cookiejar(rookiepy.edge([HOYO_DOMAIN]))

    account = HoyolabAccount(cookie_jar)

    pixmap = QPixmap()
    request = requests.get(account.genshin_avatar_url)
    pixmap.loadFromData(request.content)

    width = window.findChild(QLabel, "label_2").width()
    height = window.findChild(QLabel, "label_2").height()

    pixmap = pixmap.scaled(width, height, mode=QtCore.Qt.TransformationMode.SmoothTransformation)

    window.findChild(QLabel, "label_2").setPixmap(pixmap)
    window.findChild(QLabel, "label_3").setText(account.genshin_nick)
    window.findChild(QLabel, "label_5").setText(f"AR {account.genshin_level}")

    # Testing area (a.k.a everything's broken)
    ui_file = QFile("view/component.ui")  # Ensure the file path is correct
    ui_file.open(QFile.ReadOnly)

    external_component = loader.load(ui_file, window)
    ui_file.close()

    # Add the external component to the layout
    scroll_area_contents = window.findChild(QWidget, "scrollAreaWidgetContents").layout()


    # Add the external component dynamically to the scroll area's contents
    scroll_area_contents.addWidget(external_component)

    window.show()
    app.exec()


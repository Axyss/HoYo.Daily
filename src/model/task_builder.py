import datetime
from datetime import timedelta
from enum import Enum

import win32com.client


class LogonType(Enum):
    TASK_LOGON_NONE = 0
    TASK_LOGON_PASSWORD = 1
    TASK_LOGON_S4U = 2
    TASK_LOGON_INTERACTIVE_TOKEN = 3
    TASK_LOGON_GROUP = 4
    TASK_LOGON_SERVICE_ACCOUNT = 5
    TASK_LOGON_INTERACTIVE_TOKEN_OR_PASSWORD = 6

class RegisterType(Enum):
    TASK_VALIDATE_ONLY = 1
    TASK_CREATE = 2
    TASK_UPDATE = 4
    TASK_CREATE_OR_UPDATE = 6
    TASK_DISABLE = 8
    TASK_DONT_ADD_PRINCIPAL_ACE = 0x10
    TASK_IGNORE_REGISTRATION_TRIGGERS = 0x20

class TaskTriggerType(Enum):
    EVENT = 0
    TIME = 1
    DAILY = 2
    WEEKLY = 3
    MONTHLY = 4
    MONTHLYDOW = 5
    IDLE = 6
    REGISTRATION = 7
    BOOT = 8
    LOGON = 9
    SESSION_STATE_CHANGE = 11


class TaskBuilder:
    _win_scheduler = win32com.client.Dispatch("Schedule.Service")
    _win_scheduler.Connect()

    def __init__(self, task_folder_name=None):
        if task_folder_name is not None and not self._task_folder_exists(task_folder_name):
            self._task_folder = self._win_scheduler.GetFolder(f"\\").CreateFolder(task_folder_name)
        else:
            self._task_folder = self._win_scheduler.GetFolder("\\")  # Creates tasks on root if task_folder_name
                                                                     # is None
        self._task = self._win_scheduler.NewTask(0)
        self._trigger = None

        # Common generic settings
        self._task.Settings.StopIfGoingOnBatteries = False
        self._task.Settings.DisallowStartIfOnBatteries = False
        self._task.Settings.StartWhenAvailable = True
        self._task.Settings.RunOnlyIfNetworkAvailable = True

    def _task_folder_exists(self, task_folder_name: str):
        try:
            self._win_scheduler.GetFolder(f"\\{task_folder_name}")
            return True
        except AttributeError:
            return False

    def set_repetition_interval(self, interval: TaskTriggerType , start_date: datetime.datetime):
        self._trigger = self._task.Triggers.Create(interval.value)
        self._trigger.StartBoundary = start_date.isoformat()

    def set_restart_policy(self, interval: str, count: int):
        self._task.Settings.RestartInterval = interval
        self._task.Settings.RestartCount = count

    def add_action(self, program, arguments):
        action = self._task.Actions.Create(0)  # TASK_ACTION_EXEC = 0
        action.Path = program
        action.Arguments = arguments

    def register(self, task_name: str, register_mode: RegisterType = RegisterType.TASK_CREATE_OR_UPDATE):
        self._task_folder.RegisterTaskDefinition(
            task_name,
            self._task,
            register_mode.value,
            "",  # No user
            "",  # No password
            LogonType.TASK_LOGON_NONE.value
        )

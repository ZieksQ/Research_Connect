from enum import Enum

class User_Roles(Enum):
    USER = "user"
    ADMIN = "admin"

class QuestionType(Enum):
    # Text/essay, or word style quesiton
    SHORTTEXT = "shortText"
    LONGTEXT = "longText"

    # Choices question type
    RADIOBUTTON = "radioButton"
    CHECKBOX = "checkBox"
    DROPDOWN = "dropdown"

    # Miscellaneous Quesiton Type
    RATING = "rating"
    DATE = "date"
    EMAIL = "email"

class PostStatus(Enum):
    OPEN = "open"
    CLOSED = "closed"
    REJECTED = "rejected"

class Question_type_inter:
    CHOICES_TYPE_WEB = ("radioButton", "checkBox", "dropdown")
    CHOICES_TYPE_MOBILE = ("radioButton", "checkBox", "dropdown")
    CHOICES_MAX_MIN_TYPE_MOBILE = ("checkBox", "dropdown")
    Q_TYPE_WEB =    ("shortText", "longText", "radioButton", "checkBox", "rating", "dropdown", "date", "email", "number")
    Q_TYPE_MOBILE = ("shortText", "longText", "radioButton", "checkBox", "rating", "dropdown", "date", "email", "number")
    WORD_TYPE = (QuestionType.SHORTTEXT.value, QuestionType.LONGTEXT.value)
    MISC_TYPE = (QuestionType.RATING.value, QuestionType.DATE.value, QuestionType.EMAIL.value)
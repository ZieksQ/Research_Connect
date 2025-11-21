from enum import Enum

class User_Roles(Enum):
    USER = "user"
    ADMIN = "admin"

class QuestionType(Enum):
    # Text/essay, or word style quesiton
    TEXT = "text"
    ESSAY = "essay"

    # Choices question type
    SINGLE_CHOICE = "single_choice"
    MULTIPLE_CHOICE = "multiple_choice"
    DROPDOWN = "dropdown"

    # Miscellaneous Quesiton Type
    RATING = "rating"
    DATE = "date"
    EMAIL = "email"

class Question_type_inter:
    WORD_TYPE = (QuestionType.TEXT.value, QuestionType.ESSAY.value)
    CHOICES_TYPE_WEB = ("Multiple Choice", "Single Choice", "Dropdown")
    CHOICES_TYPE_MOBILE = ("multipleChoice", "checkboxes", "dropdown", "linearScale", "yesNo", "imageChoice")
    # Q_TYPE_WEB = ("Text", "Essay", "Single Choice", "Multiple Choice", "Dropdown", "Rating", "Date", "Email", "shortText")
    Q_TYPE_WEB = ("shortText", "longText", "singleChoice", "multipleChoice", "rating", "dropdown", "date", "email")
    Q_TYPE_MOBILE = ("multipleChoice", "checkboxes", "ratingScale", "shortText", "longText", "yesNo", "dropdown")
    MISC_TYPE = (QuestionType.RATING.value, QuestionType.DATE.value, QuestionType.EMAIL.value)
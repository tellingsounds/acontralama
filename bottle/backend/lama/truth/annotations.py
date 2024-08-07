from enum import Enum, unique, auto


@unique
class AnnotationFields(Enum):
    attribution = auto()
    comment = auto()
    confidence = auto()
    date = auto()
    metaDate = auto()
    quotes = auto()
    quoteEntities = auto()
    role = auto()
    target = auto()
    timecodeEnd = auto()
    timecodeStart = auto()
    onSite = auto()
    diegetic = auto()

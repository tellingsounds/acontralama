from enum import Enum, unique, auto


@unique
class AnalysisCategories(Enum):
    AAbstractOther = auto()
    AAesthetics = auto()
    ACulturalPractice = auto()
    AEconomy = auto()
    AGender = auto()
    AIdentity = auto()
    AMedia = auto()
    AMemory = auto()
    APastPresentFuture = auto()
    APolitics = auto()
    ASciencesHumanities = auto()


A = AnalysisCategories

analysis_cat_labels = {
    A.AAbstractOther: "Abstract/Other",
    A.AAesthetics: "Aesthetics",
    A.ACulturalPractice: "Cultural Practice",
    A.AEconomy: "Economy",
    A.AGender: "Gender",
    A.AIdentity: "Identity",
    A.AMedia: "Media",
    A.AMemory: "Memory",
    A.APastPresentFuture: "Past/Present/Future",
    A.APolitics: "Politics",
    A.ASciencesHumanities: "Sciences/Humanities",
}

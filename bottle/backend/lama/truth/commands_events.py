from enum import Enum, unique, auto


@unique
class Commands(Enum):
    # annotations
    CreateAnnotation = auto()
    UpdateAnnotation = auto()
    DeleteAnnotation = auto()
    # clips
    CreateClip = auto()
    UpdateClip = auto()
    DeleteClip = auto()
    SetClipFavoriteStatus = auto()
    # elements
    CreateElement = auto()
    UpdateElement = auto()
    DeleteElement = auto()
    # layers
    CreateLayer = auto()
    UpdateLayer = auto()
    DeleteLayer = auto()
    # entities
    CreateEntity = auto()
    UpdateEntity = auto()
    DeleteEntity = auto()
    AddEntityRelation = auto()
    # RemoveEntityRelation = auto()
    # segments
    CreateSegment = auto()
    UpdateSegment = auto()
    DeleteSegment = auto()
    UpdateSegmentAnnots = auto()


@unique
class Events(Enum):
    AnnotationCreated = auto()
    AnnotationDeleted = auto()
    AnnotationUpdated = auto()
    ClipCreated = auto()
    ClipDeleted = auto()
    ClipUpdated = auto()
    ClipFavoriteStatusSet = auto()
    ElementCreated = auto()
    ElementDeleted = auto()
    ElementUpdated = auto()
    LayerCreated = auto()
    LayerDeleted = auto()
    LayerUpdated = auto()
    EntityCreated = auto()
    EntityDeleted = auto()
    EntityUpdated = auto()
    EntityRelationAdded = auto()
    EntityRelationRemoved = auto()
    SegmentAnnotsUpdated = auto()
    SegmentCreated = auto()
    SegmentDeleted = auto()
    SegmentUpdated = auto()
    # specials
    AnalysisCatsAttributesSet = auto()
    EntityRenamedMerged = auto()
    FieldAdded = auto()
    FieldValueSet = auto()
    RelationRenamed = auto()
    MongoStateLoaded = auto()


EVENT_VERSIONS = {
    Events.SegmentCreated: 2,
    Events.SegmentUpdated: 2,
    Events.ElementCreated: 2,
    Events.ElementUpdated: 2,
    Events.LayerCreated: 2,
    Events.LayerUpdated: 2,
}


def get_event_version(event_name):
    return EVENT_VERSIONS.get(event_name, 1)

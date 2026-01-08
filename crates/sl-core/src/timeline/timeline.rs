use crate::timeline::timeline_item::TimelineItem;

pub struct TimelineProperties {
    pub(crate) width: u32,
    pub(crate) height: u32,
    pub(crate) framerate: f32,
}

pub struct Timeline {
    pub(crate) properties: TimelineProperties,
    pub(crate) items: Vec<TimelineItem>,
}

use sl_core::timeline::timeline_item::TimelineItemRef;

#[napi]
pub struct JsTimelineItem {
    pub(crate) inner: TimelineItemRef,
}

#[napi]
impl JsTimelineItem {}

impl From<TimelineItemRef> for JsTimelineItem {
    fn from(inner: TimelineItemRef) -> Self {
        Self { inner }
    }
}

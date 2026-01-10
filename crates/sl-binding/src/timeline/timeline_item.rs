use sl_core::timeline::timeline_item::TimelineItemRef;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct JsTimelineItem {
    pub(crate) inner: TimelineItemRef,
}

#[wasm_bindgen]
impl JsTimelineItem {}

impl From<TimelineItemRef> for JsTimelineItem {
    fn from(inner: TimelineItemRef) -> Self {
        Self { inner }
    }
}

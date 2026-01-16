use sl_core::timeline::timeline_item::{TimelineItem, TimelineItemRef};
use wasm_bindgen::prelude::*;

use crate::timeline::timeline_pos::JsTimelineRangePos;

#[wasm_bindgen]
pub struct JsTimelineItem(pub(crate) TimelineItemRef);

#[wasm_bindgen]
impl JsTimelineItem {
    #[wasm_bindgen(constructor)]
    pub fn new(position: JsTimelineRangePos) -> Self {
        Self(TimelineItemRef::new(TimelineItem::new(position.into())))
    }

    #[wasm_bindgen(getter, js_name = position)]
    pub fn get_pos(&self) -> JsTimelineRangePos {
        self.0.pos.read().clone().into()
    }
    #[wasm_bindgen(setter, js_name = position)]
    pub fn set_pos(&self, pos: JsTimelineRangePos) {
        *self.0.pos.write() = pos.into();
    }
}

impl From<TimelineItemRef> for JsTimelineItem {
    fn from(inner: TimelineItemRef) -> Self {
        Self(inner)
    }
}

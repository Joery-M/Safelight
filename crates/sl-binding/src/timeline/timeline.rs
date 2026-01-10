use sl_core::timeline::timeline::Timeline;
use wasm_bindgen::prelude::*;

use crate::{
    project::project::JsProject,
    timeline::{timeline_item::JsTimelineItem, timeline_properties::JsTimelineProperties},
};

#[wasm_bindgen]
pub struct JsTimeline {
    pub(crate) inner: Timeline,
}

#[wasm_bindgen]
impl JsTimeline {
    #[wasm_bindgen(constructor)]
    pub fn new(properties: JsTimelineProperties) -> Self {
        Self {
            inner: Timeline::new(properties.into()),
        }
    }

    #[wasm_bindgen(js_name = addToProject)]
    pub async fn add_to_project(&self, project: &JsProject, bin_path: String) {
        self.inner.add_to_project(&project.inner, bin_path).await;
    }

    #[wasm_bindgen(js_name = id, getter)]
    pub fn get_id(&self) -> String {
        self.inner.id.clone()
    }

    #[wasm_bindgen(js_name = newTimelineItem)]
    pub fn new_timeline_item(&self, start: u32, end: u32, layer: u8) -> JsTimelineItem {
        self.inner.new_timeline_item(start, end, layer).into()
    }

    #[wasm_bindgen(js_name = deleteTimelineItem)]
    pub async fn delete_timeline_item(&self, id: String) {
        self.inner.delete_timeline_item(&id).await
    }
}

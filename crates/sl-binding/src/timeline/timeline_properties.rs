use serde::{Deserialize, Serialize};
use sl_core::timeline::timeline::TimelineProperties;
use tsify::Tsify;
use wasm_bindgen::prelude::*;

#[derive(Tsify, Serialize, Deserialize)]
#[tsify(into_wasm_abi, from_wasm_abi)]
#[serde(rename_all = "camelCase")]
pub struct JsTimelineProperties {
    /// The width of the timeline's output frame
    pub width: u32,
    /// The height of the timeline's output frame
    pub height: u32,
    /// The framerate of the timeline
    pub frame_rate: u16,
}

impl From<JsTimelineProperties> for TimelineProperties {
    fn from(val: JsTimelineProperties) -> Self {
        TimelineProperties {
            width: val.width,
            height: val.height,
            frame_rate: val.frame_rate,
        }
    }
}

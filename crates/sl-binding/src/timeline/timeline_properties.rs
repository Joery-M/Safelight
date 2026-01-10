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
    /// The duration of each frame in milliseconds
    ///
    /// Representing in ms does mean our FPS is capped at 1000, but that is a problem for future me
    pub frame_duration: u16,
}

impl From<JsTimelineProperties> for TimelineProperties {
    fn from(val: JsTimelineProperties) -> Self {
        TimelineProperties {
            width: val.width,
            height: val.height,
            frame_duration: val.frame_duration,
        }
    }
}

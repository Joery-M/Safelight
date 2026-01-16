use serde::{Deserialize, Serialize};
use sl_core::timeline::timeline_pos::TimelineRangePos;
use tsify::Tsify;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Tsify, Serialize, Deserialize)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct JsTimelineRangePos {
    /// Start position of this item in frames.
    start: u32,
    /// End position of this item in frames.
    end: u32,
    /// The timeline layer of this item
    layer: u8,
}

#[wasm_bindgen]
impl JsTimelineRangePos {
    // TODO: This can probably be done better to not repeat code
    //
    // And also this is very inefficient since it has to serialize and deserialize 2 structs for some basic numeric math.
    pub fn intersects(&self, other: &JsTimelineRangePos) -> bool {
        other.layer == self.layer
            && ((other.start <= self.end && other.end >= self.start)
                || (other.end >= self.start && other.start <= self.start))
    }
}

impl From<TimelineRangePos> for JsTimelineRangePos {
    fn from(value: TimelineRangePos) -> Self {
        let pos = value.get_pos();
        Self {
            start: pos.0,
            end: pos.1,
            layer: pos.2,
        }
    }
}

impl From<JsTimelineRangePos> for TimelineRangePos {
    fn from(value: JsTimelineRangePos) -> Self {
        Self::new(value.start, value.end, value.layer)
    }
}

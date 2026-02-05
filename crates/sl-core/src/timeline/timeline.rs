use dashmap::DashMap;
use nanoid::nanoid;
use sl_macros::DebugDrop;
use tracing::debug;

use crate::timeline::timeline_item::TimelineItemRef;

#[derive(Debug)]
pub struct TimelineProperties {
    /// The width of the timeline's output frame
    pub width: u32,
    /// The height of the timeline's output frame
    pub height: u32,
    /// The framerate of the timeline
    // TODO: This currently doesn't support fractional framerates, revisit later
    pub frame_rate: u16,
}

#[derive(Debug, DebugDrop)]
#[debug_drop_id = "id"]
pub struct Timeline {
    pub id: String,
    pub properties: TimelineProperties,
    pub items: DashMap<String, TimelineItemRef>,
}

impl Timeline {
    pub fn new(properties: TimelineProperties) -> Self {
        let id = nanoid!();
        debug!("Created new timeline with ID {id:?}");
        Self {
            id,
            properties,
            items: DashMap::new(),
        }
    }

    pub fn get_timeline_items(&self) -> Vec<TimelineItemRef> {
        self.items.iter().map(|v| v.clone()).collect()
    }

    /// Add a timeline item at a position.
    ///
    /// It is expected that the position has already been checked to not
    /// intersect with any other timeline items.
    pub fn add_timeline_item(&self, item_ref: &TimelineItemRef) {
        let item_id = item_ref.id.clone();
        self.items.insert(item_id, item_ref.clone());
    }

    pub fn get_timeline_item(&self, id: &str) -> Option<TimelineItemRef> {
        self.items.get(id).map(|v| v.clone())
    }

    pub fn delete_timeline_item(&self, id: &str) {
        self.items.remove(id);
    }
}

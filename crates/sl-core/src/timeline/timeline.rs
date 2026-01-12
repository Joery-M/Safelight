use dashmap::DashMap;
use log::debug;
use nanoid::nanoid;
use sl_macros::DebugDrop;

use crate::timeline::timeline_item::{TimelineItem, TimelineItemRef};

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

    pub fn new_timeline_item(&self, start: u32, end: u32, layer: u8) -> TimelineItemRef {
        let item = TimelineItem::new(start, end, layer);
        let item_id = item.id.clone();
        let item_ref = TimelineItemRef::new(item);
        self.items.insert(item_id, item_ref.clone());
        item_ref
    }

    pub fn get_timeline_item(&self, id: &str) -> Option<TimelineItemRef> {
        self.items.get(id).map(|v| v.clone())
    }

    pub async fn delete_timeline_item(&self, id: &str) {
        self.items.remove(id);
    }
}

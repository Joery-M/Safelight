use std::sync::Arc;

use dashmap::DashMap;
use nanoid::nanoid;
use tokio::sync::RwLock;

use crate::{
    asset::{AssetRef, asset::TimelineAsset},
    project::project::Project,
    timeline::timeline_item::{TimelineItem, TimelineItemRef},
    utils::asset_path::AssetPath,
};

pub struct TimelineProperties {
    /// The width of the timeline's output frame
    pub width: u32,
    /// The height of the timeline's output frame
    pub height: u32,
    /// The duration of each frame in milliseconds
    ///
    /// Representing in ms does mean our FPS is capped at 1000, but that is a problem for future me
    pub frame_duration: u16,
}

pub struct Timeline {
    pub id: String,
    pub properties: TimelineProperties,
    pub items: DashMap<String, TimelineItemRef>,
}

impl Timeline {
    pub fn new(project: &Project, properties: TimelineProperties) -> Self {
        let id = nanoid!();
        let asset_path = AssetPath::new(true, "timeline", &id);
        let timeline_asset = TimelineAsset(asset_path.clone());

        project.create_asset(
            asset_path.clone(),
            AssetRef::new(Arc::new(RwLock::new(timeline_asset))),
        );
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
        if let Some(item) = self.items.get(id) {
            item.mutate().await.delete();
            self.items.remove(id);
        }
    }
}

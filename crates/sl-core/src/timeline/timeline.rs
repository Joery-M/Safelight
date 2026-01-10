use std::sync::Arc;

use dashmap::DashMap;
use nanoid::nanoid;
use tokio::sync::RwLock;

use crate::{
    asset::{AssetRef, asset::TimelineAsset},
    media_bin::media_bin_item::BinItemType,
    project::project::Project,
    timeline::timeline_item::{TimelineItem, TimelineItemRef},
    utils::asset_path::AssetPath,
};

pub struct TimelineProperties {
    /// The width of the timeline's output frame
    pub width: u32,
    /// The height of the timeline's output frame
    pub height: u32,
    /// The framerate of the timeline
    // TODO: This currently doesn't support fractional framerates, revisit later
    pub frame_rate: u16,
}

pub struct Timeline {
    pub id: String,
    pub properties: TimelineProperties,
    pub items: DashMap<String, TimelineItemRef>,
}

impl Timeline {
    pub fn new(properties: TimelineProperties) -> Self {
        Self {
            id: nanoid!(),
            properties,
            items: DashMap::new(),
        }
    }

    pub async fn add_to_project(&self, project: &Project, bin_path: String) {
        let asset_path = AssetPath::new(true, "timeline", &self.id);
        let timeline_asset = TimelineAsset(asset_path.clone());
        let asset = AssetRef::new(Arc::new(RwLock::new(timeline_asset)));

        project.create_asset(asset_path.clone(), asset.clone());

        project
            .get_media_bin()
            .create(BinItemType::Media {
                inner: asset,
                bin_path: bin_path.into(),
            })
            .await;
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

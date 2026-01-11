use dashmap::DashMap;
use log::debug;
use nanoid::nanoid;

use crate::{
    asset::asset::{Asset, TimelineAsset},
    media_bin::media_bin_item::BinItemType,
    project::project::Project,
    timeline::timeline_item::{TimelineItem, TimelineItemRef},
    utils::{asset_path::AssetPath, asset_path_namespace::AssetPathNamespace},
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
        let id = nanoid!();
        debug!("Created new timeline with ID {id:?}");
        Self {
            id,
            properties,
            items: DashMap::new(),
        }
    }

    pub async fn add_to_project(&self, project: &Project, bin_path: String) {
        let asset_path = AssetPath::new(true, AssetPathNamespace::Timeline, &self.id);
        let timeline_asset = TimelineAsset(asset_path.clone());
        let asset = Asset::Timeline(timeline_asset);

        project.create_asset(asset_path.clone(), asset);

        project
            .get_media_bin()
            .create(BinItemType::Media {
                asset_path,
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

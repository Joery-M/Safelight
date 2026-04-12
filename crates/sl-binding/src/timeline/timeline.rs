use std::sync::Arc;

use sl_core::{
    asset::asset::{Asset, TimelineAsset},
    storage::storage::StorageManager,
    timeline::{timeline::Timeline, timeline_item::TimelineItem, timeline_pos::TimelineRangePos},
    utils::{asset_path::AssetPath, asset_path_namespace::AssetPathNamespace},
};
use wasm_bindgen::prelude::*;

use crate::{
    media_bin::media_bin::{JsBinItemType, JsMediaBin},
    project::project::JsProject,
    storage::storage::JsBrowserStorage,
    timeline::{timeline_item::JsTimelineItem, timeline_properties::JsTimelineProperties},
    utils::Result,
};

#[wasm_bindgen]
pub struct JsTimeline {
    pub(crate) inner: Arc<Timeline>,
}

#[wasm_bindgen]
impl JsTimeline {
    /// This function does 3 things:
    ///  1. Add the timeline to the storage (consuming Self)
    ///  2. Add the asset to the project's asset map
    ///  3. Create a media bin item
    pub fn create(
        project: &JsProject,
        storage: &JsBrowserStorage,
        bin: &JsMediaBin,
        bin_path: String,
        properties: JsTimelineProperties,
    ) -> Result<Self> {
        let timeline = Timeline::new(properties.into());
        let asset_path = AssetPath::new(true, AssetPathNamespace::Timeline, &timeline.id);

        let timeline_asset = TimelineAsset::new(asset_path.clone());
        let asset = Asset::Timeline(timeline_asset);

        storage.add_timeline(asset_path.clone(), timeline);

        project.inner.create_asset(asset_path.clone(), asset);

        bin.create(JsBinItemType::Media {
            asset_path: asset_path.clone().to_string(),
            bin_path: bin_path.into(),
        })?;

        let tl = storage
            .get_timeline(asset_path)
            .expect("Timeline that was just created could not be found again");
        Ok(Self { inner: tl })
    }

    pub fn get_id(&self) -> String {
        self.inner.id.clone()
    }

    pub fn get_timeline_items(&self) -> Vec<JsTimelineItem> {
        self.inner
            .get_timeline_items()
            .into_iter()
            .map(JsTimelineItem::from)
            .collect()
    }

    pub fn get_timeline_items_in_range(
        &self,
        start: u32,
        end: u32,
        layer_start: Option<u8>,
        layer_end: Option<u8>,
    ) -> Vec<JsTimelineItem> {
        let pos_range = TimelineRangePos::new(start, end, 0);

        let iter_filter_fn: Box<dyn Fn(&TimelineItem) -> bool> = match (layer_start, layer_end) {
            (Some(start), Some(end)) => {
                let range = start..=end;
                Box::new(move |i: &TimelineItem| {
                    let pos = i.pos.read();
                    range.contains(&pos.get_layer()) && pos.intersects(&pos_range)
                })
            }
            _ => Box::new(|i: &TimelineItem| i.pos.read().intersects(&pos_range)),
        };

        self.inner
            .get_timeline_items()
            .into_iter()
            .filter(|v| iter_filter_fn(v))
            .map(JsTimelineItem::from)
            .collect()
    }

    pub fn add_timeline_item(&self, item: JsTimelineItem) -> Result<()> {
        // Check if the new items' position intersects with any others
        let pos = item.get_pos().into();
        let intersects = self
            .inner
            .items
            .iter()
            .any(|v| v.pos.read().intersects(&pos));
        if intersects {
            return Err(JsError::new("Timeline item overlaps with another"));
        }

        self.inner.add_timeline_item(&item.0);
        Ok(())
    }

    pub fn delete_timeline_item(&self, id: String) {
        self.inner.delete_timeline_item(&id)
    }
}

impl From<Arc<Timeline>> for JsTimeline {
    fn from(inner: Arc<Timeline>) -> Self {
        Self { inner }
    }
}

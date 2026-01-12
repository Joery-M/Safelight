use std::sync::Arc;

use sl_core::{
    asset::asset::{Asset, TimelineAsset},
    media_bin::media_bin_item::BinItemType,
    storage::storage::StorageManager,
    timeline::timeline::Timeline,
    utils::{asset_path::AssetPath, asset_path_namespace::AssetPathNamespace},
};
use wasm_bindgen::prelude::*;

use crate::{
    project::project::JsProject,
    timeline::{timeline_item::JsTimelineItem, timeline_properties::JsTimelineProperties},
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
    #[wasm_bindgen]
    pub async fn create(
        project: &JsProject,
        bin_path: String,
        properties: JsTimelineProperties,
    ) -> Self {
        let timeline = Timeline::new(properties.into());
        let asset_path = AssetPath::new(true, AssetPathNamespace::Timeline, &timeline.id);

        let timeline_asset = TimelineAsset::new(asset_path.clone());
        let asset = Asset::Timeline(timeline_asset);

        project
            .inner
            .storage
            .add_timeline(asset_path.clone(), timeline);

        project.inner.create_asset(asset_path.clone(), asset);

        project
            .inner
            .get_media_bin()
            .create(BinItemType::Media {
                asset_path: asset_path.clone(),
                bin_path: bin_path.into(),
            })
            .await;

        let tl = project
            .inner
            .storage
            .get_timeline(asset_path)
            .expect("Timeline that was just created could not be found again");
        Self { inner: tl }
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

impl From<Arc<Timeline>> for JsTimeline {
    fn from(inner: Arc<Timeline>) -> Self {
        Self { inner }
    }
}

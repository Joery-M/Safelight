use std::str::FromStr;

use nanoid::nanoid;
use sl_core::{
    asset::{
        asset::{Asset, MediaAsset},
        asset_types::AssetType,
    },
    project::project::Project,
    storage::{file::File, storage::StorageManager},
    utils::{asset_path::AssetPath, asset_path_namespace::AssetPathNamespace},
};
use tracing::info;
use wasm_bindgen::prelude::*;
use web_sys::Blob;

use crate::{
    media_bin::media_bin::{JsBinItemType, JsMediaBin},
    storage::storage::JsBrowserStorage,
    timeline::timeline::JsTimeline,
    utils::Result,
};

#[wasm_bindgen]
pub struct JsProject {
    pub(crate) inner: Project,
}

#[wasm_bindgen]
impl JsProject {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        JsProject {
            inner: Project::new(),
        }
    }

    pub fn get_id(&self) -> String {
        self.inner.id.to_string()
    }

    pub fn get_timeline(&self, storage: &JsBrowserStorage, path: String) -> Result<JsTimeline> {
        let path = AssetPath::from_str(&path).map_err(JsError::from)?;
        storage
            .get_timeline(path)
            .map(|tl| tl.into())
            .ok_or_else(|| JsError::new("Could not find timeline"))
    }

    /// Upload file to the project and add it to OPFS
    pub async fn upload_file(
        &self,
        storage: &JsBrowserStorage,
        bin: &JsMediaBin,
        file: Blob,
        bin_path: String,
    ) -> Result<()> {
        let asset_id = nanoid!();
        let asset_path =
            AssetPath::new(false, AssetPathNamespace::FS, format!("/blobs/{asset_id}"));

        info!("Writing asset to {}", asset_path);

        // Get file to write to
        let file_handle = storage.get_or_create_opfs_file(asset_path.clone()).await?;

        // Write to that file
        file_handle.write_from_blob(file).await?;

        info!("Asset size: {}", file_handle.size().await?);

        // Create asset
        self.inner.create_asset(
            asset_path.clone(),
            Asset::Media(MediaAsset::new(
                asset_path.clone(),
                AssetType::Bitmap, // TODO: Identify from source
            )),
        );

        let bin_item = bin.create(JsBinItemType::Media {
            asset_path: asset_path.to_string(),
            bin_path: bin_path.into(),
        });
        info!("Bin item: {:?}", bin_item);

        Ok(())
    }
}

use std::str::FromStr;

use log::info;
use nanoid::nanoid;
use sl_core::{
    asset::{
        asset::{Asset, MediaAsset},
        asset_types::AssetType,
    },
    media_bin::media_bin_item::BinItemType,
    project::project::Project,
    storage::{file::File, storage::StorageManager},
    utils::{asset_path::AssetPath, asset_path_namespace::AssetPathNamespace},
};
use wasm_bindgen::prelude::*;
use web_sys::Blob;

use crate::{
    media_bin::media_bin::JsMediaBin, storage::storage::BrowserStorage,
    timeline::timeline::JsTimeline, utils::Result,
};

#[wasm_bindgen]
pub struct JsProject {
    pub(crate) inner: Project<BrowserStorage>,
}

#[wasm_bindgen]
impl JsProject {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        JsProject {
            inner: Project::new(BrowserStorage::new()),
        }
    }

    #[wasm_bindgen(getter, js_name = id)]
    pub fn get_id(&self) -> String {
        self.inner.id.to_string()
    }

    #[wasm_bindgen(getter, js_name = mediaBin)]
    pub fn get_media_bin(&self) -> JsMediaBin {
        JsMediaBin {
            inner: self.inner.get_media_bin(),
        }
    }

    #[wasm_bindgen(js_name = getTimeline)]
    pub fn get_timeline(&self, path: String) -> Result<JsTimeline> {
        let path = AssetPath::from_str(&path).map_err(JsError::from)?;
        self.inner
            .storage
            .get_timeline(path)
            .map(|tl| tl.into())
            .ok_or_else(|| JsError::new("Could not find timeline"))
    }

    /// Upload file to the project and add it to OPFS
    #[wasm_bindgen(js_name = uploadFile)]
    pub async fn upload_file(&self, file: Blob, bin_path: String) -> Result<()> {
        let asset_id = nanoid!();
        let asset_path =
            AssetPath::new(false, AssetPathNamespace::FS, format!("/blobs/{asset_id}"));

        info!("Writing asset to {}", asset_path);

        // Get file to write to
        let file_handle = self
            .inner
            .storage
            .get_or_create_opfs_file(asset_path.clone())
            .await?;

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

        let bin_item = self.inner.get_media_bin().create(BinItemType::Media {
            asset_path,
            bin_path: bin_path.into(),
        });
        info!("Bin item: {:?}", bin_item);

        Ok(())
    }
}

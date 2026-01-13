use std::sync::Arc;

use async_trait::async_trait;
use dashmap::DashMap;
use sl_core::{
    storage::{storage::StorageManager, storage_error::StorageError},
    timeline::timeline::Timeline,
    utils::{asset_path::AssetPath, asset_path_namespace::AssetPathNamespace, bin_path::BinPath},
};
use wasm_bindgen::{JsValue, prelude::wasm_bindgen};

use crate::storage::file::{BrowserFile, JsBrowserFile};

#[wasm_bindgen(raw_module = "../browserStorage.ts")]
extern "C" {
    #[derive(Debug)]
    pub type JsBrowserStorage;

    #[wasm_bindgen(static_method_of = JsBrowserStorage, catch, js_name = getOPFSFile)]
    async fn get_opfs_file(path: Vec<String>) -> Result<JsBrowserFile, JsValue>;

    #[wasm_bindgen(static_method_of = JsBrowserStorage, catch, js_name = getOrCreateOPFSFile)]
    async fn get_or_create_opfs_file(path: Vec<String>) -> Result<JsBrowserFile, JsValue>;
}

#[derive(Debug, Clone)]
pub struct BrowserStorage {
    timelines: DashMap<String, Arc<Timeline>>,
}

impl BrowserStorage {
    pub fn new() -> Self {
        BrowserStorage {
            timelines: DashMap::new(),
        }
    }

    /// Get an OPFS file handle from a path
    async fn get_opfs_file(&self, asset: AssetPath) -> Result<BrowserFile, StorageError> {
        // TODO: Should change this
        let path: Vec<String> = BinPath::from(asset.path).into();

        let file = JsBrowserStorage::get_opfs_file(path).await?;
        Ok(BrowserFile::from(file))
    }

    /// Get or create an OPFS file handle from a path
    pub(crate) async fn get_or_create_opfs_file(
        &self,
        asset: AssetPath,
    ) -> Result<BrowserFile, StorageError> {
        let path: Vec<String> = BinPath::from(asset.path).into();

        let file = JsBrowserStorage::get_or_create_opfs_file(path).await?;
        Ok(BrowserFile::from(file))
    }
}

#[async_trait(?Send)]
impl StorageManager for BrowserStorage {
    type FileType = BrowserFile;
    async fn get_asset_file(&self, asset: AssetPath) -> Result<Self::FileType, StorageError> {
        match asset.namespace {
            AssetPathNamespace::FS => self.get_opfs_file(asset).await,

            _ => Err(StorageError::UnsupportedNamespace(asset.namespace)),
        }
    }

    fn get_timeline(&self, asset: AssetPath) -> Option<Arc<Timeline>> {
        self.timelines
            .get(&asset.path.to_string())
            .map(|v| v.clone())
    }
    fn add_timeline(&self, asset: AssetPath, timeline: Timeline) -> Option<Arc<Timeline>> {
        let key = asset.path.to_string();
        if self.timelines.contains_key(&key) {
            return None;
        }
        let timeline = Arc::new(timeline);
        self.timelines.insert(key, timeline);
        self.get_timeline(asset)
    }
}

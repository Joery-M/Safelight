use std::{str::FromStr, sync::Arc};

use async_trait::async_trait;
use dashmap::DashMap;
use sl_core::{
    storage::{storage::StorageManager, storage_error::StorageError},
    timeline::timeline::Timeline,
    utils::{asset_path::AssetPath, asset_path_namespace::AssetPathNamespace, bin_path::BinPath},
};
use wasm_bindgen::{JsError, JsValue, prelude::wasm_bindgen};

use crate::storage::file::{BrowserFile, JsBrowserFile};

mod js {
    use super::{JsBrowserFile, JsValue, wasm_bindgen};

    #[wasm_bindgen(raw_module = "../browserStorage.ts")]
    extern "C" {
        #[wasm_bindgen(catch, js_name = getOPFSFile)]
        pub async fn get_opfs_file(path: Vec<String>) -> Result<JsBrowserFile, JsValue>;

        #[wasm_bindgen(catch, js_name = getOrCreateOPFSFile)]
        pub async fn get_or_create_opfs_file(path: Vec<String>) -> Result<JsBrowserFile, JsValue>;
    }
}

#[derive(Debug, Clone)]
#[wasm_bindgen]
pub struct JsBrowserStorage {
    timelines: DashMap<String, Arc<Timeline>>,
}

#[wasm_bindgen]
impl JsBrowserStorage {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        JsBrowserStorage {
            timelines: DashMap::new(),
        }
    }

    /// Get an OPFS file handle from a path
    pub async fn get_opfs_file_js(&self, path: &str) -> Result<JsBrowserFile, JsError> {
        let path = AssetPath::from_str(path.into()).map_err(StorageError::from)?;
        self.get_opfs_file_inner(path)
            .await
            .map_err(StorageError::from)
            .map_err(JsError::from)
    }

    #[inline]
    pub(crate) async fn get_opfs_file(
        &self,
        asset: AssetPath,
    ) -> Result<BrowserFile, StorageError> {
        self.get_opfs_file_inner(asset).await.map(BrowserFile::from)
    }

    async fn get_opfs_file_inner(&self, asset: AssetPath) -> Result<JsBrowserFile, StorageError> {
        // TODO: Should change this
        let path: Vec<String> = BinPath::from(asset.path).into();

        js::get_opfs_file(path).await.map_err(StorageError::from)
    }

    /// Get or create an OPFS file handle from a path
    pub async fn get_or_create_opfs_file_js(&self, path: &str) -> Result<JsBrowserFile, JsError> {
        let path = AssetPath::from_str(path.into()).map_err(StorageError::from)?;
        self.get_or_create_opfs_file_inner(path)
            .await
            .map_err(StorageError::from)
            .map_err(JsError::from)
    }

    #[inline]
    pub(crate) async fn get_or_create_opfs_file(
        &self,
        asset: AssetPath,
    ) -> Result<BrowserFile, StorageError> {
        self.get_or_create_opfs_file_inner(asset)
            .await
            .map(BrowserFile::from)
    }

    async fn get_or_create_opfs_file_inner(
        &self,
        asset: AssetPath,
    ) -> Result<JsBrowserFile, StorageError> {
        let path: Vec<String> = BinPath::from(asset.path).into();

        js::get_or_create_opfs_file(path)
            .await
            .map_err(StorageError::from)
    }
}

#[async_trait(?Send)]
impl StorageManager for JsBrowserStorage {
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

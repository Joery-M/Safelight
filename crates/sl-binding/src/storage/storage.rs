use std::sync::Arc;

use async_trait::async_trait;
use dashmap::DashMap;
use sl_core::{
    storage::storage::{StorageError, StorageManager},
    timeline::timeline::Timeline,
    utils::{asset_path::AssetPath, asset_path_namespace::AssetPathNamespace},
};

use crate::storage::file::BrowserFile;

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
    fn get_file_opfs(&self, asset: AssetPath) -> Result<BrowserFile, StorageError> {
        todo!()
    }
}

#[async_trait]
impl StorageManager for BrowserStorage {
    type FileType = BrowserFile;
    fn get_asset_file(&self, asset: AssetPath) -> Result<Self::FileType, StorageError> {
        match asset.namespace {
            AssetPathNamespace::FS => self.get_file_opfs(asset),

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

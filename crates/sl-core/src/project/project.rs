use std::sync::Arc;

use dashmap::{
    DashMap,
    mapref::one::{Ref, RefMut},
};
use tracing::debug;
use nanoid::nanoid;
use sl_macros::DebugDrop;

use crate::{
    asset::asset::Asset, media_bin::media_bin::MediaBin, storage::storage::StorageManager,
    utils::asset_path::AssetPath,
};

#[derive(DebugDrop)]
#[debug_drop_id = "id"]
pub struct Project<Storage: StorageManager> {
    pub id: String,
    pub storage: Storage,
    pub(crate) media_bin: Arc<MediaBin>,
    pub(crate) asset_map: DashMap<AssetPath, Asset>,
}

impl<T: StorageManager> Project<T> {
    pub fn new(storage: T) -> Self {
        let id = nanoid!();
        debug!("Created new project with ID {id:?}");
        Project {
            id,
            media_bin: Arc::default(),
            asset_map: DashMap::default(),
            storage,
        }
    }

    #[inline]
    pub fn get_media_bin(&self) -> Arc<MediaBin> {
        self.media_bin.clone()
    }

    #[inline]
    pub fn get_asset(&self, path: &AssetPath) -> Option<Ref<'_, AssetPath, Asset>> {
        self.asset_map.get(path)
    }
    #[inline]
    pub fn get_asset_mut(&self, path: &AssetPath) -> Option<RefMut<'_, AssetPath, Asset>> {
        self.asset_map.get_mut(path)
    }
    #[inline]
    pub fn create_asset(&self, path: AssetPath, asset: Asset) {
        self.asset_map.insert(path, asset);
    }
}

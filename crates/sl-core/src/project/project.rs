use dashmap::{
    DashMap,
    mapref::one::{Ref, RefMut},
};
use nanoid::nanoid;
use sl_macros::DebugDrop;
use tracing::debug;

use crate::{asset::asset::Asset, utils::asset_path::AssetPath};

#[derive(DebugDrop)]
#[debug_drop_id = "id"]
pub struct Project {
    pub id: String,
    pub(crate) asset_map: DashMap<AssetPath, Asset>,
}

impl Project {
    pub fn new() -> Self {
        let id = nanoid!();
        debug!("Created new project with ID {id:?}");
        Project {
            id,
            asset_map: DashMap::default(),
        }
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

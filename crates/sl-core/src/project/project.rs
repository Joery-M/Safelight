use dashmap::{
    DashMap,
    mapref::one::{Ref, RefMut},
};
use log::debug;
use nanoid::nanoid;

use crate::{asset::asset::Asset, media_bin::media_bin::MediaBin, utils::asset_path::AssetPath};

pub struct Project {
    pub id: String,
    pub(crate) media_bin: MediaBin,
    pub(crate) asset_map: DashMap<AssetPath, Asset>,
}

impl Project {
    pub fn new() -> Self {
        let id = nanoid!();
        debug!("Created new project with ID {id:?}");
        Project {
            id,
            media_bin: MediaBin::default(),
            asset_map: DashMap::default(),
        }
    }

    #[inline]
    pub fn get_media_bin(&self) -> MediaBin {
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

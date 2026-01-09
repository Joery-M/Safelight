use std::fmt::Debug;

use crate::{asset::asset_types::AssetType, types::asset_path::AssetPath};

pub trait Asset: Debug + Sync + Send {
    /// Get the asset path of this asset
    fn get_path(&self) -> AssetPath;
    fn get_type(&self) -> AssetType;
}

#[derive(Debug)]
pub struct TimelineAsset(pub(crate) AssetPath);

impl Asset for TimelineAsset {
    #[inline]
    fn get_path(&self) -> AssetPath {
        self.0.clone()
    }
    #[inline]
    fn get_type(&self) -> AssetType {
        AssetType::Timeline
    }
}

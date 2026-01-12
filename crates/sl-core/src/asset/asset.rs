use std::fmt::Debug;

use crate::{asset::asset_types::AssetType, utils::asset_path::AssetPath};

#[derive(Debug, Clone)]
pub enum Asset {
    Media(MediaAsset),
    Bitmap(MediaAsset),
    Timeline(TimelineAsset),
}

impl Asset {
    pub fn get_inner_path(&self) -> AssetPath {
        match self {
            Asset::Media(media_asset) => media_asset.get_path(),
            Asset::Bitmap(media_asset) => media_asset.get_path(),
            Asset::Timeline(timeline_asset) => timeline_asset.get_path(),
        }
    }
}

pub trait AssetImpl: Debug + Clone + Sync + Send {
    /// Get the asset path of this asset
    fn get_path(&self) -> AssetPath;
    fn get_type(&self) -> AssetType;
}

#[derive(Debug, Clone)]
pub struct MediaAsset {
    pub(crate) path: AssetPath,
    pub(crate) source_type: AssetType,
}

impl AssetImpl for MediaAsset {
    #[inline]
    fn get_type(&self) -> AssetType {
        self.source_type
    }
    #[inline]
    fn get_path(&self) -> AssetPath {
        self.path.clone()
    }
}

#[derive(Debug, Clone)]
pub struct TimelineAsset(pub(crate) AssetPath);

impl TimelineAsset {
    pub fn new(asset_path: AssetPath) -> Self {
        Self(asset_path)
    }
}

impl AssetImpl for TimelineAsset {
    #[inline]
    fn get_path(&self) -> AssetPath {
        self.0.clone()
    }
    #[inline]
    fn get_type(&self) -> AssetType {
        AssetType::Timeline
    }
}

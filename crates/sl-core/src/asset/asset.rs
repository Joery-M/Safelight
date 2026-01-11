use std::fmt::Debug;

use crate::{asset::asset_types::AssetType, utils::asset_path::AssetPath};

#[derive(Debug, Clone)]
pub enum Asset {
    Media(MediaAsset),
    Bitmap(MediaAsset),
    Timeline(TimelineAsset),
}

pub trait AssetImpl: Debug + Clone + Sync + Send {
    /// Get the asset path of this asset
    fn get_path(&self) -> AssetPath;
    fn get_type(&self) -> AssetType;
}

#[derive(Debug, Clone)]
pub struct MediaAsset {
    pub(crate) path: AssetPath,
    pub(crate) r#type: AssetType,
}

impl AssetImpl for MediaAsset {
    #[inline]
    fn get_type(&self) -> AssetType {
        self.r#type
    }
    #[inline]
    fn get_path(&self) -> AssetPath {
        self.path.clone()
    }
}

#[derive(Debug, Clone)]
pub struct TimelineAsset(pub(crate) AssetPath);

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

use crate::{asset::asset_types::AssetType, types::asset_path::AssetPath};

pub trait Asset: Sync + Send {
    /// Get the asset path of this media
    fn get_path(&self) -> AssetPath;
    fn get_type(&self) -> AssetType;
}

use crate::{media::media_types::MediaType, types::asset_path::AssetPath};

pub trait Media: Sync + Send {
    /// Get the asset path of this media
    fn get_path(&self) -> AssetPath;
    fn get_type(&self) -> MediaType;
}

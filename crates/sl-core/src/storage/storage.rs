use std::fmt::Debug;

use crate::utils::asset_path::AssetPath;

pub trait StorageManager: Sized + Clone + Debug {
    fn get_asset(path: &AssetPath) -> &[u8];
}

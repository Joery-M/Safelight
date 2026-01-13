use std::{fmt::Debug, sync::Arc};

use async_trait::async_trait;

use crate::{
    storage::{file::File, storage_error::StorageError},
    timeline::timeline::Timeline,
    utils::asset_path::AssetPath,
};

/// Defines a struct that is able to read/write files and assets from their respective locations
#[async_trait(?Send)]
pub trait StorageManager: Sized + Clone + Debug {
    type FileType: File;

    /// Read a file in it's entirety
    async fn read_asset(&self, path: AssetPath) -> Result<Vec<u8>, StorageError> {
        self.get_asset_file(path).await?.read().await
    }
    async fn get_asset_file(&self, path: AssetPath) -> Result<Self::FileType, StorageError>;

    fn get_timeline(&self, path: AssetPath) -> Option<Arc<Timeline>>;
    fn add_timeline(&self, path: AssetPath, timeline: Timeline) -> Option<Arc<Timeline>>;
}

#[cfg(test)]
pub mod test {
    use super::*;

    #[derive(Debug)]
    pub struct DummyFile {}
    #[async_trait(?Send)]
    impl File for DummyFile {
        async fn read(&self) -> Result<Vec<u8>, StorageError> {
            unreachable!("Dummy file")
        }

        async fn size(&self) -> Result<usize, StorageError> {
            unreachable!("Dummy file")
        }

        async fn write<D: Into<Vec<u8>> + Send>(&self, _data: D) -> Result<(), StorageError> {
            unreachable!("Dummy file")
        }
    }

    #[derive(Debug, Clone)]
    pub struct DummyStorageManager {}
    #[async_trait(?Send)]
    impl StorageManager for DummyStorageManager {
        type FileType = DummyFile;
        async fn get_asset_file(&self, _asset: AssetPath) -> Result<Self::FileType, StorageError> {
            unreachable!("Dummy storage")
        }
        fn get_timeline(&self, _asset: AssetPath) -> Option<Arc<Timeline>> {
            unreachable!("Dummy storage")
        }
        fn add_timeline(&self, _asset: AssetPath, _timeline: Timeline) -> Option<Arc<Timeline>> {
            unreachable!("Dummy storage")
        }
    }
}

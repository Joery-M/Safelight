use std::sync::Arc;

use async_trait::async_trait;
use dashmap::DashMap;
use sl_core::{
    storage::{storage::StorageManager, storage_error::StorageError},
    timeline::timeline::Timeline,
    utils::{asset_path::AssetPath, asset_path_namespace::AssetPathNamespace, bin_path::BinPath},
};
use wasm_bindgen_futures::JsFuture;
use web_sys::{
    FileSystemDirectoryHandle, FileSystemFileHandle, FileSystemGetDirectoryOptions,
    FileSystemGetFileOptions,
};

use crate::storage::file::BrowserFile;

#[derive(Debug, Clone)]
pub struct BrowserStorage {
    timelines: DashMap<String, Arc<Timeline>>,
}

impl BrowserStorage {
    pub fn new() -> Self {
        BrowserStorage {
            timelines: DashMap::new(),
        }
    }

    /// Get an OPFS file handle from 
    async fn get_opfs_file(&self, asset: AssetPath) -> Result<FileSystemFileHandle, StorageError> {
        let sections: Vec<String> = BinPath::from(asset.path).into();

        let navigator = web_sys::window().unwrap().navigator();
        let mut cur_dir = JsFuture::from(navigator.storage().get_directory())
            .await
            .map(FileSystemDirectoryHandle::from)?;

        for (i, section) in sections.iter().enumerate() {
            if i == sections.len() - 1 {
                // Last one, get file
                let handle = JsFuture::from(cur_dir.get_file_handle(section))
                    .await
                    .map(FileSystemFileHandle::from)?;

                return Ok(handle);
            } else {
                // Recursively get directory
                cur_dir = JsFuture::from(cur_dir.get_directory_handle(section))
                    .await
                    .map(FileSystemDirectoryHandle::from)?;
            }
        }
        Err(StorageError::IO(std::io::Error::new(
            std::io::ErrorKind::NotFound,
            "File not found",
        )))
    }

    pub(crate) async fn get_or_create_opfs_file(
        &self,
        asset: AssetPath,
    ) -> Result<FileSystemFileHandle, StorageError> {
        let sections: Vec<String> = BinPath::from(asset.path).into();

        let navigator = web_sys::window().unwrap().navigator();
        let mut cur_dir = JsFuture::from(navigator.storage().get_directory())
            .await
            .map(FileSystemDirectoryHandle::from)?;

        let get_dir_options = FileSystemGetDirectoryOptions::new();
        get_dir_options.set_create(true);
        let get_file_options = FileSystemGetFileOptions::new();
        get_file_options.set_create(true);

        for (i, section) in sections.iter().enumerate() {
            if i == sections.len() - 1 {
                // Last one, get file
                let handle = JsFuture::from(
                    cur_dir.get_file_handle_with_options(section, &get_file_options),
                )
                .await
                .map(FileSystemFileHandle::from)?;

                return Ok(handle);
            } else {
                // Recursively get directory
                cur_dir = JsFuture::from(
                    cur_dir.get_directory_handle_with_options(section, &get_dir_options),
                )
                .await
                .map(FileSystemDirectoryHandle::from)?;
            }
        }

        Err(StorageError::IO(std::io::Error::new(
            std::io::ErrorKind::NotFound,
            "File not found (somehow)",
        )))
    }
}

#[async_trait(?Send)]
impl StorageManager for BrowserStorage {
    type FileType = BrowserFile;
    async fn get_asset_file(&self, asset: AssetPath) -> Result<Self::FileType, StorageError> {
        match asset.namespace {
            AssetPathNamespace::FS => self.get_opfs_file(asset).await.map(BrowserFile::from),

            _ => Err(StorageError::UnsupportedNamespace(asset.namespace)),
        }
    }

    fn get_timeline(&self, asset: AssetPath) -> Option<Arc<Timeline>> {
        self.timelines
            .get(&asset.path.to_string())
            .map(|v| v.clone())
    }
    fn add_timeline(&self, asset: AssetPath, timeline: Timeline) -> Option<Arc<Timeline>> {
        let key = asset.path.to_string();
        if self.timelines.contains_key(&key) {
            return None;
        }
        let timeline = Arc::new(timeline);
        self.timelines.insert(key, timeline);
        self.get_timeline(asset)
    }
}

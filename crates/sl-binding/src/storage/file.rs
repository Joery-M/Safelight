use async_trait::async_trait;

use sl_core::storage::{file::File, storage_error::StorageError};
use wasm_bindgen::JsCast;
use wasm_bindgen_futures::JsFuture;
use web_sys::{Blob, FileSystemFileHandle, FileSystemWritableFileStream, js_sys};

#[derive(Debug)]
pub struct BrowserFile(FileSystemFileHandle);

#[async_trait(?Send)]
impl File for BrowserFile {
    async fn read(&self) -> Result<Vec<u8>, StorageError> {
        let file: Blob = JsFuture::from(self.0.get_file()).await?.unchecked_into();
        let data = JsFuture::from(file.bytes())
            .await
            .map(js_sys::Uint8Array::from)?;

        let data_len = data.length() as usize;
        let mut output = vec![0u8; data_len];
        data.copy_to(&mut output);
        Ok(output)
    }

    async fn size(&self) -> Result<usize, StorageError> {
        let file: Blob = JsFuture::from(self.0.get_file()).await?.unchecked_into();
        Ok(file.size() as usize)
    }

    async fn write<D: Into<Vec<u8>> + Send>(&self, data: D) -> Result<(), StorageError> {
        let file: FileSystemWritableFileStream = JsFuture::from(self.0.create_writable())
            .await?
            .unchecked_into();

        // Returns `undefined`
        let _ = JsFuture::from(file.write_with_u8_array(&data.into())?).await;
        Ok(())
    }
}

impl BrowserFile {
    /// Write directly from a Blob into an OPFS file
    pub(crate) async fn write_from_blob(&self, data: Blob) -> Result<(), StorageError> {
        let file: FileSystemWritableFileStream = JsFuture::from(self.0.create_writable())
            .await?
            .unchecked_into();

        // Returns `undefined`
        let _ = JsFuture::from(file.write_with_blob(&data)?).await;

        Ok(())
    }
}

impl From<FileSystemFileHandle> for BrowserFile {
    fn from(value: FileSystemFileHandle) -> Self {
        Self(value)
    }
}

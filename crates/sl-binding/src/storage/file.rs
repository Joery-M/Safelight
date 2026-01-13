use anyhow::Context;
use async_trait::async_trait;

use sl_core::storage::{file::File, storage_error::StorageError};
use wasm_bindgen::{JsValue, prelude::wasm_bindgen};
use web_sys::{
    Blob,
    js_sys::{Number, Uint8Array},
};

#[wasm_bindgen(raw_module = "../browserStorage.ts")]
extern "C" {
    #[derive(Debug)]
    pub type JsBrowserFile;

    #[wasm_bindgen(catch, method)]
    async fn read(this: &JsBrowserFile) -> Result<Uint8Array, JsValue>;

    #[wasm_bindgen(catch, method)]
    async fn size(this: &JsBrowserFile) -> Result<Number, JsValue>;

    #[wasm_bindgen(catch, method)]
    async fn write(this: &JsBrowserFile, data: &Uint8Array) -> Result<(), JsValue>;

    #[wasm_bindgen(catch, method, js_name = writeFromBlob)]
    async fn write_from_blob(this: &JsBrowserFile, data: &Blob) -> Result<(), JsValue>;
}

#[derive(Debug)]
pub struct BrowserFile(JsBrowserFile);

#[async_trait(?Send)]
impl File for BrowserFile {
    async fn read(&self) -> Result<Vec<u8>, StorageError> {
        let data = self.0.read().await?;

        let data_len = data.length() as usize;
        let mut output = vec![0u8; data_len];
        data.copy_to(&mut output);
        Ok(output)
    }

    async fn size(&self) -> Result<usize, StorageError> {
        let size = self.0.size().await?;
        let size = size
            .as_f64()
            .context("Could not convert Js number to f64")?;
        Ok(size as usize)
    }

    async fn write<D: Into<Vec<u8>> + Send>(&self, data: D) -> Result<(), StorageError> {
        let data = Uint8Array::new_from_slice(&data.into());
        Ok(self.0.write(&data).await?)
    }
}

impl BrowserFile {
    /// Write directly from a Blob into an OPFS file
    pub(crate) async fn write_from_blob(&self, data: Blob) -> Result<(), StorageError> {
        self.0.write_from_blob(&data).await?;
        Ok(())
    }
}

impl From<JsBrowserFile> for BrowserFile {
    fn from(value: JsBrowserFile) -> Self {
        Self(value)
    }
}

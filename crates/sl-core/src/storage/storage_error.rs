use thiserror::Error;

use crate::utils::asset_path_namespace::AssetPathNamespace;

#[derive(Error, Debug)]
pub enum StorageError {
    #[error("Operation is not supported")]
    Unsupported,
    #[error("Namespace {0} is not supported")]
    UnsupportedNamespace(AssetPathNamespace),
    #[error(transparent)]
    IO(#[from] std::io::Error),
    #[error(transparent)]
    Generic(#[from] anyhow::Error),

    #[cfg(feature = "wasm")]
    #[error("Error from JavaScript: {0:?}")]
    JsError(String),
}

#[cfg(feature = "wasm")]
impl From<wasm_bindgen::JsValue> for StorageError {
    fn from(value: wasm_bindgen::JsValue) -> Self {
        Self::JsError(format!("{value:?}"))
    }
}

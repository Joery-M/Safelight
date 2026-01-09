use std::{fmt::Debug, sync::Arc};

use tokio::sync::{RwLock, RwLockReadGuard, RwLockWriteGuard};

use crate::asset::asset::Asset;

pub mod asset;
pub mod asset_types;

#[derive(Clone)]
pub struct AssetRef {
    inner: Arc<RwLock<dyn Asset>>,
}

impl AssetRef {
    pub fn new(value: Arc<RwLock<dyn Asset>>) -> Self {
        Self { inner: value }
    }

    pub async fn borrow(&self) -> RwLockReadGuard<'_, dyn Asset> {
        self.inner.read().await
    }

    pub fn borrow_blocking(&self) -> RwLockReadGuard<'_, dyn Asset> {
        self.inner.blocking_read()
    }

    pub async fn mutate(&self) -> RwLockWriteGuard<'_, dyn Asset> {
        self.inner.write().await
    }
}

// Manual implementation of Debug
impl Debug for AssetRef {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_tuple("AssetRef")
            .field(&self.borrow_blocking().get_path())
            .finish()
    }
}

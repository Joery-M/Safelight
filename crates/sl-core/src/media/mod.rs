use std::{fmt::Debug, sync::Arc};

use tokio::sync::{RwLock, RwLockReadGuard, RwLockWriteGuard};

use crate::media::media::Media;

pub mod media;
pub mod media_types;

#[derive(Clone)]
pub struct MediaRef {
    inner: Arc<RwLock<dyn Media>>,
}

impl MediaRef {
    pub fn new(value: Arc<RwLock<dyn Media>>) -> Self {
        Self { inner: value }
    }

    pub async fn borrow(&self) -> RwLockReadGuard<'_, dyn Media> {
        self.inner.read().await
    }

    pub fn borrow_blocking(&self) -> RwLockReadGuard<'_, dyn Media> {
        self.inner.blocking_read()
    }

    pub async fn mutate(&self) -> RwLockWriteGuard<'_, dyn Media> {
        self.inner.write().await
    }
}

// Manual implementation of Debug
impl Debug for MediaRef {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_tuple("MediaRef")
            .field(&self.borrow_blocking().get_path())
            .finish()
    }
}

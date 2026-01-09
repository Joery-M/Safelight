use std::{fmt::Debug, sync::Arc};

use nanoid::nanoid;
use tokio::sync::{RwLock, RwLockReadGuard, RwLockWriteGuard};

#[derive(Clone)]
pub struct TimelineItemRef {
    inner: Arc<RwLock<TimelineItem>>,
}

impl TimelineItemRef {
    pub fn new(value: TimelineItem) -> Self {
        Self {
            inner: Arc::new(RwLock::new(value)),
        }
    }

    pub async fn borrow(&self) -> RwLockReadGuard<'_, TimelineItem> {
        self.inner.read().await
    }

    pub fn borrow_blocking(&self) -> RwLockReadGuard<'_, TimelineItem> {
        self.inner.blocking_read()
    }

    pub async fn mutate(&self) -> RwLockWriteGuard<'_, TimelineItem> {
        self.inner.write().await
    }
}

impl Debug for TimelineItemRef {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        self.borrow_blocking().fmt(f)
    }
}

#[derive(Debug)]
pub struct TimelineItem {
    pub id: String,
    /// Starting position of this item in frames
    ///
    /// `u32` was chosen since the max timestamp of a `u16` at 60fps is 18 minutes, whilst that of a `u32` is 27 months.
    pub(crate) start: u32,
    /// Ending position of this item in frames
    ///
    /// `u32` was chosen since the max timestamp of a `u16` at 60fps is 18 minutes, whilst that of a `u32` is 27 months.
    pub(crate) end: u32,
    pub(crate) layer: u8,
}

impl TimelineItem {
    pub fn new(start: u32, end: u32, layer: u8) -> Self {
        Self {
            id: nanoid!(),
            start,
            end,
            layer,
        }
    }

    pub(super) fn delete(&mut self) {
        todo!("Handle deletion of internal state")
    }
}

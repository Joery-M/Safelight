use std::{fmt::Debug, ops::Deref, sync::Arc};

use nanoid::nanoid;
use parking_lot::RwLock;

use crate::timeline::{source::image_source::ImageSource, timeline_pos::TimelineRangePos};

#[derive(Clone)]
pub struct TimelineItemRef(Arc<TimelineItem>);

impl TimelineItemRef {
    pub fn new(value: TimelineItem) -> Self {
        Self(Arc::new(value))
    }
}

impl Deref for TimelineItemRef {
    type Target = TimelineItem;
    fn deref(&self) -> &Self::Target {
        self.0.deref()
    }
}

impl Debug for TimelineItemRef {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        self.0.fmt(f)
    }
}

#[derive(Debug)]
pub struct TimelineItem {
    pub id: String,
    pub pos: RwLock<TimelineRangePos>,

    /// The image data source of this timeline item. This source defines the start of this items' image rendering pipeline.
    pub(crate) image_source: RwLock<Option<Box<dyn ImageSource>>>,
}

impl TimelineItem {
    pub fn new(pos: TimelineRangePos) -> Self {
        Self {
            id: nanoid!(),
            pos: RwLock::new(pos),
            image_source: Default::default(),
        }
    }

    pub async fn set_image_source(&self, source: Box<dyn ImageSource>) {
        let mut cur_src = self.image_source.write();
        *cur_src = Some(source)
    }
}

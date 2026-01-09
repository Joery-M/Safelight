use sl_core::timeline::timeline::{Timeline, TimelineProperties};

use crate::{project::project::JsProject, timeline::timeline_item::JsTimelineItem};

#[napi(object)]
pub struct JsTimelineProperties {
    /// The width of the timeline's output frame
    pub width: u32,
    /// The height of the timeline's output frame
    pub height: u32,
    /// The duration of each frame in milliseconds
    ///
    /// Representing in ms does mean our FPS is capped at 1000, but that is a problem for future me
    pub frame_duration: u16,
}

impl Into<TimelineProperties> for JsTimelineProperties {
    fn into(self) -> TimelineProperties {
        TimelineProperties {
            width: self.width,
            height: self.height,
            frame_duration: self.frame_duration,
        }
    }
}

#[napi]
pub struct JsTimeline {
    pub(crate) inner: Timeline,
}

#[napi]
impl JsTimeline {
    pub fn new(project: &JsProject, properties: JsTimelineProperties) -> Self {
        Self {
            inner: Timeline::new(&project.inner, properties.into()),
        }
    }

    pub fn new_timeline_item(&self, start: u32, end: u32, layer: u8) -> JsTimelineItem {
        self.inner.new_timeline_item(start, end, layer).into()
    }

    #[napi(js_name = "deleteTimelineItem")]
    pub async fn delete_timeline_item(&self, id: String) {
        self.inner.delete_timeline_item(&id).await
    }

    #[napi(js_name = "deleteTimelineItem")]
    pub async fn delete_timeline_item_ref(&self, item: &JsTimelineItem) {
        let id = item.inner.borrow().await.id.clone();
        self.delete_timeline_item(id).await
    }
}

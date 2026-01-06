use sl_common::project::project::Project;

use crate::JsMediaBin;

#[napi(js_name = "Project")]
pub struct JsProject {
    pub(crate) inner: Project,
}

#[napi]
impl JsProject {
    #[napi(constructor)]
    pub fn new() -> Self {
        JsProject {
            inner: Project::new(),
        }
    }

    #[napi]
    pub fn get_media_bin(&self) -> JsMediaBin {
        JsMediaBin {
            inner: self.inner.get_media_bin(),
        }
    }
}

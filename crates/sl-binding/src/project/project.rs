use sl_core::project::project::Project;

use crate::media_bin::media_bin::JsMediaBin;

#[napi]
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

    #[napi(getter)]
    pub fn get_id(&self) -> String {
        self.inner.id.to_string()
    }

    #[napi]
    pub fn get_media_bin(&self) -> JsMediaBin {
        JsMediaBin {
            inner: self.inner.get_media_bin(),
        }
    }
}

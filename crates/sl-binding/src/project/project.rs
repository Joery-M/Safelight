use sl_core::project::project::Project;
use wasm_bindgen::prelude::*;

use crate::{media_bin::media_bin::JsMediaBin, storage::storage::BrowserStorage};

#[wasm_bindgen]
pub struct JsProject {
    pub(crate) inner: Project<BrowserStorage>,
}

#[wasm_bindgen]
impl JsProject {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        JsProject {
            inner: Project::new(BrowserStorage::new()),
        }
    }

    #[wasm_bindgen(getter, js_name = id)]
    pub fn get_id(&self) -> String {
        self.inner.id.to_string()
    }

    #[wasm_bindgen(getter, js_name = mediaBin)]
    pub fn get_media_bin(&self) -> JsMediaBin {
        JsMediaBin {
            inner: self.inner.get_media_bin(),
        }
    }
}

use serde::{Deserialize, Serialize};
use sl_core::media_bin::{
    media_bin::MediaBin,
    media_bin_item::{BinDirectory, BinItemType},
};
use wasm_bindgen::prelude::*;

use crate::{project::project::JsProject, utils::Result};

#[wasm_bindgen]
#[derive(Default, Clone)]
pub struct JsMediaBin {
    pub(crate) inner: MediaBin,
}

#[wasm_bindgen]
impl JsMediaBin {
    #[wasm_bindgen]
    pub async fn create(
        &self,
        project: &JsProject,
        #[wasm_bindgen(unchecked_param_type = "JsBinItemType")] item: JsValue,
    ) -> Result<bool> {
        let item: JsBinItemType = serde_wasm_bindgen::from_value(item)?;
        let success = self
            .inner
            .create(item.into_bin_item(project))
            .await
            .is_some();
        Ok(success)
    }

    #[wasm_bindgen(unchecked_return_type = "JsBinItemType | undefined")]
    pub async fn get_item(&self, path: String) -> Result<Option<JsValue>> {
        let res = match self
            .inner
            .get_item(&path.into())
            .await
            .map(JsBinItemType::from)
        {
            Some(v) => {
                // This match only exists for the `?`
                let ser = serde_wasm_bindgen::to_value(&v)?;
                Some(ser)
            }
            None => None,
        };

        Ok(res)
    }
}

#[wasm_bindgen(typescript_custom_section)]
const TS_APPEND_CONTENT: &'static str = r#"
export type JsBinItemType =
    | { type: "Media"; mediaPath: string; binPath: string }
    | { type: "Directory"; binPath: string };
"#;

#[derive(Serialize, Deserialize)]
#[serde(tag = "type", rename_all_fields = "camelCase")]
pub enum JsBinItemType {
    Media {
        media_path: String,
        bin_path: String,
    },
    Directory {
        bin_path: String,
    },
}

#[wasm_bindgen]
impl JsBinItemType {
    pub(crate) fn into_bin_item(self, project: &JsProject) -> BinItemType {
        match self {
            Self::Media {
                bin_path,
                media_path,
            } => {
                let media_ref = todo!("Get media by path from project");

                #[allow(unreachable_code)]
                BinItemType::Media {
                    inner: media_ref,
                    bin_path: bin_path.into(),
                }
            }
            Self::Directory { bin_path } => {
                BinItemType::Directory(BinDirectory::new(bin_path.into()))
            }
        }
    }
}

impl From<BinItemType> for JsBinItemType {
    fn from(value: BinItemType) -> Self {
        match value {
            BinItemType::Media {
                bin_path: path,
                inner,
            } => Self::Media {
                bin_path: path.to_string(),
                media_path: inner.borrow_blocking().get_path().to_string(),
            },
            BinItemType::Directory(v) => Self::Directory {
                bin_path: v.get_path().to_string(),
            },
        }
    }
}

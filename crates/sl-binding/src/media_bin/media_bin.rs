use std::str::FromStr;

use serde::{Deserialize, Serialize};
use sl_core::{
    media_bin::{
        media_bin::MediaBin,
        media_bin_item::{BinDirectory, BinItemType},
    },
    utils::asset_path::AssetPath,
};
use tsify::Tsify;
use wasm_bindgen::prelude::*;

use crate::utils::Result;

#[wasm_bindgen]
#[derive(Default, Clone)]
pub struct JsMediaBin {
    pub(crate) inner: MediaBin,
}

#[wasm_bindgen]
impl JsMediaBin {
    #[wasm_bindgen]
    pub async fn create(&self, item: JsBinItemType) -> Result<bool> {
        Ok(self.inner.create(item.into_bin_item()?).await.is_some())
    }

    pub async fn get_item(&self, path: String) -> Option<JsBinItemType> {
        self.inner
            .get_item(&path.into())
            .await
            .map(JsBinItemType::from)
    }
}

#[derive(Tsify, Serialize, Deserialize)]
#[tsify(into_wasm_abi, from_wasm_abi)]
#[serde(tag = "type", rename_all_fields = "camelCase")]
pub enum JsBinItemType {
    Media {
        asset_path: String,
        bin_path: String,
    },
    Directory {
        bin_path: String,
    },
}

impl JsBinItemType {
    pub(crate) fn into_bin_item(self) -> Result<BinItemType> {
        match self {
            Self::Media {
                bin_path,
                asset_path: media_path,
            } => {
                let asset_path = AssetPath::from_str(&media_path).map_err(|e| {
                    JsError::new(&format!(
                        "Unable to create asset path from media path {media_path:?}: {e:?}"
                    ))
                })?;

                Ok(BinItemType::Media {
                    asset_path,
                    bin_path: bin_path.into(),
                })
            }
            Self::Directory { bin_path } => {
                Ok(BinItemType::Directory(BinDirectory::new(bin_path.into())))
            }
        }
    }
}

impl From<BinItemType> for JsBinItemType {
    fn from(value: BinItemType) -> Self {
        match value {
            BinItemType::Media {
                bin_path,
                asset_path,
            } => Self::Media {
                bin_path: bin_path.to_string(),
                asset_path: asset_path.to_string(),
            },
            BinItemType::Directory(v) => Self::Directory {
                bin_path: v.get_path().to_string(),
            },
        }
    }
}

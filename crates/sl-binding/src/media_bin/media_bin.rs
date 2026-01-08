use sl_core::media_bin::{
    media_bin::MediaBin,
    media_bin_item::{BinDirectory, BinItemType},
};

use crate::project::project::JsProject;

#[napi]
#[derive(Default, Clone)]
pub struct JsMediaBin {
    pub(crate) inner: MediaBin,
}

#[napi]
impl JsMediaBin {
    #[napi]
    pub async fn create(&self, project: &JsProject, item: JsBinItemType) -> bool {
        self.inner
            .create(item.into_bin_item(project))
            .await
            .is_some()
    }

    #[napi]
    pub async fn get_item(&self, path: String) -> Option<JsBinItemType> {
        self.inner
            .get_item(&path.into())
            .await
            .map(JsBinItemType::from)
    }
}

#[napi]
pub enum JsBinItemType {
    Media {
        media_path: String,
        bin_path: String,
    },
    Directory {
        bin_path: String,
    },
}

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

use sl_core::media_bin::{
    media_bin::MediaBin,
    media_bin_item::{BinDirectory, BinItem, BinItemType, BinMedia},
};

#[napi]
#[derive(Default, Clone)]
pub struct JsMediaBin {
    pub(crate) inner: MediaBin,
}

#[napi]
impl JsMediaBin {
    #[napi]
    pub async fn create(&self, path: String, item: JsBinItemType) -> bool {
        self.inner.create(path.into(), item).await
    }

    #[napi]
    pub async fn get_item(&self, path: String) -> Option<JsBinItemType> {
        self.inner
            .get_item(path.into())
            .await
            .map(JsBinItemType::from)
    }
}

#[napi]
pub enum JsBinItemType {
    Media { path: String, name: String },
    Directory { path: String, name: String },
}

impl Into<BinItemType> for JsBinItemType {
    fn into(self) -> BinItemType {
        match self {
            Self::Media { path, name } => BinItemType::Media(BinMedia::new(path.into(), name)),
            Self::Directory { path, name } => {
                BinItemType::Directory(BinDirectory::new(path.into(), name))
            }
        }
    }
}

impl From<BinItemType> for JsBinItemType {
    fn from(value: BinItemType) -> Self {
        match value {
            BinItemType::Media(v) => Self::Media {
                path: v.get_path().to_string(),
                name: v.get_name(),
            },
            BinItemType::Directory(v) => Self::Directory {
                path: v.get_path().to_string(),
                name: v.get_name(),
            },
        }
    }
}

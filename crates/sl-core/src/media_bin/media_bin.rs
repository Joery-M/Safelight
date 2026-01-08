use std::sync::Arc;

use tokio::sync::Mutex;

use crate::{
    media_bin::media_bin_item::{BinDirectory, BinItemType},
    types::bin_path::BinPath,
};

#[derive(Default, Clone)]
pub struct MediaBin {
    inner: Arc<Mutex<BinDirectory>>,
}

impl MediaBin {
    pub async fn create(&self, item: BinItemType) -> Option<BinItemType> {
        let path = item.get_path().clone();
        let mut map = self.inner.lock().await;
        map.create_by_path(path.into(), 1, item)
    }

    pub async fn get_item(&self, path: &BinPath) -> Option<BinItemType> {
        let map = self.inner.lock().await;
        map.get_by_path(path.clone().into(), 1).cloned()
    }
}

#[cfg(test)]
mod test {
    use tokio::sync::RwLock;

    use crate::{
        media::{MediaRef, media::Media, media_types::MediaType},
        types::asset_path::AssetPath,
    };

    use super::*;

    struct TestMedia {
        path: AssetPath,
    }
    impl Media for TestMedia {
        fn get_path(&self) -> AssetPath {
            self.path.clone()
        }
        fn get_type(&self) -> crate::media::media_types::MediaType {
            MediaType::Generic
        }
    }

    #[tokio::test]
    async fn create_media_bin_item() {
        let folder_path: BinPath = "/folder/".into();
        let file_path: BinPath = "/folder/test.txt".into();

        let media_item = TestMedia {
            path: AssetPath::new(true, "virtual", "/Test.txt"),
        };
        let media_item_ref = MediaRef::new(Arc::new(RwLock::new(media_item)));

        let bin = MediaBin::default();

        let dir = BinDirectory::new(folder_path.clone()).into();
        bin.create(dir).await.expect(&format!(
            "Expected to create folder at path {folder_path:?}"
        ));

        let media = BinItemType::Media {
            inner: media_item_ref,
            bin_path: file_path.clone(),
        };
        bin.create(media).await.expect(&format!(
            "Expected to create media item at path {file_path:?}"
        ));

        let item = bin.get_item(&file_path).await.expect("To find item");
        match item {
            BinItemType::Media {
                inner: item,
                bin_path,
            } => {
                assert_eq!(bin_path, file_path);

                let media = item.borrow().await;
                assert_eq!(media.get_path().to_string(), "#virtual:/Test.txt");
                assert_eq!(media.get_type(), MediaType::Generic);
            }
            _ => panic!("Item should be a `BinMedia`"),
        }
    }
}

use std::{collections::HashMap, sync::Arc};

use tokio::sync::Mutex;

use crate::{media_bin::media_bin_item::BinItemType, types::bin_path::BinPath};

#[derive(Default, Clone)]
pub struct MediaBin {
    inner: Arc<Mutex<HashMap<BinPath, BinItemType>>>,
}

impl MediaBin {
    pub async fn create(&self, path: BinPath, item: impl Into<BinItemType>) -> bool {
        let mut map = self.inner.lock().await;

        if map.contains_key(&path) {
            return false;
        }
        map.insert(path, item.into());
        true
    }

    pub async fn get_item(&self, path: BinPath) -> Option<BinItemType> {
        let map = self.inner.lock().await;
        map.get(&path).cloned()
    }
}

#[cfg(test)]
mod test {
    use crate::media_bin::media_bin_item::{BinItem, BinMedia};

    use super::*;

    #[tokio::test]
    async fn create_media_bin_item() {
        let file_path: BinPath = "/test.txt".into();
        let media_item = BinMedia::new(file_path.clone(), "Test file".to_owned());

        let bin = MediaBin::default();
        assert!(bin.create(file_path.clone(), media_item).await);
        let item = bin.get_item(file_path.clone()).await.expect("To find item");
        match item {
            BinItemType::Media(item) => {
                assert_eq!(item.get_name(), "Test file");
                assert_eq!(item.get_path(), file_path);
            }
            _ => panic!("Item should be a `BinMedia`"),
        }
    }
}

use std::sync::Arc;

use tokio::sync::Mutex;

use crate::{
    media_bin::media_bin_item::{BinDirectory, BinItemType},
    utils::bin_path::BinPath,
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
    use crate::{
        asset::{
            asset::{Asset, AssetImpl, MediaAsset},
            asset_types::AssetType,
        },
        project::project::Project,
        utils::{asset_path::AssetPath, asset_path_namespace::AssetPathNamespace},
    };

    use super::*;

    #[tokio::test]
    async fn create_media_bin_item() {
        let folder_path: BinPath = "/folder/".into();
        let file_path: BinPath = "/folder/test.txt".into();

        let project = Project::new();
        let asset_path = AssetPath::new(true, AssetPathNamespace::FS, "/Test.txt");
        let asset_item = MediaAsset {
            path: asset_path.clone(),
            r#type: AssetType::Audio | AssetType::Video,
        };
        let asset_item_ref = Asset::Media(asset_item);
        project.create_asset(asset_path.clone(), asset_item_ref.clone());

        let bin = project.get_media_bin();

        let dir = BinDirectory::new(folder_path.clone()).into();
        bin.create(dir).await.expect(&format!(
            "Expected to create folder at path {folder_path:?}"
        ));

        let media = BinItemType::Media {
            asset_path: asset_path.clone(),
            bin_path: file_path.clone(),
        };
        bin.create(media).await.expect(&format!(
            "Expected to create media item at path {file_path:?}"
        ));

        let item = bin.get_item(&file_path).await.expect("To find item");
        match item {
            BinItemType::Media {
                asset_path,
                bin_path,
            } => {
                assert_eq!(bin_path, file_path);

                let item = project
                    .get_asset(&asset_path)
                    .expect("Find asset that was just created")
                    .clone();

                match item {
                    Asset::Media(media) => {
                        assert_eq!(media.get_path().to_string(), "#virtual:/Test.txt");
                        assert_eq!(media.get_type(), AssetType::Generic);
                    }
                    _ => {
                        panic!("Asset should be a `Media`")
                    }
                }
            }
            _ => panic!("Item should be a `BinMedia`"),
        }
    }
}

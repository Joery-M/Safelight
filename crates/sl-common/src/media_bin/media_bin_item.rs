use arcstr::ArcStr;

use crate::types::bin_path::BinPath;

#[derive(Debug, Clone)]
pub enum BinItemType {
    Media(BinMedia),
    Directory(BinDirectory),
}

pub trait BinItem: Into<BinItemType> {
    fn get_path(&self) -> BinPath;
    fn get_name(&self) -> String;
}

#[derive(Debug, Clone)]
pub struct BinMedia {
    path: BinPath,
    display_name: ArcStr,
}

impl BinMedia {
    pub fn new(path: BinPath, display_name: impl Into<ArcStr>) -> Self {
        Self {
            path,
            display_name: display_name.into(),
        }
    }
}

impl BinItem for BinMedia {
    #[inline]
    fn get_name(&self) -> String {
        self.display_name.to_string()
    }

    #[inline]
    fn get_path(&self) -> BinPath {
        self.path.clone()
    }
}

impl Into<BinItemType> for BinMedia {
    fn into(self) -> BinItemType {
        BinItemType::Media(self)
    }
}

#[derive(Debug, Clone)]
pub struct BinDirectory {
    path: BinPath,
    display_name: ArcStr,
}

impl BinDirectory {
    pub fn new(path: BinPath, display_name: impl Into<ArcStr>) -> Self {
        Self {
            path,
            display_name: display_name.into(),
        }
    }
}

impl BinItem for BinDirectory {
    #[inline]
    fn get_name(&self) -> String {
        self.display_name.to_string()
    }

    #[inline]
    fn get_path(&self) -> BinPath {
        self.path.clone()
    }
}

impl Into<BinItemType> for BinDirectory {
    fn into(self) -> BinItemType {
        BinItemType::Directory(self)
    }
}
use std::collections::HashMap;

use crate::utils::{asset_path::AssetPath, bin_path::BinPath};

#[derive(Debug, Clone)]
pub enum BinItemType {
    Media {
        asset_path: AssetPath,
        bin_path: BinPath,
    },
    Directory(BinDirectory),
}

impl BinItemType {
    pub fn get_path(&self) -> &BinPath {
        match self {
            BinItemType::Media {
                bin_path,
                asset_path: _,
            } => bin_path,
            BinItemType::Directory(dir) => &dir.path,
        }
    }
}

#[derive(Debug, Clone, Default)]
pub struct BinDirectory {
    inner: HashMap<String, BinItemType>,
    path: BinPath,
}

impl BinDirectory {
    pub fn new(path: BinPath) -> Self {
        Self {
            path,
            ..Default::default()
        }
    }

    pub fn create_by_path(
        &mut self,
        path: Vec<String>,
        level: usize,
        item: BinItemType,
    ) -> Option<BinItemType> {
        let section = path.first()?;
        if path[level..].is_empty() {
            self.create_by_name(section, item)
        } else {
            match self.get_mut(section)? {
                BinItemType::Directory(v) => v.create_by_path(path, level + 1, item),
                _ => None,
            }
        }
    }

    pub fn create_by_name(&mut self, name: &str, item: BinItemType) -> Option<BinItemType> {
        if self.inner.contains_key(name) {
            return None;
        }
        self.inner.insert(name.to_owned(), item.clone());
        Some(item)
    }

    pub fn get_by_path(&self, path: Vec<String>, level: usize) -> Option<&BinItemType> {
        let section = path.first()?;
        if path[level..].is_empty() {
            self.get(section)
        } else {
            match self.get(section)? {
                BinItemType::Directory(v) => v.get_by_path(path, level + 1),
                _ => None,
            }
        }
    }
    pub fn get_by_path_mut(&mut self, path: Vec<String>, level: usize) -> Option<&mut BinItemType> {
        let section = path.first()?;
        if path[level..].is_empty() {
            self.get_mut(section)
        } else {
            match self.get_mut(section)? {
                BinItemType::Directory(v) => v.get_by_path_mut(path, level + 1),
                _ => None,
            }
        }
    }
    #[inline]
    pub fn get(&self, name: &str) -> Option<&BinItemType> {
        self.inner.get(name)
    }
    #[inline]
    pub fn get_mut(&mut self, name: &str) -> Option<&mut BinItemType> {
        self.inner.get_mut(name)
    }

    #[inline]
    pub fn get_path(&self) -> BinPath {
        self.path.clone()
    }
}

impl From<BinDirectory> for BinItemType {
    fn from(val: BinDirectory) -> Self {
        BinItemType::Directory(val)
    }
}

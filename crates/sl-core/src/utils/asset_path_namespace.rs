use std::{fmt::Display, str::FromStr};

use thiserror::Error;

#[derive(Debug, Clone, Hash, PartialEq, Eq)]
pub enum AssetPathNamespace {
    /// Indicates this asset is stored in the implementors' file system
    FS,
    /// Indicates this asset is a timeline and should be read from the project
    Timeline,
}

#[derive(Error, Debug)]
#[error("Could not find namespace for: {0:?}")]
pub struct UnknownNamespaceError(String);

impl FromStr for AssetPathNamespace {
    type Err = UnknownNamespaceError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let res = match s {
            "FS" => Self::FS,
            "timeline" => Self::Timeline,
            s => return Err(UnknownNamespaceError(s.to_owned())),
        };

        Ok(res)
    }
}

impl Display for AssetPathNamespace {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let res = match self {
            AssetPathNamespace::FS => "FS",
            AssetPathNamespace::Timeline => "timeline",
        };
        f.write_str(res)
    }
}

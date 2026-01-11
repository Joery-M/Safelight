use std::{
    fmt::{Display, Write},
    str::FromStr,
};

use arcstr::ArcStr;

use crate::utils::asset_path_namespace::{AssetPathNamespace, UnknownNamespaceError};

/// An `AssetPath` defines the location and storage method of an asset
///
/// For media that is stored on-device, this path should eventually resolve to the raw data of that file.
/// For media that is stored internally, in the project (e.g. timelines), this path should resolve to the media by its ID:
///
/// | Type     | Path                                             |
/// | -------- | ------------------------------------------------ |
/// | Media    | FS:/media/2b14464b-f3cd-4460-838e-51aed1de4098 |
/// | Media    | FS:D:\projects\safelight\my-awesome-video.webm  |
/// | Media    | FS:/home/user/Documents/my-awesome-video.webm   |
/// | Timeline | #timeline:7069252d-e784-4555-8b0d-e954d3b1f019   |
#[derive(Debug, Clone, Hash, PartialEq, Eq)]
pub struct AssetPath {
    pub is_virtual: bool,
    pub namespace: AssetPathNamespace,
    pub path: ArcStr,
}

impl AssetPath {
    pub fn new(is_virtual: bool, namespace: AssetPathNamespace, path: impl Into<ArcStr>) -> Self {
        Self {
            is_virtual,
            namespace,
            path: path.into(),
        }
    }
}

impl Display for AssetPath {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        if self.is_virtual {
            f.write_char('#')?;
        }
        f.write_fmt(format_args!("{}:{}", &self.namespace, &self.path))
    }
}

#[derive(Debug, thiserror::Error)]
pub enum ParseAssetPathError {
    #[error("Invalid namespace: {0}")]
    InvalidNamespace(String),
    #[error(transparent)]
    UnknownNamespace(#[from] UnknownNamespaceError),
    #[error("Invalid path: {0}")]
    InvalidPath(String),
}

impl FromStr for AssetPath {
    type Err = ParseAssetPathError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let (mut namespace, path) = s
            .split_once(":")
            .ok_or_else(|| ParseAssetPathError::InvalidNamespace(s.to_owned()))?;
        let is_virtual = s.starts_with('#');
        if namespace.is_empty() {
            return Err(ParseAssetPathError::InvalidNamespace(s.to_owned()));
        }
        if path.is_empty() {
            return Err(ParseAssetPathError::InvalidPath(s.to_owned()));
        }
        if is_virtual {
            namespace = &namespace[1..];
        }

        Ok(AssetPath {
            is_virtual,
            path: path.into(),
            namespace: AssetPathNamespace::from_str(namespace)?,
        })
    }
}

#[cfg(test)]
mod test {
    use super::*;

    const TEST_CASES: [(&str, (bool, AssetPathNamespace, &str)); 3] = [
        (
            "FS:/my-asset.mp4",
            (false, AssetPathNamespace::FS, "/my-asset.mp4"),
        ),
        (
            "#timeline:d09688be-2e07-5da3-b94c-cce4b519c72b",
            (
                true,
                AssetPathNamespace::Timeline,
                "d09688be-2e07-5da3-b94c-cce4b519c72b",
            ),
        ),
        (
            "FS:D:/Projects/Safelight/media/my-awesome-video.mp4",
            (
                false,
                AssetPathNamespace::FS,
                "D:/Projects/Safelight/media/my-awesome-video.mp4",
            ),
        ),
    ];

    #[test]
    fn display_asset_paths() {
        for (result, (is_virtual, namespace, path)) in TEST_CASES {
            let asset_path = AssetPath::new(is_virtual, namespace, path);
            assert_eq!(asset_path.to_string(), result);
        }
    }

    #[test]
    fn parse_asset_paths() {
        for (source, (is_virtual, namespace, path)) in TEST_CASES {
            let asset_path = AssetPath::from_str(source)
                .expect(&format!("Expect to parse {source:?} into AssetPath"));
            assert_eq!(asset_path.is_virtual, is_virtual);
            assert_eq!(asset_path.namespace, namespace);
            assert_eq!(asset_path.path, path);

            assert_eq!(asset_path.to_string(), source);
        }
    }
}

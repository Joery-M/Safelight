use std::{
    fmt::{Display, Write},
    str::FromStr,
};

/// An `AssetPath` defines the location and storage method of an asset
///
/// For media that is stored on-device, this path should eventually resolve to the raw data of that file.
/// For media that is stored internally, in the project (e.g. timelines), this path should resolve to the media by its ID:
///
/// | Type     | Path                                             |
/// | -------- | ------------------------------------------------ |
/// | Media    | OPFS:/media/2b14464b-f3cd-4460-838e-51aed1de4098 |
/// | Media    | HDD:D:\projects\safelight\my-awesome-video.webm  |
/// | Media    | HDD:/home/user/Documents/my-awesome-video.webm   |
/// | Timeline | #timeline:7069252d-e784-4555-8b0d-e954d3b1f019   |
#[derive(Debug, Clone, Hash)]
pub struct AssetPath {
    pub is_virtual: bool,
    pub namespace: String,
    pub path: String,
}

impl AssetPath {
    pub fn new(is_virtual: bool, namespace: impl Into<String>, path: impl Into<String>) -> Self {
        Self {
            is_virtual,
            namespace: namespace.into(),
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
            path: path.to_owned(),
            namespace: namespace.to_owned(),
        })
    }
}

#[cfg(test)]
mod test {
    use super::*;

    const TEST_CASES: [(&str, (bool, &str, &str)); 3] = [
        ("OPFS:/my-asset.mp4", (false, "OPFS", "/my-asset.mp4")),
        (
            "#timeline:d09688be-2e07-5da3-b94c-cce4b519c72b",
            (true, "timeline", "d09688be-2e07-5da3-b94c-cce4b519c72b"),
        ),
        (
            "HDD:D:/Projects/Safelight/media/my-awesome-video.mp4",
            (
                false,
                "HDD",
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

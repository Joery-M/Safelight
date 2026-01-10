use std::fmt::Display;

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Clone, Default)]
pub struct BinPath {
    inner: Vec<String>,
}

impl BinPath {
    pub fn new(value: impl Into<Vec<String>>) -> Self {
        Self {
            inner: value.into(),
        }
    }
}

impl From<BinPath> for Vec<String> {
    fn from(val: BinPath) -> Self {
        val.inner
    }
}

impl From<&str> for BinPath {
    /// Convert a string to a path and resolve `../`
    ///
    ///
    fn from(s: &str) -> Self {
        let source: Vec<String> = s
            .split(['\\', '/'])
            .filter(|v| !v.is_empty())
            .map(str::to_owned)
            .collect();

        let mut result: Vec<String> = Vec::with_capacity(source.len());

        for section in source.into_iter() {
            if section == ".." {
                result.pop();
            } else {
                result.push(section);
            }
        }

        BinPath { inner: result }
    }
}

impl From<String> for BinPath {
    #[inline]
    fn from(s: String) -> Self {
        s.as_str().into()
    }
}

impl Display for BinPath {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str("/")?;
        f.write_str(&self.inner.join("/"))
    }
}

#[cfg(test)]
mod test {
    use std::collections::HashMap;

    use super::*;

    #[test]
    fn path_conversion() {
        let test_cases = HashMap::from([
            ("/test.txt", (vec!["test.txt"], "/test.txt")),
            ("\\test.txt", (vec!["test.txt"], "/test.txt")),
            (
                "/folder/test.txt",
                (vec!["folder", "test.txt"], "/folder/test.txt"),
            ),
            (
                "\\folder/test.txt",
                (vec!["folder", "test.txt"], "/folder/test.txt"),
            ),
            (
                "//////folder//\\/test.txt",
                (vec!["folder", "test.txt"], "/folder/test.txt"),
            ),
            ("/folder/../test.txt", (vec!["test.txt"], "/test.txt")),
        ]);

        for (source, (result_1, result_2)) in test_cases {
            let path = BinPath::from(source);
            assert_eq!(path.inner, result_1);
            assert_eq!(path.to_string(), result_2);
        }
    }
}

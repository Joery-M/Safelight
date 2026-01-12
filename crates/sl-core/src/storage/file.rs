use std::{fmt::Debug, ops::RangeBounds};

use async_trait::async_trait;
use tokio::io::AsyncRead;

use crate::storage::storage::StorageError;

#[async_trait]
pub trait File: Debug + Send + Sync {
    async fn read(&self) -> Result<Vec<u8>, StorageError>;
    async fn read_range<R: RangeBounds<usize> + Send>(
        &self,
        range: R,
    ) -> Result<Vec<u8>, StorageError>;

    async fn size(&self) -> Result<usize, StorageError>;

    async fn write<D: Into<Vec<u8>> + Send>(&self, data: D) -> Result<(), StorageError>;
    async fn write_stream<S: AsyncRead + Send>(&self, stream: S) -> Result<(), StorageError>;
}

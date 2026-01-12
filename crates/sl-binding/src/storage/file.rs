use std::ops::RangeBounds;

use async_trait::async_trait;
use tokio::io::AsyncRead;

use sl_core::storage::{file::File, storage::StorageError};

#[derive(Debug)]
pub struct BrowserFile {}

#[async_trait]
impl File for BrowserFile {
    async fn read(&self) -> Result<Vec<u8>, StorageError> {
        todo!()
    }

    async fn read_range<R: RangeBounds<usize> + Send>(
        &self,
        range: R,
    ) -> Result<Vec<u8>, StorageError> {
        todo!()
    }

    async fn size(&self) -> Result<usize, StorageError> {
        todo!()
    }

    async fn write<D: Into<Vec<u8>> + Send>(&self, data: D) -> Result<(), StorageError> {
        todo!()
    }

    async fn write_stream<S: AsyncRead + Send>(&self, stream: S) -> Result<(), StorageError> {
        todo!()
    }
}

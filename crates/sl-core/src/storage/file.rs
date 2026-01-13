use std::fmt::Debug;

use async_trait::async_trait;

use crate::storage::storage_error::StorageError;

#[async_trait(?Send)]
pub trait File: Debug {
    async fn read(&self) -> Result<Vec<u8>, StorageError>;

    async fn size(&self) -> Result<usize, StorageError>;

    async fn write<D: Into<Vec<u8>> + Send>(&self, data: D) -> Result<(), StorageError>;
}

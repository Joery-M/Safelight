use uuid::Uuid;

use crate::media_bin::media_bin::MediaBin;

pub struct Project {
    pub id: Uuid,
    pub(crate) media_bin: MediaBin,
}

impl Project {
    pub fn new() -> Self {
        Project {
            id: Uuid::new_v4(),
            media_bin: MediaBin::default(),
        }
    }

    pub fn get_media_bin(&self) -> MediaBin {
        self.media_bin.clone()
    }
}

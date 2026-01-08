use crate::media::media_types::MediaType;

pub trait Media: Sync + Send {
    /// Get the path of this media
    ///
    /// For media that is stored on-device, this path should eventually resolve to the raw data of that file.
    /// For media that is stored internally, in the project (e.g. timelines), this path should resolve to the media by its ID:
    ///
    /// | Type     | Path                                             |
    /// | -------- | ------------------------------------------------ |
    /// | Media    | OPFS:/media/2b14464b-f3cd-4460-838e-51aed1de4098 |
    /// | Media    | D:/projects/safelight/my-awesome-video.webm      |
    /// | Timeline | #timeline:7069252d-e784-4555-8b0d-e954d3b1f019   |
    fn get_path(&self) -> String;
    fn get_type(&self) -> MediaType;
}

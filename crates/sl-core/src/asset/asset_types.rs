use bitflags::bitflags;

bitflags! {
    #[derive(Debug, Clone, Copy, PartialEq, Eq)]
    pub struct AssetType: u8 {
        /// Asset has video.
        const Video = 1;
        /// Asset has audio.
        const Audio = 1 << 1;
        /// Asset has text, e.g. subtitles.
        const Text = 1 << 2;
        /// Asset is a timeline.
        const Timeline = 1 << 3;
        /// Asset should be streamed in.
        const Streaming = 1 << 4;
        /// Asset is undefined/unknown.
        const Generic = 1 << 5;
    }
}

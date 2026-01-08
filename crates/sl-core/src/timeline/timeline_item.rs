pub struct TimelineItem {
    /// Starting position of this item in frames
    pub(crate) start: u32,
    /// Ending position of this item in frames
    pub(crate) end: u32,
    pub(crate) layer: i16,
}

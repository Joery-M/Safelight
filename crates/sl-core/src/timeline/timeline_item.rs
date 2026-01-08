pub struct TimelineItem {
    /// Starting position of this item in frames
    ///
    /// `u32` was chosen since the max timestamp of a `u16` at 60fps is 18 minutes, whilst that of a `u32` is 27 months.
    pub(crate) start: u32,
    /// Ending position of this item in frames
    ///
    /// `u32` was chosen since the max timestamp of a `u16` at 60fps is 18 minutes, whilst that of a `u32` is 27 months.
    pub(crate) end: u32,
    pub(crate) layer: u8,
}

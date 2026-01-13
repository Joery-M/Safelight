use std::fmt::Debug;

#[derive(Debug, Hash, PartialEq, Eq)]
pub struct TimelineRangePos {
    /// Start and end positions of this item in frames.
    ///
    /// `u32` was chosen since the max timestamp of a `u16` at 60fps is 18 minutes, whilst that of a `u32` is 27 months.
    range: (u32, u32),
    /// The timeline layer of this item
    layer: u8,
}

impl TimelineRangePos {
    pub fn new(start: u32, end: u32, layer: u8) -> Self {
        Self {
            range: (start, end),
            layer: layer,
        }
    }

    #[inline]
    pub fn get_range(&self) -> (u32, u32) {
        (self.range.0, self.range.1)
    }

    #[inline]
    pub fn get_layer(&self) -> u8 {
        self.layer
    }

    #[inline]
    pub fn get_pos(&self) -> (u32, u32, u8) {
        (self.range.0, self.range.1, self.layer)
    }

    #[inline]
    pub fn set_pos(&mut self, start: u32, end: u32, layer: u8) {
        self.range = (start, end);
        self.layer = layer;
    }

    #[inline]
    pub fn intersects(&self, other: &TimelineRangePos) -> bool {
        self.layer == other.layer
            && (self.range.1 >= other.range.0 || self.range.0 <= other.range.1)
    }
}

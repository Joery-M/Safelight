use std::fmt::Debug;

#[derive(Debug, Clone, Copy, Hash, PartialEq, Eq)]
pub struct TimelineRangePos {
    /// Start position of this item in frames.
    ///
    /// `u32` was chosen since the max timestamp of a `u16` at 60fps is 18 minutes, whilst that of a `u32` is 27 months.
    start: u32,
    /// End position of this item in frames.
    ///
    /// `u32` was chosen since the max timestamp of a `u16` at 60fps is 18 minutes, whilst that of a `u32` is 27 months.
    end: u32,
    /// The timeline layer of this item
    layer: u8,
}

impl TimelineRangePos {
    pub fn new(start: u32, end: u32, layer: u8) -> Self {
        Self { start, end, layer }
    }

    pub const fn new_const(start: u32, end: u32, layer: u8) -> Self {
        Self { start, end, layer }
    }

    #[inline]
    pub fn get_range(&self) -> (u32, u32) {
        (self.start, self.end)
    }

    #[inline]
    pub fn get_layer(&self) -> u8 {
        self.layer
    }

    #[inline]
    pub fn get_pos(&self) -> (u32, u32, u8) {
        (self.start, self.end, self.layer)
    }

    #[inline]
    pub fn set_pos(&mut self, start: u32, end: u32, layer: u8) {
        self.start = start;
        self.end = end;
        self.layer = layer;
    }

    #[inline]
    pub fn intersects(&self, other: &TimelineRangePos) -> bool {
        other.layer == self.layer
            && ((other.start <= self.end && other.end >= self.start)
                || (other.end >= self.start && other.start <= self.start))
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_overlap() {
        const CASES: [(bool, TimelineRangePos, TimelineRangePos); 4] = [
            (
                // [----]
                // [----]
                true,
                TimelineRangePos::new_const(100, 200, 0),
                TimelineRangePos::new_const(100, 200, 0),
            ),
            (
                // [----]
                //       [----]
                false,
                TimelineRangePos::new_const(0, 99, 0),
                TimelineRangePos::new_const(100, 200, 0),
            ),
            (
                // [-------]
                // --layer--
                // [-------]
                false,
                TimelineRangePos::new_const(0, 100, 0),
                TimelineRangePos::new_const(0, 100, 1),
            ),
            (
                // [----]
                //    [----]
                true,
                TimelineRangePos::new_const(50, 100, 0),
                TimelineRangePos::new_const(0, 150, 0),
            ),
        ];

        for (expected, one, two) in CASES.iter() {
            assert_eq!(one.intersects(two), *expected, "{one:?} intersects {two:?}");
            assert_eq!(two.intersects(one), *expected, "{two:?} intersects {one:?}");
        }
    }
}

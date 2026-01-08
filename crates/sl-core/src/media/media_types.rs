use bitflags::bitflags;

bitflags! {
    #[derive(Debug, PartialEq, Eq)]
    pub struct MediaType: u16 {
        const Video    = 0b00001;
        const Audio    = 0b00010;
        const Timeline = 0b00100;
        const Text     = 0b01000;
        const Generic  = 0b10000;
    }
}

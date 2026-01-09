use std::fmt::Debug;

use bitflags::bitflags;

bitflags! {
    pub struct EffectType: u8 {
        const Image = 1;
        const Audio = 1 << 1;
        const Metadata = 1 << 2;
    }
}

pub trait BaseEffect: Debug + Send + Sync {
    fn get_effect_type(&self) -> EffectType;
}

use wasm_bindgen::prelude::*;

use crate::effect::EffectProcessor;

#[derive(Debug)]
#[wasm_bindgen]
pub struct Element<> {
    pub(crate) effects: Vec<Box<dyn EffectProcessor>>,
}

use downcast_rs::Downcast;
use tracing::debug;
use wasm_bindgen::{convert::TryFromJsValue, prelude::*};

use crate::{
    compositor::element::Element, sources::testing::square::ExampleSquareSource,
    utils::parameters::JsParameters,
};

#[derive(Debug, Default)]
pub struct ElementStack {
    stack: Vec<Element>,
}

#[wasm_bindgen]
pub struct ElementStackBuilder {
    inner: ElementStack,
}

#[wasm_bindgen]
impl ElementStackBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            inner: ElementStack::default(),
        }
    }

    pub fn create_element() -> Element {
        Element {
            effects: Vec::new(),
        }
    }
}

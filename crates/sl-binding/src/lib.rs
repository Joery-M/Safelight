#![allow(clippy::module_inception)]

use wasm_bindgen::prelude::wasm_bindgen;

pub mod media_bin;
pub mod project;
pub mod timeline;

mod storage;
mod utils;

#[wasm_bindgen(start)]
fn start() {
    // https://github.com/rustwasm/console_error_panic_hook
    #[cfg(feature = "debugging")]
    console_error_panic_hook::set_once();

    tracing_wasm::set_as_global_default();
}

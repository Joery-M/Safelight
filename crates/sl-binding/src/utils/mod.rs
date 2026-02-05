use wasm_bindgen::JsError;

pub type Result<T> = core::result::Result<T, JsError>;

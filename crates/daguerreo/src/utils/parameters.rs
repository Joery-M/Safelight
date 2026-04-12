use std::{collections::HashMap, fmt::Debug, ops::Deref};

use serde::Deserialize;
use tsify::Tsify;
use wasm_bindgen::prelude::*;

#[derive(Tsify, Deserialize, Clone)]
#[tsify(from_wasm_abi, hashmap_as_object)]
pub struct JsParameters(HashMap<String, ParameterValueType>);

impl Deref for JsParameters {
    type Target = HashMap<String, ParameterValueType>;
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

#[derive(Tsify, Deserialize, Clone)]
#[tsify(from_wasm_abi, hashmap_as_object)]
#[serde(untagged)]
pub enum ParameterValueType {
    String(String),
    Number(f64),
    Boolean(bool),
    Object(JsParameters),
}

pub trait SourceParameters: Debug + Send + Sync + Default + Clone + From<JsParameters> {}

pub trait EffectParameters: Debug + Send + Sync + Default + Clone + From<JsParameters> {}

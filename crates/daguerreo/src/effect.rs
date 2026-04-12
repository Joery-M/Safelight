use std::{any::Any, fmt::Debug};

use downcast_rs::{Downcast, impl_downcast};

use crate::utils::parameters::JsParameters;

pub trait EffectProcessor: Downcast + Any + Debug {
    // /// Create the compute pipeline here
    // fn create_pipeline(device: &wgpu::Device, queue: &wgpu::Queue, params: JsParameters) -> Self
    // where
    //     Self: Sized;

    // /// Write your uniform values to the queue.
    // ///
    // /// You can also modify the projection matrix in this step.
    // fn write_uniforms(
    //     &self,
    //     device: &wgpu::Device,
    //     queue: &wgpu::Queue,
    //     view_matrix: &glam::Mat4,
    //     proj_matrix: &mut glam::Mat4,
    //     params: JsParameters,
    // ) -> ();
}

impl_downcast!(EffectProcessor);

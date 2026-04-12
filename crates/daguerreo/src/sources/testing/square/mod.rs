use std::iter;

use wasm_bindgen::prelude::*;
use wgpu::util::DeviceExt;

use crate::{effect::EffectProcessor, utils::parameters::JsParameters};

const COLOR_TEXTURE_FORMAT: wgpu::TextureFormat = wgpu::TextureFormat::Rgba16Float;

#[repr(C)]
#[derive(Copy, Clone, Debug, bytemuck::Pod, bytemuck::Zeroable)]
struct Vertex {
    position: [f32; 3],
    color: [f32; 3],
}

impl Vertex {
    fn desc() -> wgpu::VertexBufferLayout<'static> {
        wgpu::VertexBufferLayout {
            array_stride: std::mem::size_of::<Vertex>() as wgpu::BufferAddress,
            step_mode: wgpu::VertexStepMode::Vertex,
            attributes: &[
                wgpu::VertexAttribute {
                    offset: 0,
                    shader_location: 0,
                    format: wgpu::VertexFormat::Float32x3,
                },
                wgpu::VertexAttribute {
                    offset: std::mem::size_of::<[f32; 3]>() as wgpu::BufferAddress,
                    shader_location: 1,
                    format: wgpu::VertexFormat::Float32x3,
                },
            ],
        }
    }
}

const VERTICES: &[Vertex] = &[
    Vertex {
        position: [1.0, 1.0, 0.0],
        color: [0.5, 0.0, 0.5],
    },
    Vertex {
        position: [-1.0, 1.0, 0.0],
        color: [0.5, 0.0, 0.5],
    },
    Vertex {
        position: [-1.0, -1.0, 0.0],
        color: [0.5, 0.0, 0.5],
    },
    Vertex {
        position: [1.0, -1.0, 0.0],
        color: [0.5, 0.0, 0.5],
    },
];

const INDICES: &[u16] = &[0, 1, 2, 0, 2, 3];

#[wasm_bindgen]
#[derive(Debug)]
pub struct ExampleSquareSource {
    state: Option<State>,
}

#[wasm_bindgen]
impl ExampleSquareSource {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self { state: None }
    }
}

#[derive(Debug)]
struct State {
    color_texture_view: wgpu::TextureView,
    render_pipeline: wgpu::RenderPipeline,
    vertex_buffer: wgpu::Buffer,
    index_buffer: wgpu::Buffer,
    num_indices: u32,
}

impl EffectProcessor for ExampleSquareSource {
    // fn init(
    //     &mut self,
    //     device: &wgpu::Device,
    //     _queue: &wgpu::Queue,
    //     config: &mut wgpu::SurfaceConfiguration,
    //     _params: JsParameters,
    // ) {
    //     let shader = device.create_shader_module(wgpu::include_wgsl!("./shader.wgsl"));

    //     let render_pipeline_layout =
    //         device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
    //             label: None,
    //             bind_group_layouts: &[],
    //             immediate_size: 0,
    //         });

    //     let render_pipeline = device.create_render_pipeline(&wgpu::RenderPipelineDescriptor {
    //         label: None,
    //         layout: Some(&render_pipeline_layout),
    //         vertex: wgpu::VertexState {
    //             module: &shader,
    //             entry_point: Some("vs_main"),
    //             buffers: &[Vertex::desc()],
    //             compilation_options: Default::default(),
    //         },
    //         fragment: Some(wgpu::FragmentState {
    //             module: &shader,
    //             entry_point: Some("fs_main"),
    //             targets: &[Some(wgpu::ColorTargetState {
    //                 format: config.format,
    //                 blend: Some(wgpu::BlendState::REPLACE),
    //                 write_mask: wgpu::ColorWrites::ALL,
    //             })],
    //             compilation_options: Default::default(),
    //         }),
    //         primitive: wgpu::PrimitiveState {
    //             topology: wgpu::PrimitiveTopology::TriangleList,
    //             strip_index_format: None,
    //             front_face: wgpu::FrontFace::Ccw,
    //             cull_mode: Some(wgpu::Face::Back),
    //             unclipped_depth: false,
    //             conservative: false,
    //             polygon_mode: wgpu::PolygonMode::Fill,
    //         },
    //         depth_stencil: None,
    //         multisample: wgpu::MultisampleState {
    //             count: 1,
    //             mask: !0,
    //             alpha_to_coverage_enabled: false,
    //         },
    //         multiview_mask: None,
    //         cache: None,
    //     });

    //     let vertex_buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
    //         label: None,
    //         contents: bytemuck::cast_slice(VERTICES),
    //         usage: wgpu::BufferUsages::VERTEX,
    //     });
    //     let index_buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
    //         label: Some("Index Buffer"),
    //         contents: bytemuck::cast_slice(INDICES),
    //         usage: wgpu::BufferUsages::INDEX,
    //     });
    //     let num_indices = INDICES.len() as u32;

    //     let color_texture_view = device
    //         .create_texture(&wgpu::TextureDescriptor {
    //             label: None,
    //             size: wgpu::Extent3d {
    //                 width: 512,
    //                 height: 512,
    //                 depth_or_array_layers: 1,
    //             },
    //             mip_level_count: 1,
    //             sample_count: 1,
    //             dimension: wgpu::TextureDimension::D2,
    //             format: COLOR_TEXTURE_FORMAT,
    //             usage: wgpu::TextureUsages::RENDER_ATTACHMENT
    //                 | wgpu::TextureUsages::TEXTURE_BINDING,
    //             view_formats: &[],
    //         })
    //         .create_view(&wgpu::TextureViewDescriptor::default());

    //     self.state = Some(State {
    //         color_texture_view,
    //         render_pipeline,
    //         vertex_buffer,
    //         index_buffer,
    //         num_indices,
    //     })
    // }

    // fn render(
    //     &self,
    //     device: &wgpu::Device,
    //     queue: &wgpu::Queue,
    //     _params: JsParameters,
    // ) -> &wgpu::TextureView {
    //     let Some(state) = &self.state else {
    //         unreachable!("Render called without being initialized");
    //     };

    //     let mut encoder = device.create_command_encoder(&wgpu::CommandEncoderDescriptor::default());

    //     let mut render_pass = encoder.begin_render_pass(&wgpu::RenderPassDescriptor {
    //         label: None,
    //         color_attachments: &[Some(wgpu::RenderPassColorAttachment {
    //             view: &state.color_texture_view,
    //             ops: wgpu::Operations {
    //                 load: wgpu::LoadOp::Clear(wgpu::Color::BLACK),
    //                 store: wgpu::StoreOp::Store,
    //             },
    //             resolve_target: None,
    //             depth_slice: None,
    //         })],
    //         ..Default::default()
    //     });

    //     render_pass.set_pipeline(&state.render_pipeline);
    //     render_pass.set_vertex_buffer(0, state.vertex_buffer.slice(..));
    //     render_pass.set_index_buffer(state.index_buffer.slice(..), wgpu::IndexFormat::Uint16);
    //     render_pass.draw_indexed(0..state.num_indices, 0, 0..1);
    //     drop(render_pass);

    //     queue.submit(iter::once(encoder.finish()));

    //     &state.color_texture_view
    // }
}

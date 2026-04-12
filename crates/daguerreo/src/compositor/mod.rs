pub mod element;
pub mod element_stack;

use wasm_bindgen::prelude::*;

/// The compositor is responsible for rendering each element and combining the textures into a single scene.
#[wasm_bindgen]
pub struct Compositor {
    device: wgpu::Device,
    queue: wgpu::Queue,
    surface_caps: wgpu::SurfaceCapabilities,
}

#[wasm_bindgen]
impl Compositor {
    #[wasm_bindgen(js_name = newWithCanvas)]
    pub async fn new_with_canvas(canvas: web_sys::HtmlCanvasElement) -> Compositor {
        // The instance is a handle to our GPU
        // BackendBit::PRIMARY => Vulkan + Metal + DX12 + Browser WebGPU
        let instance = wgpu::Instance::new(&wgpu::InstanceDescriptor {
            backends: wgpu::Backends::BROWSER_WEBGPU,
            ..Default::default()
        });

        let surface_target = wgpu::SurfaceTarget::Canvas(canvas);
        let surface = instance.create_surface(surface_target).unwrap();
        Self::new_with_surface(instance, surface).await
    }

    async fn new_with_surface(instance: wgpu::Instance, surface: wgpu::Surface<'_>) -> Compositor {
        let adapter = instance
            .request_adapter(&wgpu::RequestAdapterOptions {
                power_preference: wgpu::PowerPreference::HighPerformance,
                compatible_surface: Some(&surface),
                force_fallback_adapter: false,
            })
            .await
            .unwrap();

        let (device, queue) = adapter
            .request_device(&wgpu::DeviceDescriptor {
                label: None,
                required_features: wgpu::Features::empty(),
                experimental_features: wgpu::ExperimentalFeatures::disabled(),
                required_limits: wgpu::Limits::downlevel_webgl2_defaults(),
                memory_hints: Default::default(),
                trace: wgpu::Trace::Off, // Trace path
            })
            .await
            .unwrap();

        let surface_caps = surface.get_capabilities(&adapter);

        Compositor {
            device,
            queue,
            surface_caps,
        }
    }

    pub async fn render(&self) {

    }
}

use std::fmt::Debug;

use crate::{timeline::source::ImageFrameContext, utils::image::ImageBitmap};

pub trait ImageSource: Debug + Send + Sync {
    fn get_frame(&self, ctx: ImageFrameContext) -> ImageBitmap;
}

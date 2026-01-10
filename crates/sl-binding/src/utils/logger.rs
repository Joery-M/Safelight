use log::{Level, Log, Metadata, Record};
use wasm_bindgen::{JsValue, prelude::wasm_bindgen};

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console, variadic)]
    fn debug(args: Vec<JsValue>);

    #[wasm_bindgen(js_namespace = console, variadic)]
    fn log(args: Vec<JsValue>);

    #[wasm_bindgen(js_namespace = console, variadic)]
    fn info(args: Vec<JsValue>);

    #[wasm_bindgen(js_namespace = console, variadic)]
    fn warn(args: Vec<JsValue>);

    #[wasm_bindgen(js_namespace = console, variadic)]
    fn error(args: Vec<JsValue>);
}

pub struct ConsoleLogger {}

impl ConsoleLogger {
    pub fn init() {
        log::set_logger(&ConsoleLogger {}).unwrap();
        log::set_max_level(log::LevelFilter::Trace);
    }
}

impl Log for ConsoleLogger {
    fn enabled(&self, _metadata: &Metadata) -> bool {
        true
    }

    fn log(&self, record: &Record) {
        let level = record.level();
        let cb = match level {
            Level::Error => error,
            Level::Warn => warn,
            Level::Debug => debug,
            Level::Info => info,
            Level::Trace => debug,
        };
        let color = match level {
            Level::Error => "red",
            Level::Warn => "orange",
            Level::Debug => "purple",
            Level::Info => "white",
            Level::Trace => "cyan",
        };

        let tag = match (record.file(), record.line()) {
            (Some(file), Some(line)) => format!("%c[SL-CORE %c{}%c {}:{}]", level, file, line),
            (Some(file), None) => format!("%c[SL-CORE %c{}%c {}]", level, file),
            (None, _) => format!("%c[SL-CORE %c{}%c]", level),
        };

        // This syntax lets us color the text using the %c
        let args: Vec<_> = vec![
            tag,
            format!("color: gray"),
            format!("color: {color}"),
            format!("color: gray"),
            format!("{}", record.args()),
        ];

        cb(args.iter().map(JsValue::from).collect());
    }

    fn flush(&self) {}
}

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
            Level::Error => "color: #ff3333; font-weight: bold;",
            Level::Warn => "color: #ffbb33; font-weight: bold;",
            Level::Debug => "color: #cf33ff; font-weight: bold;",
            Level::Info => "color: #ebff33ff",
            Level::Trace => "color: #47ebd5; font-weight: bold;",
        };

        let tag = match (record.target(), record.line()) {
            (target, Some(line)) => format!("%c[SL-CORE %c{}%c {}:{}]", level, target, line),
            (target, None) => format!("%c[SL-CORE %c{}%c {}]", level, target),
        };

        // This syntax lets us color the text using the %c
        let args: Vec<_> = vec![
            tag,
            format!("color: gray"),
            color.to_owned(),
            format!("color: gray"),
            format!("{}", record.args()),
        ];

        cb(args.iter().map(JsValue::from).collect());
    }

    fn flush(&self) {}
}

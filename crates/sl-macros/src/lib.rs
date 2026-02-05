extern crate proc_macro;

use proc_macro::TokenStream;
use quote::quote;
use syn::{
    Attribute, DeriveInput, Expr, ExprField, ExprLit, ExprPath, Lit, Meta, parse_macro_input,
};

#[proc_macro_derive(DebugDrop, attributes(debug_drop_id))]
pub fn derive_debug_drop(item: TokenStream) -> TokenStream {
    let input = parse_macro_input!(item as DeriveInput);
    let name = input.ident;
    let name_str = name.to_string();

    let ident = input.attrs.iter().find_map(get_debug_drop_id);

    let (impl_generics, type_generics, where_clause) = input.generics.split_for_impl();

    let expanded = match ident {
        Some(ident) => {
            quote! {
                impl #impl_generics Drop for #name #type_generics #where_clause {
                    #[automatically_derived]
                    fn drop(&mut self) {
                        tracing::debug!("{} [{}] was dropped", #name_str, self.#ident);
                    }
                }
            }
        }
        None => {
            quote! {
                impl #impl_generics Drop for #name #type_generics #where_clause {
                    #[automatically_derived]
                    fn drop(&mut self) {
                        tracing::debug!("{} was dropped", #name_str);
                    }
                }
            }
        }
    };
    expanded.into()
}

// Parses the path from an attribute that looks like:
//
//     #[debug_drop_id = "a.b"]
//     #[debug_drop_id = "id"]
//     #[debug_drop_id = "0"]
//
// or returns `None` if the input is some other attribute.
fn get_debug_drop_id(attr: &Attribute) -> Option<Expr> {
    if !attr.path().is_ident("debug_drop_id") {
        return None;
    }

    if let Meta::NameValue(meta) = &attr.meta
        && let Expr::Lit(expr) = &meta.value
        && let Lit::Str(lit_str) = &expr.lit
    {
        if let Ok(v) = lit_str.parse::<ExprField>() {
            // Return "a.b"
            return Some(Expr::Field(v));
        } else if let Ok(v) = lit_str.parse::<ExprPath>() {
            // Return "id"
            if v.path.segments.len() == 1 {
                return Some(Expr::Path(v));
            }
        } else if let Ok(v) = lit_str.parse::<ExprLit>() {
            // Return "0"
            return Some(Expr::Lit(v));
        }
    }
    None
}

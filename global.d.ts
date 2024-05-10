import 'yup';

declare module 'yup' {
    export interface CustomSchemaMetadata {
        /**
         * What name this field should have.
         *
         * _@default_
         *
         * Name of this field, capitalized.
         */
        name?: string;
        /**
         * Whether this property can be animated.
         * @default true
         */
        animatable?: boolean;
        /**
         * Whether this property should be shown.
         *
         * @default false
         */
        hide?: boolean;
    }
}

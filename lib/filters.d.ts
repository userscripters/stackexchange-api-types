export namespace Filters {
    export type BuiltIn = "default" | "withbody" | "default" | "none" | "total";
}

declare module global {
    namespace StackExchangeAPI {
        namespace Filters {
            type BuiltIn = "default" | "withbody" | "default" | "none" | "total";
        }
    }
}

import {Wrappers} from "./lib/wrapper";

declare global {
    namespace StackExchangeAPI {
        export import CommonWrapperObject = Wrappers.CommonWrapperObject;
    }
}

export * from "./lib/filters";
export * from "./lib/types";
export * from "./lib/wrapper";
export as namespace StackExchangeAPI;

import type { Errors } from "./errors";

export namespace Wrappers {
    export interface CommonWrapperObject<T extends object = object> {
        backoff?: number;
        error_id?: Errors.Code;
        error_message?: string;
        error_name?: Errors.Name;
        has_more: boolean;
        items: T[];
        page?: number;
        page_size?: number;
        quota_max: number;
        quota_remaining: number;
        total?: number;
        type?: string;
    }
}

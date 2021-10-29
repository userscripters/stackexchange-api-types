export interface CommonWrapperObject<T extends object = object> {
    backoff?: number;
    error_id?: number;
    error_message?: string;
    error_name?: string;
    has_more: boolean;
    items: T[];
    page?: number;
    page_size?: number;
    quota_max: number;
    quota_remaining: number;
    total?: number;
    type?: string;
}

export as namespace StackExchangeAPI;

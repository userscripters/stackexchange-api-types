export namespace Errors {
    export type Name = "bad_parameter" | "access_token_required" | "invalid_access_token" | "access_denied" | "no_method" | "key_required" | "access_token_compromised" | "write_failed" | "duplicate_request" | "internal_error" | "throttle_violation" | "temporarily_unavailable";
    export type Code = 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 409 | 500 | 502 | 503;
}

declare global {
    namespace StackExchangeAPI {
        export namespace Errors {
            export type Name = "bad_parameter" | "access_token_required" | "invalid_access_token" | "access_denied" | "no_method" | "key_required" | "access_token_compromised" | "write_failed" | "duplicate_request" | "internal_error" | "throttle_violation" | "temporarily_unavailable";
            export type Code = 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 409 | 500 | 502 | 503;
        }
    }
}

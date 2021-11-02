import { expectType } from "tsd";
import type { Errors } from "../index";

const errorMap: Record<Errors.Name, Errors.Code> = {
    bad_parameter: 400,
    access_token_required: 401,
    invalid_access_token: 402,
    access_denied: 403,
    no_method: 404,
    key_required: 405,
    access_token_compromised: 406,
    write_failed: 407,
    duplicate_request: 409,
    internal_error: 500,
    throttle_violation: 502,
    temporarily_unavailable: 503,
};

expectType<Errors.Code>(errorMap["access_token_required"]);

Object.values(errorMap).forEach((errorCode) =>
    expectType<Errors.Code>(errorCode)
);

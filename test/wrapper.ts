import { expectAssignable, expectType } from "tsd";
import { Question } from "../lib/types";
import { CommonWrapperObject } from "../lib/wrapper";

declare function getQuestionFromAPI(
    id: number
): Promise<CommonWrapperObject<Question>>;

const response = await getQuestionFromAPI(42);
expectAssignable<CommonWrapperObject>(response);

const { backoff, items, has_more, quota_max, quota_remaining } = response;
expectType<Question[]>(items);
expectType<boolean>(has_more);
expectType<number>(quota_max);
expectType<number>(quota_remaining);
expectType<number | undefined>(backoff);

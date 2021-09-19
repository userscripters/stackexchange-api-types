import { expectType } from "tsd";
import { Answer, Collective, Comment, ShallowUser } from "../lib/types";

declare function getAnswer(id: number): Promise<Answer>;

const answer = await getAnswer(42);
expectType<Answer>(answer);
expectType<number>(answer.answer_id);
expectType<Collective[]>(answer.collectives);
expectType<Comment[] | undefined>(answer.comments);
expectType<ShallowUser>(answer.owner);

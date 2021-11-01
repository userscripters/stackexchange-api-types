import type { Filters } from "../lib/filters";

const filter: Filters.BuiltIn = "total";

const userURL = new URL(`https://api.stackexchange.com/2.3/users`);
userURL.search = new URLSearchParams({
    pagesize: "100",
    order: "desc",
    sort: "reputation",
    filter,
}).toString();

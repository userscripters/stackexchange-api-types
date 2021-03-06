import got from "got";
import { generateErrors } from "./errors.js";
import { generateBuiltInFilters } from "./filters.js";
import { generateTypes } from "./types.js";
import { generateResponseWrapper } from "./wrapper.js";

const DOCS_BASE = "https://api.stackexchange.com";
const TYPES_PATH = "./lib";

const { version, name, description } = await import("../package.json");

got.extend({
    responseType: "text",
    headers: {
        "User-Agent": `name ${name}; version ${version}; about ${description};`,
    },
});

const typeReqSel = ".method-name > .excluded";
const typeNameSel = ".mainbar > .subheader h1";
const typeFieldsSel = ".indented > .method";

const { default: ts } = await import("typescript");
const { factory } = ts;

const nsName = "StackExchangeAPI";

const unionRegex =
    /(?:(?:an )?array of )?(?:one of )?'?(\w+)'?(?:,? (?:or )?(?:but new options (?:can|may|might) be added\.)?|$)/i;

const generate = {
    wrapper: true,
    filters: true,
    errors: true,
    types: true,
};

if (generate.wrapper) {
    await generateResponseWrapper(
        factory,
        DOCS_BASE,
        "/docs/wrapper",
        `${TYPES_PATH}/wrapper.d.ts`,
        typeNameSel,
        typeFieldsSel,
        typeReqSel,
        unionRegex,
        "Wrappers"
    );
}

if (generate.filters) {
    await generateBuiltInFilters(
        factory,
        DOCS_BASE,
        "/docs/filters",
        `${TYPES_PATH}/filters.d.ts`,
        "Filters",
        nsName
    );
}

if (generate.errors) {
    await generateErrors(
        factory,
        DOCS_BASE,
        "/docs/error-handling",
        `${TYPES_PATH}/errors.d.ts`,
        "Errors",
        nsName
    );
}

if (generate.types) {
    await generateTypes(
        factory,
        DOCS_BASE,
        "/docs",
        `${TYPES_PATH}/types.d.ts`,
        nsName
    );
}

import * as v from "valibot";

export async function getJson<TSchema extends v.GenericSchema>(
    url: string,
    schema: TSchema): Promise<v.InferOutput<TSchema>> {
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) throw new Error(`Failed to fetch: ${url} (${res.status})`);
    const data = await res.json();
    return v.parse(schema, data);
}

export async function batchRequests<TSchema extends v.GenericSchema>(
    urls: string[],
    schema: TSchema,
    batchSize = 500): Promise<v.InferOutput<TSchema>[]> {
    const results: v.InferOutput<TSchema>[] = [];
    for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map((url) => getJson(url, schema)));
        results.push(...batchResults);
    }
    return results;
}


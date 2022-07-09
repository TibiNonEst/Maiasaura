import { verify } from "https://deno.land/x/scrypt@v4.0.0/mod.ts";
import { renderFile } from 'https://deno.land/x/mustache@v0.3.0/mod.ts';
import { router } from "https://crux.land/router@0.0.12";
import { serve } from "https://deno.land/std@0.146.0/http/server.ts";
import { StorageObject } from "./bunnycdn.d.ts";

import "https://deno.land/std@0.146.0/dotenv/load.ts";

const handler = router({
    "GET@*": (req) => get(req),
    "PUT@*": (req) => put(req)
});

async function get(req: Request): Promise<Response> {
    const path = new URL(req.url).pathname;

    if (!path.endsWith("/")) {
        return fetch(`https://${Deno.env.get("BUNNY_CDN") + path}`);
    }

    const headers = new Headers(req.headers);
    headers.delete("Referer");
    headers.append("AccessKey", Deno.env.get("BUNNY_KEY") || "");

    const resp = await fetch(`https://${Deno.env.get("BUNNY_ENDPOINT")}/${Deno.env.get("BUNNY_ZONE") + path}`, { method: 'GET', headers });

    return index(await resp.json(), path);
}

async function put(req: Request): Promise<Response> {
    const authorized = await auth(req.headers);

    if (!authorized) {
        return new Response("401 – Access denied.");
    }

    const headers = new Headers(req.headers);
    headers.append("AccessKey", Deno.env.get("BUNNY_KEY") || "");

    const url = `https://${Deno.env.get("BUNNY_ENDPOINT")}/${Deno.env.get("BUNNY_ZONE") + new URL(req.url).pathname}`;

    return fetch(url, { method: 'PUT', headers, body: req.body });
}

async function index(json: StorageObject[], path: string): Promise<Response> {
    const directories = json.filter(obj => obj.IsDirectory);
    const files = json.filter(obj => !obj.IsDirectory);

    const data = { title: Deno.env.get("TITLE"), root: path == "/", path, directories, files };

    return new Response(await renderFile("base.html", data), { headers: { "content-type": "text/html" }});
}

function auth(headers: Headers): boolean {
    const authorization = headers.get("Authorization");
    if (!authorization || !authorization.startsWith("Basic")) {
        return false;
    }

    const [username, password] = atob(authorization.slice(6)).split(":");

    return username == Deno.env.get("USERNAME") && verify(password, Deno.env.get("HASH") || "");
}

await serve(handler);

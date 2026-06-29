import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/features/auth/constants/auth.constants";
import { serverEnv } from "@/shared/config/env";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

function asBearerToken(token?: string | null) {
  if (!token) {
    return null;
  }

  return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
}

async function proxyLatRequest(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const targetBaseUrl = serverEnv?.API_INTERNAL_BASE_URL ?? "https://faq-admin.projectinclusion.in";
  const targetUrl = new URL(`/api/LAT/${path.join("/")}`, targetBaseUrl);
  request.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });

  const headers = new Headers({
    accept: request.headers.get("accept") ?? "application/json"
  });
  const authorization =
    asBearerToken(request.cookies.get(AUTH_COOKIE_NAME)?.value) ??
    request.headers.get("authorization") ??
    asBearerToken(serverEnv?.LAT_API_BEARER_TOKEN);

  if (authorization) {
    headers.set("authorization", authorization);
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  if (hasBody) {
    headers.set("content-type", request.headers.get("content-type") ?? "application/json");
  }

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: hasBody ? await request.text() : undefined,
    cache: "no-store"
  });
  const body = await response.text();

  return new NextResponse(body, {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") ?? "application/json"
    }
  });
}

export function GET(request: NextRequest, context: RouteContext) {
  return proxyLatRequest(request, context);
}

export function POST(request: NextRequest, context: RouteContext) {
  return proxyLatRequest(request, context);
}

export function PUT(request: NextRequest, context: RouteContext) {
  return proxyLatRequest(request, context);
}

export function PATCH(request: NextRequest, context: RouteContext) {
  return proxyLatRequest(request, context);
}

export function DELETE(request: NextRequest, context: RouteContext) {
  return proxyLatRequest(request, context);
}

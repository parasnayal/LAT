import { NextResponse, type NextRequest } from "next/server";
import { filterAndPaginate, mockPermissions } from "@/shared/lib/mock-rbac-data";

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const resource = searchParams.get("resource");
  const permissions =
    resource && resource !== "all"
      ? mockPermissions.filter((permission) => permission.resource === resource)
      : mockPermissions;
  const response = filterAndPaginate(
    permissions,
    {
      search: searchParams.get("search") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      page: Number(searchParams.get("page") ?? 1),
      pageSize: Number(searchParams.get("pageSize") ?? 8)
    },
    (permission, search) =>
      permission.name.toLowerCase().includes(search) ||
      permission.code.toLowerCase().includes(search) ||
      permission.description.toLowerCase().includes(search)
  );

  return NextResponse.json(response);
}

export async function POST() {
  return NextResponse.json({ ok: true }, { status: 201 });
}

import { NextResponse, type NextRequest } from "next/server";
import { filterAndPaginate, mockRoles } from "@/shared/lib/mock-rbac-data";

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const response = filterAndPaginate(
    mockRoles,
    {
      search: searchParams.get("search") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      page: Number(searchParams.get("page") ?? 1),
      pageSize: Number(searchParams.get("pageSize") ?? 6)
    },
    (role, search) =>
      role.name.toLowerCase().includes(search) ||
      role.description.toLowerCase().includes(search) ||
      role.code.toLowerCase().includes(search)
  );

  return NextResponse.json(response);
}

export async function POST() {
  return NextResponse.json({ ok: true }, { status: 201 });
}

import { NextResponse, type NextRequest } from "next/server";
import { filterAndPaginate, mockUsers } from "@/shared/lib/mock-rbac-data";

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const role = searchParams.get("role");
  const users =
    role && role !== "all"
      ? mockUsers.filter((user) => user.roleCodes.includes(role as never))
      : mockUsers;
  const response = filterAndPaginate(
    users,
    {
      search: searchParams.get("search") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      page: Number(searchParams.get("page") ?? 1),
      pageSize: Number(searchParams.get("pageSize") ?? 6)
    },
    (user, search) =>
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.organizationName.toLowerCase().includes(search)
  );

  return NextResponse.json(response);
}

export async function POST() {
  return NextResponse.json({ ok: true }, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const accessToken = request.cookies.get("access_token")?.value;

	if (!accessToken)
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

	const response = await fetch("https://api.intra.42.fr/v2/me", {
		next: { revalidate: 30 },
		headers:
		{
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!response.ok)
		return NextResponse.json({ error: "Failed to fetch profile" }, { status: response.status });

	const data = await response.json();

	const student =
	{
		id: data.id,
		login: data.login,
		fullName: data.usual_full_name ?? data.displayname,
		campus: data.campus?.[0]?.name,
		avatarUrl: data.image.link ?? "",
		wallet: data.wallet,
		evaluationPoints: data.correction_point,
	};

	return NextResponse.json(student);
}

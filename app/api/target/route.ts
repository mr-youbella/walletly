import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(request: NextRequest) {
	const accessToken = request.cookies.get("access_token")?.value;

	if (!accessToken)
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

	const meResponse = await fetch("https://api.intra.42.fr/v2/me", {
		headers: { Authorization: `Bearer ${accessToken}` },
	});

	if (!meResponse.ok)
		return NextResponse.json({ error: "Failed to verify student" }, { status: 401 });

	const me = await meResponse.json();

	try {
		const result = await pool.query(
			`SELECT target FROM logins WHERE login = $1`,
			[me.login]
		);

		const target = result.rows[0]?.target ?? 0;

		return NextResponse.json({ target });
	}
	catch (error) {
		console.error("Failed to fetch target:", error);
		return NextResponse.json({ error: "Failed to fetch target" }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	const accessToken = request.cookies.get("access_token")?.value;

	if (!accessToken)
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

	const body = await request.json();
	const target = Number(body.target);

	if (!Number.isFinite(target) || target < 0)
		return NextResponse.json({ error: "Invalid target" }, { status: 400 });

	const meResponse = await fetch("https://api.intra.42.fr/v2/me", {
		headers: { Authorization: `Bearer ${accessToken}` },
	});

	if (!meResponse.ok)
		return NextResponse.json({ error: "Failed to verify student" }, { status: 401 });

	const me = await meResponse.json();

	try {
		await pool.query(
			`UPDATE logins SET target = $1 WHERE login = $2`,
			[target, me.login]
		);
	}
	catch (error) {
		console.error("Failed to save target:", error);
		return NextResponse.json({ error: "Failed to save target" }, { status: 500 });
	}

	return NextResponse.json({ success: true });
}

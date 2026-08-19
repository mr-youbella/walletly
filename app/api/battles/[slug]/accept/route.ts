import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../../../../lib/db";

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
	const accessToken = request.cookies.get("access_token")?.value;

	if (!accessToken)
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

	const { slug } = await params;

	const meResponse = await fetch("https://api.intra.42.fr/v2/me", {
		headers: { Authorization: `Bearer ${accessToken}` },
	});

	if (!meResponse.ok)
		return NextResponse.json({ error: "Failed to verify student" }, { status: 401 });

	const me = await meResponse.json();

	const battleResult = await pool.query(
		`SELECT id, challenger_login, opponent_login, status FROM battles WHERE slug = $1`,
		[slug]
	);

	const battle = battleResult.rows[0];

	if (!battle)
		return NextResponse.json({ error: "Battle not found" }, { status: 404 });

	if (battle.status !== "pending")
		return NextResponse.json({ error: "Battle is no longer pending" }, { status: 409 });

	if (battle.opponent_login)
		return NextResponse.json({ error: "Battle already has an opponent" }, { status: 409 });

	if (battle.challenger_login === me.login)
		return NextResponse.json({ error: "You cannot accept your own challenge" }, { status: 400 });

	try {
		await pool.query(
			`UPDATE battles
			 SET opponent_login = $1, status = 'active', accepted_at = NOW()
			 WHERE slug = $2`,
			[me.login, slug]
		);

		return NextResponse.json({ success: true });
	}
	catch (error) {
		console.error("Failed to accept battle:", error);
		return NextResponse.json({ error: "Failed to accept battle" }, { status: 500 });
	}
}

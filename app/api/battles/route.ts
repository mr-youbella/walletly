import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../../lib/db";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest) {
	const accessToken = request.cookies.get("access_token")?.value;

	if (!accessToken)
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

	const body = await request.json();
	const target = Number(body.target);
	const currentWallet = Number(body.currentWallet);

	if (!Number.isFinite(target) || target <= 0 || !Number.isFinite(currentWallet) || target >= currentWallet)
		return NextResponse.json({ error: "Invalid target" }, { status: 400 });

	const meResponse = await fetch("https://api.intra.42.fr/v2/me", {
		headers: { Authorization: `Bearer ${accessToken}` },
	});

	if (!meResponse.ok)
		return NextResponse.json({ error: "Failed to verify student" }, { status: 401 });

	const me = await meResponse.json();

	const slug = randomBytes(12).toString("hex");

	try {
		await pool.query(
			`INSERT INTO battles (challenger_login, target, slug)
			 VALUES ($1, $2, $3)`,
			[me.login, target, slug]
		);

		return NextResponse.json({ slug });
	}
	catch (error) {
		console.error("Failed to create battle:", error);
		return NextResponse.json({ error: "Failed to create battle" }, { status: 500 });
	}
}

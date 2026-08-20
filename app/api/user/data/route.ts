import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { pool } from "@/lib/db";

export async function GET() {
	try {
		const cookieStore = await cookies();
		const accessToken = cookieStore.get("access_token")?.value;

		if (!accessToken)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const response = await fetch("https://api.intra.42.fr/v2/me", {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		if (!response.ok)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const user = await response.json();
		const login = user.login;

		const result = await pool.query(
			"SELECT target, wallet FROM logins WHERE login = $1",
			[login]
		);

		if (result.rows.length === 0)
			return NextResponse.json({ error: "User not found" }, { status: 404 });

		return NextResponse.json({
			target: result.rows[0].target || 0,
			wallet: result.rows[0].wallet || 0,
		});
	} catch (error) {
		console.error("Error fetching user data:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

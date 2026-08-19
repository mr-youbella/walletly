import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(request: NextRequest) {
	const code = request.nextUrl.searchParams.get("code");
	const state = request.nextUrl.searchParams.get("state");
	const storedState = request.cookies.get("oauth_state")?.value;

	if (!code)
		return NextResponse.redirect(new URL("/auth?error=no_code", request.url));

	if (!state || !storedState || state !== storedState)
		return NextResponse.redirect(new URL("/auth?error=invalid_state", request.url));

	const tokenResponse = await fetch("https://api.intra.42.fr/oauth/token", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			grant_type: "authorization_code",
			client_id: process.env.FT_CLIENT_ID,
			client_secret: process.env.FT_CLIENT_SECRET,
			code,
			redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/42/callback`,
		}),
	});

	if (!tokenResponse.ok)
		return NextResponse.redirect(new URL("/auth?error=token_failed", request.url));

	const tokenData = await tokenResponse.json();
	const accessToken = tokenData.access_token;

	const meResponse = await fetch("https://api.intra.42.fr/v2/me", {
		headers: { Authorization: `Bearer ${accessToken}` },
	});

	if (!meResponse.ok)
		return NextResponse.redirect(new URL("/auth?error=profile_failed", request.url));

	const me = await meResponse.json();

	if (typeof me.login !== "string" || me.login.length === 0 || me.login.length > 50)
		return NextResponse.redirect(new URL("/auth?error=invalid_profile", request.url));

	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	try {
		await pool.query(
			`
			INSERT INTO logins ( login, wallet, timezone, streak_count, last_streak_date)
			VALUES ($1, $2, $3, 1, (NOW() AT TIME ZONE $3)::date)
			ON CONFLICT (login)
			DO UPDATE
			SET
				wallet = EXCLUDED.wallet,
				timezone = EXCLUDED.timezone,
				last_login_at = NOW(),
				streak_count = CASE
					WHEN logins.last_streak_date = EXCLUDED.last_streak_date THEN logins.streak_count
					WHEN logins.last_streak_date = EXCLUDED.last_streak_date - 1 THEN logins.streak_count + 1
					ELSE 1
				END,
				last_streak_date = EXCLUDED.last_streak_date;
		`,
			[me.login, me.wallet, timezone,]
		);

		await pool.query(
			`UPDATE battles
			 SET status = 'finished', winner_login = $1, finished_at = NOW()
			 WHERE (challenger_login = $1 OR opponent_login = $1)
			   AND status = 'active'
			   AND $2 >= target`,
			[me.login, me.wallet]
		);
	}
	catch (error) {
		console.error("Failed to record login:", error);
	}

	const response = NextResponse.redirect(new URL("/dashboard", request.url));

	response.cookies.set("access_token", accessToken,
		{
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: tokenData.expires_in,
			path: "/",
		});

	response.cookies.delete("oauth_state");

	return response;
}

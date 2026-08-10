import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
	const code = request.nextUrl.searchParams.get("code");

	if (!code)
		return NextResponse.redirect(new URL("/auth?error=no_code", request.url));

	const tokenResponse = await fetch("https://api.intra.42.fr/oauth/token", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(
			{
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

	const response = NextResponse.redirect(new URL("/dashboard", request.url));

	response.cookies.set("access_token", accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: tokenData.expires_in,
		path: "/",
	})

	return (response);
}

import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function GET() {
	const state = randomBytes(16).toString("hex");

	const params = new URLSearchParams({
		client_id: process.env.FT_CLIENT_ID as string,
		redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/42/callback`,
		response_type: "code",
		state,
	});

	const response = NextResponse.redirect(`https://api.intra.42.fr/oauth/authorize?${params.toString()}`);

	response.cookies.set("oauth_state", state, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 600,
		path: "/",
	});

	return (response);
}

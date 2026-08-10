import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const params = new URLSearchParams(
		{
			client_id: process.env.FT_CLIENT_ID as string,
			redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/42/callback`,
			response_type: "code",
		});

	return NextResponse.redirect(`https://api.intra.42.fr/oauth/authorize?${params.toString()}`);
}

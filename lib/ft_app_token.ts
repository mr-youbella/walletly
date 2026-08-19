let cachedToken: string | null = null;
let cachedTokenExpiry = 0;

export async function getAppToken(): Promise<string> {
	const now = Date.now();

	if (cachedToken && now < cachedTokenExpiry)
		return cachedToken;

	const response = await fetch("https://api.intra.42.fr/oauth/token", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			grant_type: "client_credentials",
			client_id: process.env.FT_CLIENT_ID,
			client_secret: process.env.FT_CLIENT_SECRET,
		}),
	});

	if (!response.ok) {
		throw new Error("Failed to fetch 42 app token");
	}

	const data = await response.json();

	cachedToken = data.access_token;
	cachedTokenExpiry = now + (data.expires_in - 60) * 1000;

	return cachedToken as string;
}

export async function getStudentWallet(login: string): Promise<number | null> {
	try {
		const appToken = await getAppToken();

		const response = await fetch(`https://api.intra.42.fr/v2/users/${login}`, {
			headers: { Authorization: `Bearer ${appToken}` },
		});

		if (!response.ok)
			return null;

		const data = await response.json();
		return data.wallet ?? null;
	}
	catch (error) {
		console.error(`Failed to fetch wallet for ${login}:`, error);
		return null;
	}
}

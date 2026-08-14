import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import LoginPage from "./login";

export default async function Login() {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("access_token")?.value;

	if (accessToken) {
		const response = await fetch("https://api.intra.42.fr/v2/me", {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		if (response.ok)
			redirect("/dashboard");
	}

	return <LoginPage />;
}

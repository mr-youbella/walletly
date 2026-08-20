import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { pool } from "../../lib/db";
import { Header } from "../components/header";
import LeaderboardClient from "./leaderboard";

type LeaderboardRow = {
	login: string;
	wallet: number;
	effective_streak: number;
};

async function getCurrentLogin(): Promise<string | null> {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("access_token")?.value;

	if (!accessToken)
		return null;

	const response = await fetch("https://api.intra.42.fr/v2/me", {
		headers: { Authorization: `Bearer ${accessToken}` },
	});

	if (!response.ok)
		return null;

	const data = await response.json();
	return data.login ?? null;
}

async function getCurrentStreakTargetWallet(login: string): Promise<{ streak: number, target: number, wallet: number }> {
	let streak = 0;
	let target = 0;
	let wallet = 0;
	try {
		const result = await pool.query(
			`SELECT streak_count, target, wallet FROM logins WHERE login = $1`,
			[login]
		);

		streak = result.rows[0]?.streak_count ?? 0;
		target = result.rows[0]?.target ?? 0;
		wallet = result.rows[0]?.wallet ?? 0;
	}
	catch (error) {
		console.error("Failed to fetch streak:", error);
	}
	return ({ streak, target, wallet });
}

async function getLeaderboard(): Promise<LeaderboardRow[]> {
	const result = await pool.query(
		`SELECT login, wallet,
		 CASE
			WHEN last_streak_date >= CURRENT_DATE - 1 THEN streak_count
			ELSE 0
		 END AS effective_streak
		 FROM logins
		 LIMIT 50`
	);

	return result.rows;
}

export default async function Leaderboar() {
	const currentLogin = await getCurrentLogin();
	if (!currentLogin)
		redirect(`/auth?callbackUrl=${encodeURIComponent(`/leaderboard`)}`);

	const currentStreakTargetWallet = await getCurrentStreakTargetWallet(currentLogin);
	const streak = currentStreakTargetWallet.streak;
	const target = currentStreakTargetWallet.target;
	const currentWallet = currentStreakTargetWallet.wallet;
	const leaderboard = await getLeaderboard();

	return (
		<div className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-[#0a0b10] via-[#0f0f1a] to-[#1a0f0f] text-white">

			<div
				className="pointer-events-none absolute inset-0 opacity-[0.08]"
				style={{
					backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
					backgroundSize: "40px 40px",
				}}
			/>
			<Header login={currentLogin} streak={streak} />

			<div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-red-500/10 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-orange-500/5 blur-3xl" />

			<LeaderboardClient leaderboard={leaderboard} currentLogin={currentLogin} target={target} currentWallet={currentWallet} />
		</div>
	);
}

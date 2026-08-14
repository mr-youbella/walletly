import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { pool } from "../../lib/db";
import { Trophy, Medal, Wallet } from "lucide-react";
import { Header } from "../components/header";

type LeaderboardRow = {
	login: string;
	wallet: number;
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

async function getLeaderboard(): Promise<LeaderboardRow[]> {
	const result = await pool.query(
		`SELECT login, wallet
		 FROM logins
		 ORDER BY wallet DESC
		 LIMIT 50`
	);

	return result.rows;
}

function rankStyle(rank: number) {
	if (rank === 1)
		return { color: "#FBBF24", bg: "rgba(251,191,36,0.12)" };
	if (rank === 2)
		return { color: "#D1D5DB", bg: "rgba(209,213,219,0.1)" };
	if (rank === 3)
		return { color: "#FB923C", bg: "rgba(251,146,60,0.12)" };
	return { color: "rgba(255,255,255,0.4)", bg: "rgba(255,255,255,0.03)" };
}

export default async function LeaderboardPage() {
	const currentLogin = await getCurrentLogin();

	if (!currentLogin)
		redirect("/auth");

	const leaderboard = await getLeaderboard();

	return (
		<div className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-[#0a0b10] via-[#0f0f1a] to-[#1a0f0f] text-white">

			<Header login={currentLogin} />

			<div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-red-500/10 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-orange-500/5 blur-3xl" />

			<main className="relative mx-auto max-w-2xl py-8 sm:px-6 sm:py-10 px-4">
				<div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-linear-to-r from-red-500/5 to-orange-500/5 p-4 sm:p-5">
					<div
						className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-lg shadow-red-500/20"
						style={{ background: "linear-gradient(135deg, #DC2626, #991B1B)" }}
					>
						<Trophy size={18} className="text-white" />
					</div>
					<div className="min-w-0">
						<h1 className="bg-linear-to-r from-[#DC2626] to-[#F97316] bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
							Leaderboard
						</h1>
						<p className="text-xs text-white/40 sm:text-sm">Top Wallet holders on Walletly</p>
					</div>
				</div>

				<div className="mt-6 overflow-hidden rounded-2xl border border-white/5 bg-white/2">
					{leaderboard.length === 0 && (
						<p className="px-5 py-10 text-center text-sm text-white/30">No students yet.</p>
					)}

					{leaderboard.map((row, index) => {
						const rank = index + 1;
						const style = rankStyle(rank);
						const isCurrentUser = row.login === currentLogin;

						return (
							<div
								key={row.login}
								className={`flex items-center gap-4 border-b border-white/4 px-5 py-3.5 last:border-0 ${isCurrentUser ? "bg-red-500/8" : ""}`}
							>
								<div
									className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold"
									style={{ backgroundColor: style.bg, color: style.color }}
								>
									{rank <= 3 ? <Medal size={16} /> : rank}
								</div>

								<a
									href={`https://profile.intra.42.fr/users/${row.login}`}
									target="_blank"
									className="min-w-0 flex-1 truncate text-sm font-semibold text-white/90 hover:text-white"
								>
									@{row.login}
									{isCurrentUser && (
										<span className="ml-2 rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-medium text-[#F87171]">You</span>
									)}
								</a>

								<span className="flex shrink-0 items-center gap-1.5 text-sm font-bold text-white/80">
									<Wallet size={14} className="text-[#F87171]" />
									{row.wallet.toLocaleString()} ₳
								</span>
							</div>
						);
					})}
				</div>
			</main>
		</div>
	);
}

"use client"
import { useMemo, useState } from "react"
import { Trophy, Medal, Wallet, Flame } from "lucide-react"
import ChallengeButton from "../components/ChallengeButton";

type LeaderboardRow = {
	login: string;
	wallet: number;
	effective_streak: number;
};

function rankStyle(rank: number) {
	if (rank === 1)
		return { color: "#FBBF24", bg: "rgba(251,191,36,0.12)" };
	if (rank === 2)
		return { color: "#D1D5DB", bg: "rgba(209,213,219,0.1)" };
	if (rank === 3)
		return { color: "#FB923C", bg: "rgba(251,146,60,0.12)" };
	return { color: "rgba(255,255,255,0.4)", bg: "rgba(255,255,255,0.03)" };
}

export default function LeaderboardClient({ leaderboard, currentLogin, target, currentWallet }: { leaderboard: LeaderboardRow[]; currentLogin: string; target: number, currentWallet: number }) {
	const [sortBy, setSortBy] = useState<"wallet" | "effective_streak">("wallet");

	const sorted = useMemo(() => {
		return [...leaderboard].sort((a, b) => b[sortBy] - a[sortBy]);
	}, [leaderboard, sortBy]);

	return (
		<main className="relative mx-auto max-w-2xl py-8 sm:px-6 sm:py-10 px-4">
			<div className="flex flex-col items-start gap-3 rounded-2xl border border-white/5 bg-linear-to-r from-red-500/5 to-orange-500/5 p-4 sm:p-5">
				<div className="flex items-center gap-3 min-w-0 flex-1 w-full">
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
						<p className="text-xs text-white/40 sm:text-sm">
							{sortBy === "wallet" ? "Top Wallet holders on Walletly" : "Longest streaks on Walletly"}
						</p>
					</div>
				</div>

				<div className="w-full">
					<ChallengeButton target={target} currentWallet={currentWallet} />
				</div>
			</div>

			<div className="mt-5 flex gap-2">
				<button
					onClick={() => setSortBy("wallet")}
					className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${sortBy === "wallet"
						? "border-red-500/30 bg-red-500/15 text-white"
						: "border-white/10 text-white/50 hover:border-white/20 hover:text-white/80"
						}`}
				>
					<Wallet size={14} />
					Wallet
				</button>
				<button
					onClick={() => setSortBy("effective_streak")}
					className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${sortBy === "effective_streak"
						? "border-orange-500/30 bg-orange-500/15 text-white"
						: "border-white/10 text-white/50 hover:border-white/20 hover:text-white/80"
						}`}
				>
					<Flame size={14} />
					Streak
				</button>
			</div>

			<div className="mt-6 overflow-hidden rounded-2xl border border-white/5 bg-white/2">
				{sorted.length === 0 && (
					<p className="px-5 py-10 text-center text-sm text-white/30">No students yet.</p>
				)}

				{sorted.map((row, index) => {
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

							{sortBy === "wallet" ? (
								<span className="flex shrink-0 items-center gap-1.5 text-sm font-bold text-white/80">
									<Wallet size={14} className="text-[#F87171]" />
									{row.wallet.toLocaleString()} ₳
								</span>
							) : (
								<span className="flex shrink-0 items-center gap-1.5 text-sm font-bold text-orange-400">
									<Flame size={14} />
									{row.effective_streak} days
								</span>
							)}
						</div>
					);
				})}
			</div>
		</main>
	);
}

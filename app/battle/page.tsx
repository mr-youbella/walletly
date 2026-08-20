import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { pool } from "@/lib/db";
import { Swords, Target, Clock, CheckCircle, Trophy, Calendar, User } from "lucide-react";
import { Header } from "../components/header";
import BattleActions from "./BattleActions";
import ChallengeButton from "../components/ChallengeButton";

type BattleRow = {
	id: number;
	challenger_login: string;
	opponent_login: string | null;
	target: number;
	status: string;
	winner_login: string | null;
	created_at: string;
	accepted_at: string | null;
	finished_at: string | null;
	slug: string;
};

async function getCurrentUser(): Promise<{ login: string; fullName: string } | null> {
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
	return { login: data.login, fullName: data.displayname };
}

async function getUserBattles(login: string): Promise<BattleRow[]> {
	const result = await pool.query(
		`SELECT id, challenger_login, opponent_login, target, status, winner_login, 
		 created_at, accepted_at, finished_at, slug
		 FROM battles
		 WHERE challenger_login = $1 OR opponent_login = $1
		 ORDER BY created_at DESC`,
		[login]
	);

	return result.rows;
}

async function deleteBattle(battleId: number, userLogin: string) {
	"use server"

	const result = await pool.query(
		"SELECT challenger_login FROM battles WHERE id = $1",
		[battleId]
	);

	if (result.rows.length === 0)
		throw new Error("Battle not found");

	if (result.rows[0].challenger_login !== userLogin)
		throw new Error("You can only delete your own battles");

	await pool.query("DELETE FROM battles WHERE id = $1", [battleId]);
}

function formatDate(value: string) {
	return new Date(value).toLocaleString("en-US", {
		timeZone: "Africa/Casablanca",
		dateStyle: "medium",
		timeStyle: "short",
	});
}

function getStatusBadge(status: string) {
	switch (status) {
		case 'pending':
			return { color: '#FBBF24', bg: 'rgba(251,191,36,0.15)', icon: Clock, label: 'Pending' };
		case 'active':
			return { color: '#60A5FA', bg: 'rgba(96,165,250,0.15)', icon: CheckCircle, label: 'Active' };
		case 'finished':
			return { color: '#34D399', bg: 'rgba(52,211,153,0.15)', icon: CheckCircle, label: 'Completed' };
		default:
			return { color: '#9CA3AF', bg: 'rgba(156,163,175,0.1)', icon: Clock, label: status };
	}
}

export default async function MyBattlesPage() {
	const user = await getCurrentUser();

	if (!user)
		redirect(`/auth?callbackUrl=${encodeURIComponent(`/battle`)}`);

	const battles = await getUserBattles(user.login);

	return (
		<div className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-[#0a0b10] via-[#0f0f1a] to-[#1a0f0f] text-white">
			<Header login={user.login} />

			<div
				className="pointer-events-none absolute inset-0 opacity-[0.08]"
				style={{
					backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
					backgroundSize: "40px 40px",
				}}
			/>

			<div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-red-500/20 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

			<main className="relative mx-auto max-w-4xl sm:px-6 sm:py-10 py-8 px-4">
				<div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-linear-to-r from-red-500/5 to-orange-500/5 p-4 sm:p-5">
					<div
						className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-lg shadow-red-500/20"
						style={{ background: "linear-gradient(135deg, #DC2626, #991B1B)" }}
					>
						<Swords size={20} className="text-white" />
					</div>
					<div className="min-w-0 flex-1">
						<h1 className="bg-linear-to-r from-[#DC2626] to-[#F97316] bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
							My Battles
						</h1>
						<p className="text-xs text-white/40 sm:text-sm">
							{battles.length} battle{battles.length !== 1 ? 's' : ''} • @{user.login}
						</p>
					</div>
				</div>

				<div className="my-6 space-y-3">
					{battles.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-white/5 bg-white/2">
							<Swords size={48} className="text-white/10 mb-4" />
							<p className="text-white/40 text-sm">No battles yet</p>
							<p className="text-white/20 text-xs mt-1">Challenge a friend to get started!</p>
						</div>
					) : (
						battles.map((row) => {
							const statusInfo = getStatusBadge(row.status);
							const StatusIcon = statusInfo.icon;
							const isChallenger = row.challenger_login === user.login;
							const opponent = isChallenger ? row.opponent_login : row.challenger_login;
							const isWinner = row.winner_login === user.login;

							return (
								<div key={row.id} className="rounded-2xl border border-white/5 bg-white/2 p-4 sm:p-5 transition hover:border-white/10 hover:bg-white/4">
									<div className="flex flex-col sm:flex-row sm:items-center gap-4">
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 flex-wrap">
												<span className="text-sm font-medium text-white/90">
													{isChallenger ? 'You' : (
														<a href={`https://profile.intra.42.fr/users/${row.challenger_login}`} target="_blank" className="hover:text-white">
															@{row.challenger_login}
														</a>
													)}
												</span>
												<span className="text-white/20 text-xs">vs</span>
												<span className="text-sm font-medium text-white/90">
													{!isChallenger ? 'You' : opponent ? (
														<a href={`https://profile.intra.42.fr/users/${opponent}`} target="_blank" className="hover:text-white">
															@{opponent}
														</a>
													) : (
														<span className="text-white/30">Anyone</span>
													)}
												</span>
											</div>
											<div className="flex items-center gap-4 mt-1.5 flex-wrap">
												<span className="flex items-center gap-1 text-xs text-white/40">
													<Target size={12} className="text-[#F97316]" />
													{row.target.toLocaleString()} ₳
												</span>
												<span className="flex items-center gap-1 text-xs text-white/40">
													<Calendar size={12} />
													{formatDate(row.created_at)}
												</span>
												{row.winner_login && (
													<span className={`flex items-center gap-1 text-xs ${isWinner ? 'text-[#FBBF24]' : 'text-white/40'}`}>
														<Trophy size={12} />
														{isWinner ? 'You won! 🎉' : `@${row.winner_login} won`}
													</span>
												)}
											</div>
										</div>
										<div className="flex items-center gap-3 shrink-0">
											<span
												className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap"
												style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}
											>
												<StatusIcon size={12} />
												{statusInfo.label}
											</span>
											<BattleActions
												battleId={row.id}
												slug={row.slug}
												status={row.status}
												isChallenger={isChallenger}
												userLogin={user.login}
												deleteAction={deleteBattle}
											/>
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>
				<ChallengeButton />
			</main>
		</div>
	);
}

import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { pool } from "../../../lib/db";
import { Header } from "../../components/header";
import { Swords, Crown } from "lucide-react";
import AcceptButton from "./AcceptButton";

type Battle = {
	id: number;
	slug: string;
	challenger_login: string;
	opponent_login: string | null;
	target: number;
	status: "pending" | "active" | "finished";
	winner_login: string | null;
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

async function getBattle(slug: string): Promise<Battle | null> {
	const result = await pool.query(
		`SELECT id, slug, challenger_login, opponent_login, target, status, winner_login
		 FROM battles
		 WHERE slug = $1`,
		[slug]
	);

	return result.rows[0] ?? null;
}

async function getWallet(login: string): Promise<number> {
	const result = await pool.query(`SELECT wallet FROM logins WHERE login = $1`, [login]);
	return result.rows[0]?.wallet ?? 0;
}

function computeProgress(currentWallet: number, target: number) {
	if (target <= 0)
		return 100;

	return Math.min(Math.max((currentWallet / target) * 100, 0), 100);
}

export default async function BattlePage({ params }: { params: Promise<{ slug: string }> }) {
	const currentLogin = await getCurrentLogin();
	if (!currentLogin)
		redirect("/auth");

	const { slug } = await params;
	const battle = await getBattle(slug);

	if (!battle) {
		notFound();
		return;
	}

	const isChallenger = currentLogin === battle.challenger_login;
	const isOpponent = currentLogin === battle.opponent_login;
	const canAccept = battle.status === "pending" && !isChallenger && !battle.opponent_login;

	const challengerWallet = await getWallet(battle.challenger_login);
	const opponentWallet = battle.opponent_login ? await getWallet(battle.opponent_login) : null;

	const challengerProgress = computeProgress(challengerWallet, battle.target);
	const opponentProgress = opponentWallet !== null
		? computeProgress(opponentWallet, battle.target)
		: 0;

	return (
		<div className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-[#0a0b10] via-[#0f0f1a] to-[#1a0f0f] text-white">
			<Header login={currentLogin} />

			<div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-red-500/10 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-orange-500/5 blur-3xl" />

			<main className="relative mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-10">
				<div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-linear-to-r from-red-500/5 to-orange-500/5 p-4 sm:p-5">
					<div
						className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-lg shadow-red-500/20"
						style={{ background: "linear-gradient(135deg, #DC2626, #991B1B)" }}
					>
						<Swords size={18} className="text-white" />
					</div>
					<div className="min-w-0">
						<h1 className="bg-linear-to-r from-[#DC2626] to-[#F97316] bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
							Wallet Battle
						</h1>
						<p className="text-xs text-white/40 sm:text-sm">Target: {battle.target.toLocaleString()} ₳</p>
					</div>
				</div>

				{battle.status === "pending" && !battle.opponent_login && (
					<div className="mt-6 rounded-2xl border border-white/5 bg-white/2 p-6 text-center">
						<p className="text-sm text-white/60">
							<span className="font-semibold text-white">@{battle.challenger_login}</span> challenged you to reach{" "}
							<span className="font-semibold text-white">{battle.target.toLocaleString()} ₳</span> first.
						</p>

						{canAccept ? (
							<AcceptButton slug={battle.slug} />
						) : (
							<p className="mt-4 text-xs text-white/30">Waiting for someone to accept this challenge.</p>
						)}
					</div>
				)}

				{(battle.status === "active" || battle.status === "finished") && battle.opponent_login && (
					<div className="mt-6 space-y-4">
						{battle.status === "finished" && battle.winner_login && (
							<div className="flex items-center justify-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/10 py-3 text-sm font-semibold text-amber-400">
								<Crown size={16} />
								@{battle.winner_login} won the battle!
							</div>
						)}

						<BattleSide
							login={battle.challenger_login}
							progress={challengerProgress}
							isYou={isChallenger}
							isWinner={battle.winner_login === battle.challenger_login}
						/>
						<BattleSide
							login={battle.opponent_login}
							progress={opponentProgress}
							isYou={isOpponent}
							isWinner={battle.winner_login === battle.opponent_login}
						/>
					</div>
				)}
			</main>
		</div>
	);
}

function BattleSide({ login, progress, isYou, isWinner }: { login: string; progress: number; isYou: boolean; isWinner: boolean }) {
	return (
		<div className={`rounded-2xl border p-5 ${isWinner ? "border-amber-500/30 bg-amber-500/5" : "border-white/5 bg-white/2"}`}>
			<div className="flex items-center justify-between">
				<span className="flex items-center gap-2 text-sm font-semibold text-white/90">
					{isWinner && <Crown size={14} className="text-amber-400" />}
					@{login}
					{isYou && <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-medium text-[#F87171]">You</span>}
				</span>
				<span className="text-sm font-bold text-white/70">{Math.round(progress)}%</span>
			</div>

			<div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/5">
				<div
					className="h-full rounded-full transition-all duration-700"
					style={{
						width: `${progress}%`,
						background: isWinner ? "linear-gradient(90deg, #FBBF24, #F59E0B)" : "linear-gradient(90deg, #DC2626, #F97316)",
					}}
				/>
			</div>
		</div>
	);
}

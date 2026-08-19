import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { pool } from "@/lib/db";
import { ShieldCheck, Flame, Target, Swords, Clock, CheckCircle, XCircle, Users } from "lucide-react";
import { Header } from "../components/header";
import AdminTabs from "./AdminTabs";

type LoginRow = {
	id: number;
	login: string;
	target: number;
	effective_streak: number;
	first_login_at: string;
	last_login_at: string;
};

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

async function getAllLogins(): Promise<LoginRow[]> {
	const result = await pool.query(
		`SELECT id, login, target, first_login_at, last_login_at,
		 CASE
			WHEN last_streak_date >= CURRENT_DATE - 1 THEN streak_count
			ELSE 0
		 END AS effective_streak
		 FROM logins
		 ORDER BY streak_count DESC, last_login_at DESC`
	);

	return result.rows;
}

async function getAllBattles(): Promise<BattleRow[]> {
	const result = await pool.query(
		`SELECT id, challenger_login, opponent_login, target, status, winner_login, 
		 created_at, accepted_at, finished_at, slug
		 FROM battles
		 ORDER BY created_at DESC`
	);

	return result.rows;
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

export default async function AdminPage() {
	const currentLogin = await getCurrentLogin();

	if (currentLogin !== "youbella")
		redirect("/dashboard");

	const logins = await getAllLogins();
	const battles = await getAllBattles();

	const loginsTable = (
		<div className="mt-4 overflow-hidden rounded-2xl border border-white/6 bg-linear-to-br from-white/2 to-red-500/2 backdrop-blur-sm">
			<div className="overflow-x-auto custom-scrollbar">
				<table className="w-full min-w-140 text-left text-sm">
					<thead>
						<tr className="border-b border-white/6 text-xs uppercase tracking-wider text-white/40">
							<th className="px-5 py-3 font-medium">Login</th>
							<th className="px-5 py-3 font-medium">Target</th>
							<th className="px-5 py-3 font-medium">Streak</th>
							<th className="px-5 py-3 font-medium">First login</th>
							<th className="px-5 py-3 font-medium">Last login</th>
						</tr>
					</thead>
					<tbody>
						{logins.map((row) => (
							<tr key={row.id} className="border-b border-white/4 transition-colors last:border-0 hover:bg-red-500/5">
								<td className="whitespace-nowrap px-5 py-3 font-medium">
									<a href={`https://profile.intra.42.fr/users/${row.login}`} target="_blank" className="flex items-center gap-2 text-white/90 hover:text-white">
										<Flame size={14} className="shrink-0 text-[#DC2626]" />
										@{row.login}
									</a>
								</td>
								<td className="whitespace-nowrap px-5 py-3">
									<span className="flex items-center gap-1.5 text-white/70">
										<Target size={14} className="shrink-0 text-[#F97316]" />
										{row.target.toLocaleString()} ₳
									</span>
								</td>
								<td className="whitespace-nowrap px-5 py-3">
									<span className="flex items-center gap-1.5 font-semibold text-orange-400">
										<Flame size={14} className="shrink-0" />
										{row.effective_streak}
									</span>
								</td>
								<td className="whitespace-nowrap px-5 py-3 text-white/50">{formatDate(row.first_login_at)}</td>
								<td className="whitespace-nowrap px-5 py-3 text-white/50">{formatDate(row.last_login_at)}</td>
							</tr>
						))}

						{logins.length === 0 && (
							<tr>
								<td colSpan={5} className="px-5 py-8 text-center text-white/30">
									No logins recorded yet.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);

	const battlesTable = (
		<div className="mt-4 overflow-hidden rounded-2xl border border-white/6 bg-linear-to-br from-white/2 to-red-500/2 backdrop-blur-sm">
			<div className="overflow-x-auto custom-scrollbar">
				<table className="w-full min-w-240 text-left text-sm">
					<thead>
						<tr className="border-b border-white/6 text-xs uppercase tracking-wider text-white/40">
							<th className="px-5 py-3 font-medium">Challenger</th>
							<th className="px-5 py-3 font-medium">Opponent</th>
							<th className="px-5 py-3 font-medium">Target</th>
							<th className="px-5 py-3 font-medium">Status</th>
							<th className="px-5 py-3 font-medium">Winner</th>
							<th className="px-5 py-3 font-medium">Created</th>
							<th className="px-5 py-3 font-medium">Finished</th>
							<th className="px-5 py-3 font-medium">Slug</th>
						</tr>
					</thead>
					<tbody>
						{battles.map((row) => {
							const statusInfo = getStatusBadge(row.status);
							const StatusIcon = statusInfo.icon;

							return (
								<tr key={row.id} className="border-b border-white/4 transition-colors last:border-0 hover:bg-red-500/5">
									<td className="whitespace-nowrap px-5 py-3 font-medium">
										<a href={`https://profile.intra.42.fr/users/${row.challenger_login}`} target="_blank" className="text-white/90 hover:text-white">
											@{row.challenger_login}
										</a>
									</td>
									<td className="whitespace-nowrap px-5 py-3">
										{row.opponent_login ? (
											<a href={`https://profile.intra.42.fr/users/${row.opponent_login}`} target="_blank" className="text-white/70 hover:text-white">
												@{row.opponent_login}
											</a>
										) : (
											<span className="text-white/30">—</span>
										)}
									</td>
									<td className="whitespace-nowrap px-5 py-3">
										<span className="flex items-center gap-1.5 text-white/70">
											<Target size={14} className="shrink-0 text-[#F97316]" />
											{row.target.toLocaleString()} ₳
										</span>
									</td>
									<td className="whitespace-nowrap px-5 py-3">
										<span
											className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
											style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}
										>
											<StatusIcon size={12} />
											{statusInfo.label}
										</span>
									</td>
									<td className="whitespace-nowrap px-5 py-3">
										{row.winner_login ? (
											<a href={`https://profile.intra.42.fr/users/${row.winner_login}`} target="_blank" className="font-semibold text-[#34D399] hover:text-[#6EE7B7]">
												@{row.winner_login}
											</a>
										) : (
											<span className="text-white/30">—</span>
										)}
									</td>
									<td className="whitespace-nowrap px-5 py-3 text-white/50">{formatDate(row.created_at)}</td>
									<td className="whitespace-nowrap px-5 py-3 text-white/50">
										{row.finished_at ? formatDate(row.finished_at) : <span className="text-white/30">—</span>}
									</td>
									<td className="whitespace-nowrap px-5 py-3">
										<a
											href={`/battle/${row.slug}`}
											target="_blank"
											className="text-[#60A5FA] hover:text-[#93C5FD] text-xs font-mono"
										>
											{row.slug}
										</a>
									</td>
								</tr>
							);
						})}

						{battles.length === 0 && (
							<tr>
								<td colSpan={8} className="px-5 py-8 text-center text-white/30">
									No battles created yet.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);

	return (
		<div className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-[#0a0b10] via-[#0f0f1a] to-[#1a0f0f] text-white">

			<Header login={currentLogin} />

			<div
				className="pointer-events-none absolute inset-0 opacity-[0.08]"
				style={{
					backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
					backgroundSize: "40px 40px",
				}}
			/>

			<div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-red-500/20 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

			<main className="relative mx-auto max-w-6xl sm:px-6 sm:py-10 py-8 px-4">
				<div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-linear-to-r from-red-500/5 to-orange-500/5 p-4">
					<div
						className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-lg shadow-red-500/20"
						style={{ background: "linear-gradient(135deg, #DC2626, #991B1B)" }}
					>
						<ShieldCheck size={18} className="text-white" />
					</div>
					<div className="min-w-0">
						<h1 className="bg-linear-to-r from-[#DC2626] to-[#F97316] bg-clip-text text-xl font-bold text-transparent">Admin</h1>
						<p className="truncate text-xs text-white/40">Signed in as @{currentLogin}</p>
					</div>
				</div>

				<AdminTabs
					logins={loginsTable}
					battles={battlesTable}
					loginsCount={logins.length}
					battlesCount={battles.length}
				/>
			</main>
		</div>
	);
}

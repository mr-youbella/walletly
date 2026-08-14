import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { pool } from "@/lib/db";
import { ShieldCheck, Flame, Target } from "lucide-react";
import { Header } from "../components/header";

type LoginRow = {
	id: number;
	login: string;
	target: number;
	first_login_at: string;
	last_login_at: string;
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
		`SELECT id, login, target, first_login_at, last_login_at
		 FROM logins
		 ORDER BY last_login_at DESC`
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

export default async function AdminPage() {
	const currentLogin = await getCurrentLogin();

	if (currentLogin !== "youbella")
		redirect("/dashboard");

	const logins = await getAllLogins();

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

			<main className="relative mx-auto max-w-4xl sm:px-6 sm:py-10 py-8 px-4">
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

				<div className="mt-8 flex items-center gap-2.5">
					<div className="h-4 w-1 rounded-full bg-linear-to-b from-[#DC2626] to-[#F97316]" />
					<h2 className="text-[17px] font-bold text-white/90">All logins ({logins.length})</h2>
				</div>

				<div className="mt-4 overflow-hidden rounded-2xl border border-white/6 bg-linear-to-br from-white/2 to-red-500/2 backdrop-blur-sm">
					<div className="overflow-x-auto">
						<table className="w-full min-w-140 text-left text-sm">
							<thead>
								<tr className="border-b border-white/6 text-xs uppercase tracking-wider text-white/40">
									<th className="px-5 py-3 font-medium">Login</th>
									<th className="px-5 py-3 font-medium">Target</th>
									<th className="px-5 py-3 font-medium">First login</th>
									<th className="px-5 py-3 font-medium">Last login</th>
								</tr>
							</thead>
							<tbody>
								{logins.map((row) => (
									<tr key={row.id} className="border-b border-white/4 transition-colors last:border-0 hover:bg-red-500/5">
										<td className="whitespace-nowrap px-5 py-3 font-medium">
											<a href={`https://profile.intra.42.fr/users/${row.login}`} target="_blank" className="flex items-center gap-2 text-white/90">
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
										<td className="whitespace-nowrap px-5 py-3 text-white/50">{formatDate(row.first_login_at)}</td>
										<td className="whitespace-nowrap px-5 py-3 text-white/50">{formatDate(row.last_login_at)}</td>
									</tr>
								))}

								{logins.length === 0 && (
									<tr>
										<td colSpan={4} className="px-5 py-8 text-center text-white/30">
											No logins recorded yet.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</main>
		</div>
	);
}

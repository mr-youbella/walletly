import { Wallet } from "lucide-react";

export default function Loading() {
	return (
		<div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-linear-to-br from-[#0a0b10] via-[#0f0f1a] to-[#1a0f0f] text-white">
			<div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-red-500/10 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-orange-500/5 blur-3xl" />

			<div className="relative flex flex-col items-center gap-4">
				<div className="relative flex h-14 w-14 items-center justify-center">
					<div
						className="absolute inset-0 animate-pulse rounded-2xl blur-xl opacity-60"
						style={{ background: "linear-gradient(135deg, #DC2626, #F97316)" }}
					/>
					<div
						className="relative flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl shadow-lg shadow-red-500/20"
						style={{ background: "linear-gradient(135deg, #DC2626, #991B1B, #7F1D1D)" }}
					>
						<Wallet size={24} className="text-white" />
					</div>
				</div>
				<p className="text-sm text-white/40">Loading your wallet...</p>
			</div>
		</div>
	);
}

import Link from "next/link";
import { Wallet, ArrowLeft } from "lucide-react";

export default function NotFound() {
	return (
		<div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-linear-to-br from-[#0a0b10] via-[#0f0f1a] to-[#1a0f0f] px-6 text-white">
			<div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-red-500/10 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-orange-500/5 blur-3xl" />

			<div className="relative flex flex-col items-center text-center">
				<div className="relative flex h-16 w-16 items-center justify-center">
					<div
						className="absolute inset-0 rounded-2xl blur-xl opacity-50"
						style={{ background: "linear-gradient(135deg, #DC2626, #F97316)" }}
					/>
					<div
						className="relative flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg shadow-red-500/20"
						style={{ background: "linear-gradient(135deg, #DC2626, #991B1B, #7F1D1D)" }}
					>
						<Wallet size={28} className="text-white" />
					</div>
				</div>

				<p className="mt-6 bg-linear-to-r from-[#DC2626] to-[#F97316] bg-clip-text text-6xl font-bold text-transparent">
					404
				</p>

				<h1 className="mt-2 text-xl font-bold">Page not found</h1>

				<p className="mt-2 max-w-sm text-sm text-white/40">
					The page you&apos;re looking for doesn&apos;t exist or has been moved.
				</p>

				<Link
					href="/"
					className="mt-8 flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-white/70 transition-all hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-400"
				>
					<ArrowLeft size={16} />
					Back to Walletly
				</Link>
			</div>
		</div>
	);
}

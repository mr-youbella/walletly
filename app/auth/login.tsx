"use client"
import { Wallet, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link";
import { useEffect, useState } from "react"

export default function LoginPage() {
	function handleLogin() {
		window.location.href = "/api/auth/42";
	}

	const [particles, setParticles] = useState<
		{
			width: number;
			height: number;
			top: number;
			left: number;
			duration: number;
			delay: number;
		}[]
	>([]);

	useEffect(() => {
		setParticles(
			Array.from({ length: 20 }, () => ({
				width: Math.random() * 4 + 2,
				height: Math.random() * 4 + 2,
				top: Math.random() * 100,
				left: Math.random() * 100,
				duration: Math.random() * 10 + 10,
				delay: Math.random() * 5,
			}))
		);
	}, []);

	return (
		<div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-linear-to-br from-[#0a0b10] via-[#0f0f1a] to-[#1a0f0f] px-6 text-white">

			<div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-red-500/20 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{particles.map((p, i) => (
					<div
						key={i}
						className="absolute rounded-full bg-red-500/10 animate-float"
						style={{
							width: `${p.width}px`,
							height: `${p.height}px`,
							top: `${p.top}%`,
							left: `${p.left}%`,
							animationDuration: `${p.duration}s`,
							animationDelay: `${p.delay}s`,
						}}
					/>
				))}
			</div>

			<div className="relative w-full max-w-md rounded-3xl border border-white/6 bg-linear-to-br from-white/3 to-red-500/3 p-10 text-center backdrop-blur-sm shadow-2xl shadow-red-500/5">
				<div className="absolute -inset-0.5 rounded-3xl bg-linear-to-r from-red-500/20 via-orange-500/20 to-red-500/20 blur-xl opacity-30" />

				<div className="relative">
					<div className="relative mx-auto flex h-20 w-20 items-center justify-center">
						<div
							className="absolute inset-0 rounded-2xl blur-2xl opacity-60 animate-pulse"
							style={{ background: "linear-gradient(135deg, #DC2626, #F97316)" }}
						/>
						<div
							className="relative flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg shadow-red-500/30"
							style={{ background: "linear-gradient(135deg, #DC2626, #991B1B, #7F1D1D)" }}
						>
							<Wallet size={32} strokeWidth={1.75} className="text-white" />
						</div>
					</div>

					<h1 className="mt-6 text-[28px] font-bold leading-tight bg-linear-to-r from-white to-white/80 bg-clip-text text-transparent">
						Walletly
					</h1>

					<p className="mt-3 text-[15px] leading-relaxed text-white/50">
						Track your progress towards your Wallet goal. Connect with your 42 account to get started.
					</p>

					<div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/30">
						<Sparkles size={12} className="text-red-400" />
						<span>Secure • Fast • Real-time</span>
						<Sparkles size={12} className="text-red-400" />
					</div>

					<button
						onClick={handleLogin}
						className="group relative mt-8 flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl px-6 py-4 text-[15px] font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px] shadow-red-500/25 cursor-pointer"
						style={{ background: "linear-gradient(135deg, #DC2626, #991B1B, #7F1D1D)" }}
					>
						<span className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
						<span className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

						<span className="relative flex items-center gap-3">
							<span className="rounded-md bg-black/30 px-2 py-0.5 text-sm font-extrabold text-white/90">42</span>
							Login with 42
							<ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
						</span>
					</button>

					<p className="mt-4 text-[11px] text-white/20">
						By continuing, you agree to our <Link href="/terms" className="underline cursor-pointer">Terms of Service</Link>
					</p>
				</div>
			</div>

			<style jsx>{`
				@keyframes float {
					0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
					50% { transform: translateY(-20px) scale(1.5); opacity: 0.8; }
				}
				.animate-float {
					animation: float infinite ease-in-out;
				}
			`}</style>
		</div>
	)
}

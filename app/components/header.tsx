"use client"
import { useState } from "react"
import { LogOut, ShieldIcon, Menu, X, LayoutDashboard, Trophy } from "lucide-react"
import Image from "next/image"
import Link from "next/link";

export function Header(props: { login: string }) {
	const login = props.login;
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	function logOut() {
		localStorage.clear();
		window.location.href = "/api/auth/logout";
	}

	const isAdmin = login.toLowerCase() === "youbella";

	return (
		<>
			<header className="relative flex items-center justify-between border-b border-white/5 px-4 py-4 backdrop-blur-sm bg-black/20 sm:px-8 sm:py-5">
				<Link href="/dashboard" className="flex items-center gap-3">
					<div className="flex h-9 w-9 items-center justify-center rounded-xl shadow-lg shadow-indigo-500/20">
						<Image
							src="/walletlyLogo.svg"
							alt="Walletly"
							width={36}
							height={36}
							className="h-full w-full object-contain ml-1"
						/>
					</div>
					<span className="text-[17px] font-bold bg-linear-to-r from-[#DC2626] to-[#F97316] bg-clip-text text-transparent">Walletly</span>
				</Link>

				<div className="hidden items-center gap-4 sm:flex">
					<Link href="/leaderboard" className="flex items-center gap-1.5 rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white/70 transition-all hover:border-amber-400/30 hover:bg-amber-500/10 hover:text-amber-400 cursor-pointer">
						<Trophy size={14} />
						Leaderboard
					</Link>
					{isAdmin && (
						<Link href="/admin" className="flex items-center gap-1.5 rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white/70 transition-all hover:border-yellow-400/30 hover:bg-yellow-500/10 hover:text-yellow-400 cursor-pointer">
							<ShieldIcon size={14} />
							Admin
						</Link>
					)}
					<button onClick={logOut} className="flex items-center gap-1.5 rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white/70 transition-all hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-400 cursor-pointer">
						<LogOut size={14} />
						Logout
					</button>
				</div>

				<button
					onClick={() => setIsMenuOpen(true)}
					className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-white/70 transition hover:border-white/20 hover:text-white sm:hidden"
					aria-label="Open menu"
				>
					<Menu size={18} />
				</button>
			</header>

			{isMenuOpen && (
				<div className="fixed inset-0 z-50 sm:hidden">
					<div
						className="absolute inset-0 bg-black/60 backdrop-blur-sm"
						onClick={() => setIsMenuOpen(false)}
					/>

					<div className="absolute right-0 top-0 flex h-full w-72 max-w-[80vw] flex-col border-l border-white/10 bg-[#1e0101] p-5">
						<div className="flex items-center justify-between">
							<div className="flex items-center justify-center gap-2">
								<Image
									src="/walletlyLogo.svg"
									alt="Walletly"
									width={28}
									height={28}
									className="h-7 w-7 object-contain"
								/>
								<span className="text-sm font-bold text-white/80">Menu</span>
							</div>
							<button
								onClick={() => setIsMenuOpen(false)}
								className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/5 hover:text-white"
								aria-label="Close menu"
							>
								<X size={18} />
							</button>
						</div>

						<nav className="mt-8 flex flex-col gap-1.5">
							<Link
								href="/dashboard"
								onClick={() => setIsMenuOpen(false)}
								className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
							>
								<LayoutDashboard size={16} />
								Dashboard
							</Link>

							<Link
								href="/leaderboard"
								onClick={() => setIsMenuOpen(false)}
								className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-amber-500/10 hover:text-amber-400"
							>
								<Trophy size={16} />
								Leaderboard
							</Link>

							{isAdmin && (
								<Link
									href="/admin"
									onClick={() => setIsMenuOpen(false)}
									className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-yellow-500/10 hover:text-yellow-400"
								>
									<ShieldIcon size={16} />
									Admin
								</Link>
							)}
						</nav>

						<div className="mt-auto">
							<button
								onClick={logOut}
								className="flex w-full items-center gap-3 rounded-xl border border-white/10 px-3 py-2.5 text-sm font-medium text-white/70 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-400"
							>
								<LogOut size={16} />
								Logout
							</button>
						</div>
					</div>
				</div >
			)
			}
		</>
	)
}

import { Target, LogOut, Sparkles } from "lucide-react"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import Image from "next/image"
import { Student } from "../types/types"
import { useRouter } from "next/navigation";

export function Header(props: {student: Student}) {
	const route = useRouter();
	const student = props.student;
	
	function logOut()
	{

		localStorage.clear();
		window.location.href = "/api/auth/logout";
	}

	return (
		<header className="relative flex items-center justify-between border-b border-white/5 px-8 py-5 backdrop-blur-sm bg-black/20">
			<div className="flex items-center gap-3">
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
			</div>

			<div className="flex items-center gap-4">
				<button onClick={logOut} className="flex items-center gap-1.5 rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white/70 transition-all hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-400 cursor-pointer">
					<LogOut size={14} />
					Logout
				</button>
			</div>
		</header>
	)
}

export function WelcomeBanner(props: {student: Student}) {

	const student = props.student;

	return (
		<div className="flex items-center gap-4 p-4 rounded-2xl bg-linear-to-r from-red-500/5 to-orange-500/5 border border-white/5">
			<div className="ring-4 ring-red-500/20 rounded-2xl">
				<img
					src={student.avatarUrl}
					alt={student.fullName}
					className="h-16 w-16 rounded-2xl border border-white/10 object-cover"
				/>
			</div>
			<div>
				<h1 className="text-[26px] font-bold">
					Welcome back, {student.fullName.split(" ")[0]} <span aria-hidden="true">👋</span>
				</h1>
				<p className="text-sm text-white/40">@{student.login} · {student.campus}</p>
			</div>
		</div>
	)
}

export function StatCard({ label, value, unit, icon, iconColor, barColor }: { label: string; value: string; unit: string; icon: React.ReactNode; iconColor: string; barColor: string }) {
	return (
		<div className="group rounded-2xl border border-white/5 bg-white/2 p-6 transition-all hover:border-white/10 hover:bg-white/4">
			<div className="flex items-start justify-between">
				<p className="text-xs font-semibold uppercase tracking-wider text-white/40">{label}</p>
				<div
					className="flex h-9 w-9 items-center justify-center rounded-full transition-all group-hover:scale-110"
					style={{ backgroundColor: `${iconColor}20`, color: iconColor }}
				>
					{icon}
				</div>
			</div>
			<p className="mt-3 text-[34px] font-bold leading-none">
				{value} <span className="text-lg font-semibold" style={{ color: barColor }}>{unit}</span>
			</p>
			<div className="mt-5 h-0.75 w-full rounded-full transition-all group-hover:opacity-100" style={{ backgroundColor: barColor, opacity: 0.5 }} />
		</div>
	)
}

export function GoalInputCard({ value, onChange }: { value: string; onChange: (v: string) => void }) {
	return (
		<div className="group rounded-2xl border border-white/5 bg-linear-to-br from-red-500/5 to-transparent p-6 transition-all hover:border-red-500/20">
			<div className="flex items-start justify-between">
				<p className="text-xs font-semibold uppercase tracking-wider text-white/40">Wallet goal</p>
				<div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/15 text-[#F87171]">
					<Target size={16} />
				</div>
			</div>
			<div className="mt-3 flex items-baseline gap-2 rounded-xl bg-black/40 px-4 py-2 border border-white/5 focus-within:border-red-500/30 transition-all">
				<input
					value={value}
					onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
					inputMode="numeric"
					className="w-full bg-transparent text-[28px] font-bold outline-none text-white"
				/>
				<span className="text-lg font-semibold text-[#F87171]">₳</span>
			</div>
			<div className="mt-5 h-0.75 w-full rounded-full bg-linear-to-r from-[#DC2626] to-[#F97316]" />
		</div>
	)
}

export function ResultCard({ label, value, unit, icon, iconColor, iconBg, barColor }: { label: string; value: string; unit: string; icon: React.ReactNode; iconColor: string; iconBg: string; barColor: string }) {
	return (
		<div className="group rounded-2xl border border-white/5 bg-white/2 p-6 transition-all hover:border-white/10 hover:bg-white/4">
			<div className="flex items-start justify-between">
				<p className="text-xs font-semibold uppercase tracking-wider text-white/40">{label}</p>
				<div className="flex h-9 w-9 items-center justify-center rounded-full transition-all group-hover:scale-110" style={{ backgroundColor: iconBg, color: iconColor }}>
					{icon}
				</div>
			</div>
			<p className="mt-3 text-[34px] font-bold leading-none">
				{value} <span className="text-lg font-semibold" style={{ color: barColor }}>{unit}</span>
			</p>
			<div className="mt-5 h-0.75 w-full rounded-full" style={{ backgroundColor: barColor, opacity: 0.5 }} />
		</div>
	)
}

export function ProgressRing({ progress, current, target }: { progress: number; current: number; target: number }) {
	return (
		<div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/2 p-6 transition-all hover:border-white/10">
			<svg width="0" height="0">
				<defs>
					<linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor="#DC2626" />
						<stop offset="50%" stopColor="#F97316" />
						<stop offset="100%" stopColor="#FB923C" />
					</linearGradient>
				</defs>
			</svg>

			<div className="h-33 w-33">
				<CircularProgressbar
					value={progress}
					text={`${Math.round(progress)}%`}
					styles={buildStyles({
						pathColor: "url(#ringGradient)",
						trailColor: "rgba(255,255,255,0.06)",
						textColor: "#ffffff",
						textSize: "18px",
						pathTransitionDuration: 0.8,
					})}
				/>
			</div>

			<p className="mt-2 text-xs text-white/40">
				{current.toLocaleString()} / {target.toLocaleString()} ₳
			</p>
		</div>
	)
}

export function WalletProgressBar({ current, target, progress }: { current: number; target: number; progress: number }) {
	return (
		<div className="mt-6 rounded-2xl border border-white/5 bg-linear-to-br from-red-500/3 to-orange-500/3 p-6 transition-all hover:border-red-500/20">
			<div className="flex items-center justify-between">
				<h3 className="text-[15px] font-bold text-white/90">Wallet progress</h3>
				<span className="rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white/60 border border-white/5">
					{current.toLocaleString()} / {target.toLocaleString()} ₳
				</span>
			</div>

			<div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-white/5">
				<div
					className="h-3 rounded-full transition-all duration-700 relative"
					style={{
						width: `${progress}%`,
						background: "linear-gradient(90deg, #DC2626, #F97316, #FB923C)",
						boxShadow: "0 0 20px rgba(220, 38, 38, 0.3)"
					}}
				/>
			</div>

			<div className="mt-2.5 flex justify-between text-xs">
				<span className="text-white/30">0 ₳</span>
				<span className="font-semibold text-[#F87171]">{Math.round(progress)}% achieved</span>
				<span className="text-white/30">{target.toLocaleString()} ₳</span>
			</div>
		</div>
	)
}

export function ConversionNote({ neededEvaluations, remaining, target }: { neededEvaluations: number; remaining: number, target: number }) {
	return (
		<div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-500/10 bg-linear-to-r from-red-500/5 to-orange-500/5 px-4 py-3.5 sm:px-5 sm:py-4">
			<Sparkles size={16} className="mt-0.5 shrink-0 text-[#F87171]" />
			<p className="text-[13px] leading-relaxed text-white/60 sm:text-sm">
				You need <strong className="font-semibold text-[#F87171]">{neededEvaluations} evaluations</strong> to earn{" "}
				<strong className="font-semibold text-white">{remaining.toLocaleString()} ₳</strong> more and reach your goal of{" "}
				<strong className="font-semibold text-white">{target} ₳</strong>. Each evaluation converts to{" "}
				<span className="font-semibold text-[#F97316]">5 ₳</span>.
			</p>
		</div>
	)
}

export function FooterStats({ progress, remaining, neededEvaluations }: { progress: number; remaining: number; neededEvaluations: number }) {
	return (
		<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
			<div className="group rounded-xl border border-white/5 bg-white/2 py-4 text-center transition-all hover:border-red-500/20 hover:bg-red-500/5">
				<p className="text-lg font-bold bg-linear-to-r from-[#DC2626] to-[#F97316] bg-clip-text text-transparent">{Math.round(progress)}%</p>
				<p className="text-xs text-white/40">Done</p>
			</div>
			<div className="group rounded-xl border border-white/5 bg-white/2 py-4 text-center transition-all hover:border-orange-500/20 hover:bg-orange-500/5">
				<p className="text-lg font-bold text-[#FB923C]">{remaining.toLocaleString()} ₳</p>
				<p className="text-xs text-white/40">Remaining</p>
			</div>
			<div className="group rounded-xl border border-white/5 bg-white/2 py-4 text-center transition-all hover:border-pink-500/20 hover:bg-pink-500/5">
				<p className="text-lg font-bold text-[#F472B6]">{neededEvaluations}</p>
				<p className="text-xs text-white/40">Evals needed</p>
			</div>
		</div>
	)
}

"use client"
import { useEffect, useMemo, useState } from "react"
import { Wallet, Star, TrendingUp, Zap, Calculator, ChevronRight } from "lucide-react"
import { Student } from "./types/types"
import { ConversionNote, FooterStats, GoalInputCard, Header, ProgressRing, ResultCard, StatCard, WalletProgressBar, WelcomeBanner } from "./components/components"
import { useRouter } from "next/navigation"

const CONVERSION_RATE = 5

function computeGoal(current: number, target: number) {
	const remaining = Math.max(target - current, 0)
	const neededEvaluations = Math.ceil(remaining / CONVERSION_RATE)
	const progress = target > 0 ? Math.min((current / target) * 100, 100) : 100

	return { remaining, neededEvaluations, progress }
}

export default function WalletDashboard() {
	const route = useRouter();
	const [student, setStudent] = useState<Student>({ login: "loading...", fullName: "loading...", avatarUrl: "https://image.winudf.com/v2/image1/Y29tLmxpbmtrYWRlci5pbnRyYTQyX2ljb25fMTY3MzMzNzI4Ml8wOTQ/icon.png?w=280&fakeurl=1", campus: "42 the network", wallet: 0, evaluationPoints: 0,});
	const [targetInput, setTargetInput] = useState("0");

	useEffect(() => {
		async function loadStudent() {
			try {
				const response = await fetch("/api/auth/42/student");

				if (!response.ok) {
					console.error("Failed to fetch student:", response.status);
					route.replace("/auth");
					return;
				}

				const data: Student = await response.json();
				setStudent(data);
			}
			catch (error) {
				console.error("Failed to fetch student:", error);
				route.replace("/auth");
			}
		}

		loadStudent();
	}, []);
	useEffect(() => {
		const savedTarget = localStorage.getItem("walletly_target");

		if (savedTarget) {
			setTarget(Number(savedTarget));
			setTargetInput(savedTarget);
		}
	}, []);

	const [target, setTarget] = useState(Number(targetInput.replace(/[^0-9]/g, "")) || 0);

	function changeTarget() {
		const numericTarget = Number(targetInput.replace(/[^0-9]/g, "")) || 0;
		setTarget(numericTarget);
		localStorage.setItem("walletly_target", numericTarget.toString());
	}

	const { remaining, neededEvaluations, progress } = useMemo(() => computeGoal(student.wallet, target), [target, student]);

	return (
		<div className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-[#0a0b10] via-[#0f0f1a] to-[#1a0f0f] text-white">

			<div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-red-500/10 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-orange-500/5 blur-3xl" />

			<Header student={student} />

			<main className="relative mx-auto max-w-6xl px-6 py-10">
				<WelcomeBanner student={student} />

				<div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
					<StatCard
						label="Current wallet"
						value={student.wallet.toLocaleString()}
						unit="₳"
						icon={<Wallet size={16} />}
						iconColor="#F87171"
						barColor="#EF4444"
					/>
					<StatCard
						label="Evaluation points"
						value={student.evaluationPoints.toLocaleString()}
						unit="pts"
						icon={<Star size={16} />}
						iconColor="#FB923C"
						barColor="#F97316"
					/>
					<GoalInputCard value={targetInput} onChange={setTargetInput} />
				</div>

				<div className="mt-8 flex justify-center">
					<button
						className="group relative flex items-center gap-2 overflow-hidden rounded-2xl px-9 py-4 text-[15px] font-bold text-white transition-all hover:scale-105 active:scale-[0.98] cursor-pointer"
						style={{ background: "linear-gradient(135deg, #DC2626, #991B1B, #7F1D1D)" }}
						onClick={changeTarget}
					>
						<span className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
						<Calculator size={18} />
						Calculate goal
						<ChevronRight size={18} />
					</button>
				</div>

				<div className="mt-10 flex items-center gap-2.5">
					<div className="h-5 w-1 rounded-full bg-linear-to-b from-[#DC2626] to-[#F97316]" />
					<h2 className="text-[17px] font-bold bg-linear-to-r from-[#DC2626] to-[#F97316] bg-clip-text text-transparent">Calculation results</h2>
				</div>

				<div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-3">
					<ResultCard
						label="Remaining wallet"
						value={remaining.toLocaleString()}
						unit="₳"
						icon={<TrendingUp size={16} />}
						iconColor="#FB923C"
						iconBg="rgba(251,146,60,0.15)"
						barColor="#FB923C"
					/>
					<ResultCard
						label="Needed evaluations"
						value={neededEvaluations.toLocaleString()}
						unit="evals"
						icon={<Zap size={16} />}
						iconColor="#F472B6"
						iconBg="rgba(244,114,182,0.15)"
						barColor="#EC4899"
					/>
					<ProgressRing progress={progress} current={student.wallet} target={target} />
				</div>

				<WalletProgressBar current={student.wallet} target={target} progress={progress} />

				<ConversionNote neededEvaluations={neededEvaluations} remaining={remaining} target={target} />

				<FooterStats progress={progress} remaining={remaining} neededEvaluations={neededEvaluations} />
			</main>
		</div>
	)
}

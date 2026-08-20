"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Swords, Copy, Check } from "lucide-react"

export default function ChallengeButton() {
	const [isLoading, setIsLoading] = useState(false);
	const [shareLink, setShareLink] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);
	const [target, setTarget] = useState<number>(0);
	const [currentWallet, setCurrentWallet] = useState<number>(0);
	const [isLoadingData, setIsLoadingData] = useState(true);
	const router = useRouter();

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch("/api/user/data");
				if (!response.ok) {
					throw new Error("Failed to fetch user data");
				}
				const data = await response.json();
				setTarget(data.target);
				setCurrentWallet(data.wallet);
			} catch (error) {
				console.error("Error fetching user data:", error);
			} finally {
				setIsLoadingData(false);
			}
		}
		fetchData();
	}, []);

	async function handleChallenge() {
		if (target <= 0)
			return;

		setIsLoading(true);

		try {
			const response = await fetch("/api/battles", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ target, currentWallet }),
			});

			if (!response.ok) {
				setIsLoading(false);
				return;
			}

			const data = await response.json();
			setShareLink(`${window.location.origin}/battle/${data.slug}`);

			router.refresh();
		}
		catch (error) {
			console.error("Failed to create battle:", error);
		}
		finally {
			setIsLoading(false);
		}
	}

	async function handleCopy() {
		if (!shareLink)
			return;

		await navigator.clipboard.writeText(shareLink);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	if (isLoadingData) {
		return (
			<button
				disabled
				className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 sm:px-6 py-3 sm:py-4 h-13 sm:h-14 text-sm sm:text-[15px] font-semibold text-white/30 transition-all cursor-not-allowed"
			>
				<div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-transparent" />
				Loading...
			</button>
		);
	}

	if (shareLink) {
		return (
			<div className="flex w-full items-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 h-13 sm:h-14">
				<span className="flex-1 truncate text-xs text-white/60">{shareLink}</span>
				<button
					onClick={handleCopy}
					className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
				>
					{copied ? <Check size={14} /> : <Copy size={14} />}
					{copied ? "Copied" : "Copy"}
				</button>
			</div>
		);
	}

	return (
		<button
			onClick={handleChallenge}
			disabled={target <= 0}
			className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 sm:px-6 py-3 sm:py-4 h-13 sm:h-14 text-sm sm:text-[15px] font-semibold text-white/70 transition-all hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
		>
			<Swords size={16} className="sm:size-4.5" />
			{isLoading ? "Creating..." : "Challenge a friend"}
		</button>
	);
}

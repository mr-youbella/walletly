"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Swords } from "lucide-react"

export default function AcceptButton({ slug }: { slug: string }) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleAccept() {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(`/api/battles/${slug}/accept`, {
				method: "POST",
			});

			if (!response.ok) {
				const data = await response.json();
				setError(data.error ?? "Failed to accept challenge");
				setIsLoading(false);
				return;
			}

			router.refresh();
		}
		catch (error) {
			console.error("Failed to accept battle:", error);
			setError("Something went wrong");
			setIsLoading(false);
		}
	}

	return (
		<div className="mt-4">
			<button
				onClick={handleAccept}
				disabled={isLoading}
				className="flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
				style={{ background: "linear-gradient(135deg, #DC2626, #991B1B, #7F1D1D)" }}
			>
				<Swords size={16} />
				{isLoading ? "Accepting..." : "Accept Challenge"}
			</button>

			{error && <p className="mt-2 text-xs text-red-400">{error}</p>}
		</div>
	);
}

"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Eye, X, AlertTriangle } from "lucide-react"

export default function BattleActions({
	battleId,
	slug,
	status,
	isChallenger,
	userLogin,
	deleteAction,
}: {
	battleId: number;
	slug: string;
	status: string;
	isChallenger: boolean;
	userLogin: string;
	deleteAction: (battleId: number, userLogin: string) => Promise<void>;
}) {
	const [isLoading, setIsLoading] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [deleteError, setDeleteError] = useState<string | null>(null);
	const router = useRouter();

	const handleDelete = async () => {
		setIsLoading(true);
		setDeleteError(null);
		try {
			await deleteAction(battleId, userLogin);
			setShowDeleteModal(false);
			router.refresh();
		} catch (error) {
			console.error("Error deleting battle:", error);
			setDeleteError(error instanceof Error ? error.message : "Failed to delete battle");
		} finally {
			setIsLoading(false);
		}
	};

	const handleView = () => {
		window.location.href = `/battle/${slug}`;
	};

	return (
		<>
			<div className="flex items-center gap-1.5">
				<button
					onClick={handleView}
					className="rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white/60 transition hover:bg-white/20 hover:text-white cursor-pointer"
					title="View battle"
				>
					<Eye size={14} />
				</button>

				{isChallenger && (status === 'pending' || status === 'accepted') && (
					<button
						onClick={() => setShowDeleteModal(true)}
						className="rounded-lg bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/20 hover:text-red-300 cursor-pointer"
						title="Delete battle"
					>
						<Trash2 size={14} />
					</button>
				)}
			</div>

			{showDeleteModal && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
					onClick={() => setShowDeleteModal(false)}
				>
					<div
						className="relative w-full max-w-md rounded-2xl border border-red-500/20 bg-linear-to-br from-[#1a0f0f] to-[#0a0b10] p-6 shadow-2xl shadow-red-500/10 animate-in zoom-in-95 duration-200"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							onClick={() => setShowDeleteModal(false)}
							className="absolute right-4 top-4 rounded-lg p-1 text-white/30 transition hover:bg-white/10 hover:text-white cursor-pointer"
						>
							<X size={18} />
						</button>

						<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/15 mx-auto">
							<AlertTriangle size={32} className="text-red-500" />
						</div>

						<h3 className="mb-2 text-center text-xl font-bold text-white">
							Delete Battle?
						</h3>

						<p className="mb-6 text-center text-sm text-white/50">
							Are you sure you want to delete this battle? This action cannot be undone and all battle data will be permanently removed.
						</p>

						{deleteError && (
							<div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
								{deleteError}
							</div>
						)}

						<div className="flex gap-3">
							<button
								onClick={() => setShowDeleteModal(false)}
								className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white cursor-pointer"
								disabled={isLoading}
							>
								Cancel
							</button>
							<button
								onClick={handleDelete}
								disabled={isLoading}
								className="flex-1 rounded-xl bg-linear-to-r from-red-600 to-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
							>
								{isLoading ? (
									<>
										<svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
										</svg>
										Deleting...
									</>
								) : (
									<>
										<Trash2 size={16} />
										Delete Battle
									</>
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

"use client"
import { useState } from "react"
import { Users, Swords } from "lucide-react"

export default function AdminTabs({  logins, battles, loginsCount, battlesCount}: { logins: React.ReactNode; battles: React.ReactNode; loginsCount: number; battlesCount: number;}) {
	const [activeTab, setActiveTab] = useState<"logins" | "battles">("logins");

	return (
		<>
			<div className="mt-8 flex gap-2 border-b border-white/6 overflow-x-auto">
				<button
					className={`group flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all border-b-2 hover:text-white whitespace-nowrap cursor-pointer ${
						activeTab === "logins" 
							? "border-[#DC2626] text-white" 
							: "border-transparent text-white/50"
					}`}
					onClick={() => setActiveTab("logins")}
				>
					<Users size={16} />
					Logins
					<span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{loginsCount}</span>
				</button>
				<button
					className={`group flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all border-b-2 hover:text-white whitespace-nowrap cursor-pointer ${
						activeTab === "battles" 
							? "border-[#DC2626] text-white" 
							: "border-transparent text-white/50"
					}`}
					onClick={() => setActiveTab("battles")}
				>
					<Swords size={16} />
					Battles
					<span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{battlesCount}</span>
				</button>
			</div>

			<div className={activeTab === "logins" ? "block" : "hidden"}>
				{logins}
			</div>
			<div className={activeTab === "battles" ? "block" : "hidden"}>
				{battles}
			</div>
		</>
	);
}

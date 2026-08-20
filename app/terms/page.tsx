import Link from "next/link";
import { Wallet, ArrowLeft } from "lucide-react";

export const metadata =
{
	title: "Terms of Service",
};

export default function TermsPage() {
	return (
		<div className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-[#0a0b10] via-[#0f0f1a] to-[#1a0f0f] px-6 py-16 text-white">

			<div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-red-500/20 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

			<div className="mx-auto max-w-2xl">
				<Link
					href="/"
					className="mb-8 flex w-fit items-center gap-2 text-sm text-white/40 transition hover:text-white/70"
				>
					<ArrowLeft size={16} />
					Back to Walletly
				</Link>

				<div className="mb-10 flex items-center gap-3">
					<div
						className="flex h-9 w-9 items-center justify-center rounded-xl"
						style={{ background: "linear-gradient(135deg, #4a0000 0%, #c1121f 100%)" }}
					>
						<Wallet size={18} />
					</div>
					<h1 className="text-2xl font-bold">Terms of Service</h1>
				</div>

				<p className="text-sm text-white/40">Last updated: August 14, 2026</p>

				<div className="mt-8 space-y-8 text-sm leading-relaxed text-white/60">
					<section>
						<h2 className="mb-2 text-base font-semibold text-white">1. About Walletly</h2>
						<p>
							Walletly is an independent, unofficial tool built by a 42 student for 42 students.
							It is not affiliated with, endorsed by, or operated by 42 Network or École 42.
							It helps you track your Wallet points and calculate how many evaluations
							you need to reach a goal.
						</p>
					</section>

					<section>
						<h2 className="mb-2 text-base font-semibold text-white">2. 42 Account Access</h2>
						<p>
							Walletly uses 42&apos;s official OAuth login to read your public profile data
							(name, login, campus, Wallet points, and evaluation points). We never see or
							store your 42 password. You can revoke access at any time from your 42 Intra
							account settings.
						</p>
					</section>

					<section>
						<h2 className="mb-2 text-base font-semibold text-white">3. Data We Store</h2>
						<p>
							Your session token is stored in a secure, httpOnly cookie and used only to
							fetch your profile from the 42 API. We also store your 42 login, the date
							of your first and most recent sign-in, your daily login streak, and your
							Wallet goal in our database to keep your progress synced across devices.
							We never store your 42 password, and this data is only used to power your
							Walletly experience — never sold or shared with third parties.
						</p>
					</section>

					<section>
						<h2 className="mb-2 text-base font-semibold text-white">4. Leaderboard</h2>
						<p>
							Walletly includes a leaderboard that shows your 42 login and Wallet points
							to other signed-in students, ranked from highest to lowest. This is meant to
							be a light, friendly way to see how you compare with peers. The Wallet value
							shown reflects your balance at your most recent sign-in, not necessarily your
							current balance. If you&apos;d rather not appear on the leaderboard, contact
							the developer to have your entry excluded.
						</p>
					</section>

					<section>
						<h2 className="mb-2 text-base font-semibold text-white">5. Wallet Battle</h2>
						<p>
							Walletly lets you challenge another student to a friendly race toward a
							shared Wallet goal. When you or your opponent open a battle page, Walletly
							checks both participants&apos; current Wallet balance directly from the 42
							API (using application-level access, not your personal login) to update
							progress and determine a winner. By starting or accepting a battle, you
							agree that your 42 login and Wallet progress will be visible to the other
							participant in that battle.
						</p>
					</section>

					<section>
						<h2 className="mb-2 text-base font-semibold text-white">6. No Warranty</h2>
						<p>
							Walletly is provided &quot;as is,&quot; with no guarantee of accuracy. Wallet
							and evaluation figures are pulled directly from the 42 API and may not always
							reflect real-time changes. Always verify important decisions against your
							official 42 Intra dashboard.
						</p>
					</section>

					<section>
						<h2 className="mb-2 text-base font-semibold text-white">7. Changes</h2>
						<p>
							These terms may be updated as the project evolves. Continued use of Walletly
							after changes means you accept the updated terms.
						</p>
					</section>

					<section>
						<h2 className="mb-2 text-base font-semibold text-white">8. Contact</h2>
						<p>
							Do you have any questions or concerns about Walletly? Contact the developer via <a href="https://discordapp.com/users/518135329509605380" target="_blank" className="text-[#5865f2] cursor-pointer">Discord</a>.
						</p>
					</section>
				</div>
			</div>
		</div>
	);
}

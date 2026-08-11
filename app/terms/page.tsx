import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export const metadata =
{
	title: "Terms of Service",
};

export default function TermsPage() {
	return (
		<div className="relative min-h-screen w-full bg-[#0a0b10] px-6 py-16 text-white">
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
					>
						<Image
							src="/walletlyLogo.svg"
							alt="Walletly"
							width={36}
							height={36}
							className="h-full w-full object-contain ml-1"
						/>
					</div>
					<h1 className="text-2xl font-bold">Terms of Service</h1>
				</div>

				<p className="text-sm text-white/40">Last updated: August 11, 2026</p>

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
							of your first and most recent sign-in, and your Wallet goal in our database
							to keep your progress synced across devices. We never store your 42 password,
							and this data is only used to power your Walletly experience — never sold
							or shared with third parties.
						</p>
					</section>

					<section>
						<h2 className="mb-2 text-base font-semibold text-white">4. No Warranty</h2>
						<p>
							Walletly is provided &quot;as is,&quot; with no guarantee of accuracy. Wallet
							and evaluation figures are pulled directly from the 42 API and may not always
							reflect real-time changes. Always verify important decisions against your
							official 42 Intra dashboard.
						</p>
					</section>

					<section>
						<h2 className="mb-2 text-base font-semibold text-white">5. Changes</h2>
						<p>
							These terms may be updated as the project evolves. Continued use of Walletly
							after changes means you accept the updated terms.
						</p>
					</section>

					<section>
						<h2 className="mb-2 text-base font-semibold text-white">6. Contact</h2>
						<p>
							Questions or concerns about Walletly? Reach out to the developer through your
							42 campus or the project&apos;s repository.
						</p>
					</section>
				</div>
			</div>
		</div>
	);
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata =
{
	title:
	{
		default: "Walletly — 42 Wallet Tracker",
		template: "%s | Walletly",
	},
	description: "Track your 42 Network wallet, set your goal, and see exactly how many evaluations you need to reach it.",
	keywords: ["42 network", "wallet tracker", "evaluation points", "42 school", "student dashboard"],
	authors: [{ name: "Youbella" }],
	creator: "Youbella",

	metadataBase: new URL("https://42walletly.vercel.app"),

	icons:
	{
		icon: "/walletlyLogo.png",
		shortcut: "/walletlyLogo.png",
		apple: "/walletlyLogo.png",
	},

	openGraph:
	{
		title: "Walletly — 42 Wallet Tracker",
		description: "Track your 42 Network wallet, set your goal, and see exactly how many evaluations you need to reach it.",
		url: "https://42walletly.vercel.app",
		siteName: "Walletly",
		locale: "en_US",
		type: "website",
		images:
			[
				{
					url: "/walletlyLogo.png",
					width: 1200,
					height: 630,
					alt: "Walletly — 42 Wallet Tracker",
				},
			],
	},

	twitter:
	{
		card: "summary_large_image",
		title: "Walletly — 42 Wallet Tracker",
		description: "Track your 42 Network wallet and hit your goal.",
		images: ["/walletlyLogo.png"],
	},

	robots:
	{
		index: true,
		follow: true,
	},

	verification: {
		google: "8VJj_lYQ8yYu5w17PlC0kjwr471JajcMJqhqzxZL15w",
	},
}

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
			<body>{children}</body>
		</html>
	);
}

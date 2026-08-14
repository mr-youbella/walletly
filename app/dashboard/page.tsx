import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { pool } from "../../lib/db";
import { Student } from "../../lib/types/types";
import WalletDashboardClient from "./dashboard";

async function getStudentAndTarget(): Promise<{ student: Student; target: number; streak: number } | null> {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("access_token")?.value;

	if (!accessToken)
		return null;

	const meResponse = await fetch("https://api.intra.42.fr/v2/me", {
		headers: { Authorization: `Bearer ${accessToken}` },
	});

	if (!meResponse.ok)
		return null;

	const me = await meResponse.json();

	const student: Student = {
		login: me.login,
		fullName: me.usual_full_name ?? me.displayname,
		avatarUrl: me.image?.link ?? "",
		campus: me.campus?.[0]?.name ?? "42",
		wallet: me.wallet,
		evaluationPoints: me.correction_point,
	};

	let target = 0;
	let streak = 0;

	try {
		const result = await pool.query(
			`SELECT target, streak_count FROM logins WHERE login = $1`,
			[me.login]
		);

		target = result.rows[0]?.target ?? 0;
		streak = result.rows[0]?.streak_count ?? 0;
	}
	catch (error) {
		console.error("Failed to fetch target/streak:", error);
	}

	return { student, target, streak };
}

export default async function DashboardPage() {
	const data = await getStudentAndTarget();

	if (!data)
		redirect("/auth");

	return <WalletDashboardClient initialStudent={data.student} initialTarget={data.target} streak={data.streak} />;
}

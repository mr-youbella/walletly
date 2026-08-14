import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { pool } from "@/lib/db";
import WalletDashboard from "./dashboard";

async function getStudentAndTarget() {
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

	const student = {
		login: me.login,
		fullName: me.usual_full_name ?? me.displayname,
		avatarUrl: me.image.link ?? "",
		campus: me.campus?.[0]?.name ?? "42",
		wallet: me.wallet,
		evaluationPoints: me.correction_point,
	};

	const targetResult = await pool.query(
		`SELECT target FROM logins WHERE login = $1`,
		[me.login]
	);

	const target = targetResult.rows[0]?.target ?? 0;

	return { student, target };
}

export default async function DashboardPage() {
	const data = await getStudentAndTarget();

	if (!data)
		redirect("/auth");

	return <WalletDashboard initialStudent={data.student} initialTarget={data.target} />;
}

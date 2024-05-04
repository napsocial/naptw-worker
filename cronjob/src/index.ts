export interface Env {
	DB: D1Database
}

// TODO: Make records table
// interface AnalysisRecord {
// 	short_link: string,
// 	timestamp: Date,
// 	user_agent: string,
// 	access_ip: string,
// 	country_code: string
// }

export default {
	async scheduled(event: ScheduledEvent, env: Env): Promise<void> {
		// Remove all expired records
		await Promise.all([
			env.DB.exec("DELETE FROM links WHERE expire_at <= CURRENT_TIMESTAMP"),
			env.DB.exec("DELETE FROM private_short_link WHERE expire_at <= CURRENT_TIMESTAMP")
		]);
	},
};

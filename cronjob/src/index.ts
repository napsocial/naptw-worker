export interface Env {
	DB: D1Database
}

export default {
	async scheduled(event: ScheduledEvent, env: Env): Promise<void> {
		await env.DB.exec("DELETE FROM links WHERE expire_at <= CURRENT_TIMESTAMP");
		await env.DB.exec("DELETE FROM private_short_link WHERE expire_at <= CURRENT_TIMESTAMP");
	},
};

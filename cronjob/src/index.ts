export interface Env {
	DB: D1Database
}

export default {
	async scheduled(event: ScheduledEvent, env: Env, _ctx: ExecutionContext): Promise<void> {
		env.DB.exec("DELETE FROM links WHERE expire_at IS NOT NULL AND expire_at < CURRENT_TIMESTAMP");
		env.DB.exec("DELETE FROM private_short_link WHERE expire_at < CURRENT_TIMESTAMP");
	},
};

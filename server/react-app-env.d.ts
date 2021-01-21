declare namespace NodeJS {
	interface ProcessEnv {
		NODE_ENV: "development" | "production" | "test";
		ORIGIN_URL: string;
		SPOTIFY_REDIRECT_URL: string;
	}
}

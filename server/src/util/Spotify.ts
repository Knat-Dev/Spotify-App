import SpotifyWebApi from "spotify-web-api-node";

const credentials = {
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
	redirectUri: "http://localhost:3000/login",
};
const spotifyApi = new SpotifyWebApi(credentials);
export default spotifyApi;

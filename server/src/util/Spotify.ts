import SpotifyWebApi from "spotify-web-api-node";
console.log(process.env.SPOTIFY_REDIRECT_URL);
const credentials = {
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
	redirectUri: process.env.SPOTIFY_REDIRECT_URL,
};
const spotifyApi = new SpotifyWebApi(credentials);
export default spotifyApi;

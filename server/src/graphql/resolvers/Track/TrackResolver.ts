import {
	Arg,
	Ctx,
	FieldResolver,
	Query,
	Resolver,
	Root,
	Subscription,
	UseMiddleware,
} from "type-graphql";
import { UserModel } from "../../../models";
import { Track } from "../../../models/Track";
import { isAuthorized } from "../../../util";
import spotifyApi from "../../../util/Spotify";
import Genius from "genius-lyrics";
import { Context } from "../../context";
import { Artist } from "../../../models/Artist";

@Resolver(() => Track)
export class TrackResolver {
	@Query(() => [Track])
	@UseMiddleware(isAuthorized)
	async topTracks(@Ctx() ctx: Context): Promise<Track[]> {
		if (!ctx.payload?.userId) return [];
		const user = await UserModel.findById(ctx.payload.userId);
		if (user) {
			spotifyApi.setAccessToken(user.spotifyAccessToken);
			try {
				const spotifyTracks = await spotifyApi.getMyTopTracks({ limit: 200 });
				const tracks: Track[] = spotifyTracks.body.items.map((track) => {
					return {
						discNumber: track.disc_number,
						trackNumber: track.track_number,
						durationMs: track.duration_ms,
						spotifyId: track.id,
						name: track.name,
						artistId: track.artists[0].id,
					};
				});
				return tracks;
			} catch (e) {
				if (e.body.error.message === "The access token expired") {
					const response = await spotifyApi.refreshAccessToken();
					const newUser = await UserModel.findByIdAndUpdate(
						user.id,
						{
							spotifyAccessToken: response.body.access_token,
						},
						{ new: true }
					);
					if (newUser) return this.topTracks(ctx);
				}
				console.log(e);
			}
		}
		return [];
	}

	@Query(() => String)
	async fetchLyrics(
		@Arg("songName") songName: string,
		@Arg("artistName") artistName: string
	): Promise<string> {
		const songNameFixed = songName.split("-")[0].trim();
		const query = `${songNameFixed} by ${artistName}`;
		const Client = new Genius.Client(`${process.env.GENIUS_CLIENT_SECRET}`);
		const searches = await Client.songs.search(query);
		if (searches.length === 0) return "No results";
		let lyrics = "";
		while (!lyrics)
			try {
				lyrics = await searches[0].lyrics();
			} catch (e) {
				lyrics = "";
			}
		return lyrics;
	}

	@Query(() => Track, { nullable: true })
	@UseMiddleware(isAuthorized)
	async currentPlayingTrack(@Ctx() { payload }: Context): Promise<Track | null> {
		if (!payload?.userId) return null;
		const user = await UserModel.findById(payload.userId);
		if (!user) return null;
		spotifyApi.setAccessToken(user.spotifyAccessToken);
		const playback = (await spotifyApi.getMyCurrentPlayingTrack()).body;
		const track = playback.item;
		if (!track) return null;
		return {
			discNumber: track.disc_number,
			trackNumber: track.track_number,
			artistId: track.artists[0].id,
			durationMs: track.duration_ms,
			name: track.name,
			spotifyId: track.id,
		};
	}

	@FieldResolver(() => Artist)
	async artist(@Root() track: Track): Promise<Artist> {
		const response = await spotifyApi.getArtist(track.artistId);
		const artist = response.body;
		return {
			followers: artist.followers.total,
			genres: artist.genres,
			images: artist.images,
			name: artist.name,
			spotifyId: artist.id,
		};
	}

	@Query(() => [Track])
	@UseMiddleware(isAuthorized)
	async recentlyPlayed(@Ctx() { payload }: Context): Promise<Track[]> {
		const user = await UserModel.findById(payload?.userId);
		if (!user) return [];
		spotifyApi.setAccessToken(user.spotifyAccessToken);
		const spotifyTracks = await spotifyApi.getMyRecentlyPlayedTracks({
			limit: 10,
		});
		const tracks: Track[] = spotifyTracks.body.items.map(({ track }) => {
			return {
				discNumber: track.disc_number,
				trackNumber: track.track_number,
				durationMs: track.duration_ms,
				spotifyId: track.id,
				name: track.name,
				artistId: track.artists[0].id,
			};
		});
		// if (spotifyTracks.body.cursors.before) {
		// 	let next = spotifyTracks.body.next;
		// 	let cursor = parseFloat(spotifyTracks.body.cursors.before);
		// 	while (next) {
		// 		const add = await spotifyApi.getMyRecentlyPlayedTracks({
		// 			limit: 20,
		// 			before: cursor,
		// 		});
		// 		const newTracks = add.body.items.map(({ track }) => ({
		// 			durationMs: track.duration_ms,
		// 			spotifyId: track.id,
		// 			name: track.name,
		// 			artistId: track.artists[0].id,
		// 		}));
		// 		tracks = [...tracks, ...newTracks];
		// 		next = add.body.next;
		// 		if (add.body.cursors && add.body.cursors.before)
		// 			cursor = parseFloat(add.body.cursors.before);
		// 	}
		// }

		return tracks;
	}
}

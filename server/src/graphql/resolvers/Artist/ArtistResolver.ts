import { DocumentType } from "@typegoose/typegoose";
import {
	Ctx,
	FieldResolver,
	Query,
	Resolver,
	Root,
	UseMiddleware,
} from "type-graphql";
import { Context } from "vm";
import { UserModel } from "../../../models";
import { Album } from "../../../models/Album";
import { Artist, ImageType } from "../../../models/Artist";
import { Track } from "../../../models/Track";
import { isAuthorized } from "../../../util";
import spotifyApi from "../../../util/Spotify";

@Resolver(() => Artist)
export class ArtistResolver {
	@Query(() => [Artist])
	@UseMiddleware(isAuthorized)
	async topArtists(@Ctx() ctx: Context): Promise<Artist[]> {
		if (!ctx.payload?.userId) return [];
		const user = await UserModel.findById(ctx.payload.userId);
		if (user) {
			spotifyApi.setAccessToken(user.spotifyAccessToken);
			try {
				const spotifyArtists = await spotifyApi.getMyTopArtists();
				const artists: Artist[] = spotifyArtists.body.items.map((artist) => {
					return {
						followers: artist.followers.total,
						genres: artist.genres,
						images: artist.images,
						name: artist.name,
						spotifyId: artist.id,
					};
				});
				return artists;
			} catch (e) {
				if (e.body?.error?.message === "The access token expired") {
					const response = await spotifyApi.refreshAccessToken();
					const newUser = await UserModel.findByIdAndUpdate(
						user.id,
						{
							spotifyAccessToken: response.body.access_token,
						},
						{ new: true }
					);
					if (newUser) return this.topArtists(ctx);
				}
				console.log("Artist will be allowed in: " + e.headers["retry-after"] + "s");
				await new Promise((resolve) =>
					setTimeout(resolve, parseFloat(e.headers["retry-after"]) * 1000)
				);
				console.log("Getting artist now");
				return this.topArtists(ctx);
			}
		}
		return [];
	}

	@FieldResolver(() => [Album])
	async albums(@Root() artist: Artist): Promise<Album[]> {
		try {
			const spotifyAlbums = await spotifyApi.getArtistAlbums(artist.spotifyId, {
				limit: 25,
				country: "IL",
				include_groups: "album",
			});

			const albums: Album[] = spotifyAlbums.body.items
				.map((album) => ({
					spotifyId: album.id,
					artistId: album.artists[0].id,
					images: album.images,
					name: album.name,
					releaseDate: album.release_date,
				}))
				.sort((a, b) =>
					a.releaseDate < b.releaseDate ? 1 : a.releaseDate > b.releaseDate ? -1 : 0
				);

			// console.log(albums);
			return albums;
		} catch (e) {
			console.log("Album Will be allowed in: " + e.headers["retry-after"] + "s");
			await new Promise((resolve) =>
				setTimeout(resolve, parseFloat(e.headers["retry-after"]) * 1000)
			);
			console.log("Getting Album");
			return this.albums(artist);
		}
	}

	@FieldResolver(() => [Track])
	async artistTopTracks(@Root() artist: Artist): Promise<Track[]> {
		const response = await spotifyApi.getArtistTopTracks(artist.spotifyId, "IL");
		const tracks: Track[] = response.body.tracks.map((track) => ({
			discNumber: track.disc_number,
			trackNumber: track.track_number,
			artistId: track.artists[0].id,
			durationMs: track.duration_ms,
			name: track.name,
			spotifyId: track.id,
		}));
		return tracks;
	}
}

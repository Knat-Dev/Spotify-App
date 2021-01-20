import {
	Ctx,
	FieldResolver,
	Resolver,
	Root,
	UseMiddleware,
} from "type-graphql";
import { UserModel } from "../../../models";
import { Album } from "../../../models/Album";
import { Track } from "../../../models/Track";
import { isAuthorized } from "../../../util";
import spotifyApi from "../../../util/Spotify";
import { Context } from "../../context";

@Resolver(() => Album)
export class AlbumResolver {
	@FieldResolver(() => [Track])
	@UseMiddleware(isAuthorized)
	async tracks(@Root() album: Album): Promise<Track[]> {
		try {
			const spotifyTracks = await spotifyApi.getAlbumTracks(album.spotifyId, {
				limit: 20,
				market: "IL",
			});
			const tracks: Track[] = spotifyTracks.body.items
				.map((track) => ({
					discNumber: track.disc_number,
					trackNumber: track.track_number,
					artistId: track.artists[0].id,
					durationMs: track.duration_ms,
					name: track.name,
					spotifyId: track.id,
				}))
				.sort((a, b) =>
					a.discNumber < b.discNumber ? -1 : a.discNumber > b.discNumber ? 1 : 0
				);

			return tracks;
		} catch (e) {
			console.log(
				"Album tracks will be available in: " + e.headers["retry-after"] + "s"
			);
			await new Promise((resolve) =>
				setTimeout(resolve, parseFloat(e.headers["retry-after"]) * 1000)
			);
			console.log("Getting tracks now");
			return this.tracks(album);
		}
	}
}

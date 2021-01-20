import {
	getModelForClass,
	modelOptions,
	prop,
	Severity,
} from "@typegoose/typegoose";
import { Field, Float, ObjectType } from "type-graphql";
import { ImageType } from "../Artist";

@ObjectType()
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Album {
	@prop()
	@Field()
	spotifyId: string;

	@prop()
	@Field()
	name: string;

	@prop()
	@Field()
	releaseDate: string;

	@prop()
	@Field()
	artistId: string;

	@prop()
	@Field(() => [ImageType])
	images: ImageType[];
}

export const AlbumModel = getModelForClass(Album);

import {
	getModelForClass,
	modelOptions,
	prop,
	Severity,
} from "@typegoose/typegoose";
import { Field, Float, Int, ObjectType } from "type-graphql";

@ObjectType()
export class ImageType {
	@Field(() => Int)
	height?: number;
	@Field()
	url: string;
	@Field(() => Int)
	width?: number;
}

@ObjectType()
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Artist {
	@prop()
	@Field()
	spotifyId: string;

	@prop()
	@Field()
	name: string;

	@prop({ default: [] })
	@Field(() => [String])
	genres: string[];

	@prop()
	@Field(() => Float, { nullable: true })
	followers: number | undefined;

	@prop()
	@Field(() => [ImageType])
	images: ImageType[];
}

export const ArtistModel = getModelForClass(Artist);

import {
	getModelForClass,
	modelOptions,
	prop,
	Severity,
} from "@typegoose/typegoose";
import { Field, Float, Int, ObjectType } from "type-graphql";

@ObjectType()
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Track {
	@prop()
	@Field()
	spotifyId: string;

	@prop()
	@Field()
	name: string;

	@prop()
	@Field(() => Float)
	trackNumber: number;

	@prop()
	@Field(() => Float)
	discNumber: number;

	@prop()
	@Field(() => Float)
	durationMs: number;

	@prop()
	@Field(() => String)
	artistId: string;
}

export const TrackModel = getModelForClass(Track);

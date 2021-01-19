import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, Float, ID, ObjectType } from "type-graphql";
import { Artist } from "../Artist";

@ObjectType()
export class User {
	@Field(() => ID)
	id: string;

	@Field({ nullable: true })
	@prop()
	public displayName?: string;

	@Field()
	@prop()
	public spotifyId!: string;

	@Field(() => Float)
	@prop({ default: 0 })
	public tokenVersion?: number;

	@prop()
	public spotifyAccessToken!: string;

	@prop()
	public spotifyRefreshToken!: string;
}

export const UserModel = getModelForClass(User);

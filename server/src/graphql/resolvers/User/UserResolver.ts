import { DocumentType, mongoose } from "@typegoose/typegoose";
import { verify } from "jsonwebtoken";
import {
	Arg,
	Ctx,
	Field,
	Mutation,
	ObjectType,
	Query,
	Resolver,
	UseMiddleware,
} from "type-graphql";
import { User, UserModel } from "../../../models";
import { Artist } from "../../../models/Artist";
import { Track } from "../../../models/Track";
import {
	createAccessToken,
	createRefreshToken,
	isAuthorized,
	sendRefreshToken,
} from "../../../util";
import spotifyApi from "../../../util/Spotify";
import { Context } from "../../context";

@ObjectType()
class LoginResponse {
	@Field()
	accessToken: string;

	@Field({ nullable: true })
	user?: User;
}

@Resolver(() => User)
export class UserResolver {
	@Query(() => String)
	authUrl(): string {
		return spotifyApi.createAuthorizeURL(
			[
				"user-top-read",
				"user-read-currently-playing",
				"user-read-recently-played",
			],
			"123"
		);
	}

	@Query(() => String)
	@UseMiddleware(isAuthorized)
	hello(@Ctx() { payload }: Context): string {
		return `Your user id is: ${payload?.userId}`;
	}

	@Query(() => [User])
	async users(): Promise<DocumentType<User>[]> {
		return await UserModel.find();
	}

	@Query(() => User, { nullable: true })
	@UseMiddleware(isAuthorized)
	async me(@Ctx() context: Context): Promise<DocumentType<User> | null> {
		const { req } = context;
		const authorization = req.headers["authorization"];
		if (!authorization) return null;
		const token = authorization.split(" ")[1];

		let payload: any;
		try {
			payload = verify(token, `${process.env.JWT_ACCESS_TOKEN_SECRET}`);
			context.payload = payload as { userId: string };
		} catch (e) {
			console.error(e.message);
			return null;
		}
		return await UserModel.findById(
			mongoose.Types.ObjectId(`${context.payload.userId}`)
		);
	}

	@Mutation(() => LoginResponse)
	async login(
		@Arg("code") code: string,
		@Ctx() { res }: Context
	): Promise<LoginResponse> {
		try {
			const response = await spotifyApi.authorizationCodeGrant(code);
			spotifyApi.setAccessToken(response.body["access_token"]);
			spotifyApi.setRefreshToken(response.body["refresh_token"]);
			const me = await spotifyApi.getMe();
			const userExists = await UserModel.findOne({ spotifyId: me.body.id });
			if (userExists) {
				const updated = await UserModel.findByIdAndUpdate(
					userExists.id,
					{
						spotifyAccessToken: response.body["access_token"],
						spotifyRefreshToken: response.body["refresh_token"],
					},
					{ new: true }
				);
				if (updated) {
					sendRefreshToken(res, createRefreshToken(userExists));
					return {
						accessToken: createAccessToken(userExists),
						user: userExists,
					};
				} else {
					sendRefreshToken(res, "");
					return {
						accessToken: "",
						user: undefined,
					};
				}
			} else {
				const meData = me.body;

				const user = await UserModel.create({
					displayName: meData.display_name,
					spotifyId: meData.id,
					spotifyAccessToken: response.body["access_token"],
					spotifyRefreshToken: response.body["refresh_token"],
				});
				// populate spotify stuff inside database here
				sendRefreshToken(res, createRefreshToken(user));
				return {
					accessToken: createAccessToken(user),
					user,
				};
			}
		} catch (e) {
			if (
				e.body.error === "invalid_grant" &&
				e.body.error_description === "Invalid authorization code"
			) {
				console.log("invalid code");
			} else {
				console.log("hey");
				console.log(JSON.stringify(e, undefined, 2));
			}
		}
		sendRefreshToken(res, "");
		return {
			accessToken: "",
			user: undefined,
		};
	}

	async refresh(
		user: DocumentType<User>,
		callback: (payload: Context) => Promise<any[]>
	): Promise<any[]> {
		console.log("refresh");
		spotifyApi.setRefreshToken(user.spotifyRefreshToken);
		const response = await spotifyApi.refreshAccessToken();
		const newUser = await UserModel.findByIdAndUpdate(
			user.id,
			{
				spotifyAccessToken: response.body.access_token,
			},
			{ new: true }
		);
		if (newUser) return await callback(newUser.id);
		else return [];
	}

	@Mutation(() => Boolean)
	async revokeRefreshTokenForUser(
		@Arg("userId") userId: string
	): Promise<boolean> {
		await UserModel.findOneAndUpdate(
			{ _id: userId },
			{ $inc: { tokenVersion: 1 } },
			{ new: true }
		);

		return true;
	}

	@Mutation(() => Boolean)
	async logout(@Ctx() { res }: Context): Promise<boolean> {
		sendRefreshToken(res, "");
		return true;
	}
}

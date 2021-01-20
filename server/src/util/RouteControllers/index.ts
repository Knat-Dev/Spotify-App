import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { createAccessToken, createRefreshToken, sendRefreshToken } from "..";
import { User, UserModel } from "../../models";
import spotifyApi from "../Spotify";

export const refresh = async (
	req: Request,
	res: Response
): Promise<Response> => {
	const token = req.cookies.nwid;
	if (!token) return res.send({ ok: false, accessToken: "" });

	let payload: any;
	try {
		payload = verify(token, `${process.env.JWT_REFRESH_TOKEN_SECRET}`);
	} catch (e) {
		return res.send({ ok: false, accessToken: "", ...e });
	}

	const user: User | null = await UserModel.findById(payload.userId);
	if (!user) return res.send({ ok: false, accessToken: "" });

	spotifyApi.setAccessToken(user?.spotifyAccessToken);
	spotifyApi.setRefreshToken(user?.spotifyRefreshToken);
	const response = await spotifyApi.refreshAccessToken();
	await UserModel.findByIdAndUpdate(user.id, {
		spotifyAccessToken: response.body.access_token,
	});

	if (user.tokenVersion !== payload.tokenVersion)
		return res.send({ ok: false, accessToken: "" });

	sendRefreshToken(res, createRefreshToken(user)); // send new refresh token as cookie
	return res.send({ ok: true, accessToken: createAccessToken(user) });
};

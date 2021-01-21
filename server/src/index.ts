import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import mongoose, { ConnectionOptions } from "mongoose";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import http from "http";
import {
	AlbumResolver,
	ArtistResolver,
	TrackResolver,
	UserResolver,
} from "./graphql";
import { buildSchema } from "type-graphql";
import cookieParser from "cookie-parser";
import cors from "cors";
import { refresh } from "./util";

// PORT
const port = 5000;

// Mongoose Connection Options
const mongooseConnectionOptions: ConnectionOptions = {
	useFindAndModify: false,
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

(async () => {
	// Express App
	const app = express();
	app.set("trust proxy", 1);
	// Express Middleware
	app.use(cors({ credentials: true, origin: process.env.ORIGIN_URL }));
	app.use(cookieParser());
	// Express Routes
	app.post("/refresh", refresh);
	// Creating MongoDB Connection
	await mongoose.connect(`${process.env.MONGO_URL}`, mongooseConnectionOptions);
	console.log("MongoDB connection started.");
	// Setting up Apollo Server to work with the schema
	const apollo = new ApolloServer({
		schema: await buildSchema({
			resolvers: [UserResolver, ArtistResolver, TrackResolver, AlbumResolver],
		}),
		context: ({ req, res }) => ({ req, res }),
		subscriptions: {
			path: "/api",
		},
		playground: {
			settings: {
				"request.credentials": "include",
			},
		},
	});
	apollo.applyMiddleware({ app, path: "/api", cors: false });
	const httpServer = http.createServer(app);
	apollo.installSubscriptionHandlers(httpServer); // Starting up Express Server
	httpServer.listen(port, () => {
		console.log(`GraphQL playground running at http://localhost:${port}/api`);
	});
})();

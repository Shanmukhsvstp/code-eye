package routes

import (
	"application/handlers"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/jackc/pgx/v5/pgxpool"
)

func SetupApiRoutes(app *fiber.App, dbPool *pgxpool.Pool) {

	api := app.Group("/api")
	auth := api.Group("/auth")
	user := api.Group("/user")

	authHandler := handlers.DBHandler(dbPool)

	api.Get("/health", func(c *fiber.Ctx) error {
		return c.SendString("OK")
	})

	auth.Post("/login", authHandler.Login)
	auth.Post("/signup", authHandler.Signup)
	auth.Get("/validate", authHandler.ValidateUserToken)

	// Email Verification Related APIs
	user.Get("/profile", authHandler.GetUserProfile)

	// Rooms
	api.Post("/rooms", authHandler.RequireAuth, authHandler.CreateRoom)
	api.Use("/rooms/:code/ws", func(c *fiber.Ctx) error {
		if !websocket.IsWebSocketUpgrade(c) {
			return fiber.ErrUpgradeRequired
		}
		return authHandler.RequireAuth(c)
	})

	api.Get("/rooms/:code/ws", websocket.New(authHandler.HandleRoomsWebSocket))
}

package handlers

import (
	"application/models"
	"application/tools"
	"context"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type AuthHandler struct {
	DB *pgxpool.Pool
}

func DBHandler(db *pgxpool.Pool) *AuthHandler {
	return &AuthHandler{
		DB: db,
	}
}

func (h *AuthHandler) Login(c *fiber.Ctx) error {

	var req models.LoginRequest

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid request",
		})
	}

	currentUsername := req.Username
	userPassword := ""

	userId := ""

	err := h.DB.QueryRow(
		c.Context(),
		`
		SELECT id, password FROM users WHERE username=$1 OR email=$1
	`,
		currentUsername,
	).Scan(&userId, &userPassword)

	if err != nil {
		if err == pgx.ErrNoRows {
			return c.Status(401).JSON(fiber.Map{
				"error": "User not found, please sign up first!",
			})
		}
		return c.Status(500).JSON(fiber.Map{
			"error": "internal server error",
		})
	}

	if !tools.PasswordMatches(req.Password, userPassword) {
		return c.Status(401).JSON(fiber.Map{
			"error": "Incorrect password!",
		})
	}

	// Password check done, email/username is valid, now finalize authentication

	token, err := tools.GenerateToken(userId)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to generate token",
		})
	}

	return c.JSON(models.LoginResponse{
		Token: token,
	})
}

// Signup handles user registration
func (h *AuthHandler) Signup(c *fiber.Ctx) error {

	var req models.SignupRequest

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	currentEmail := req.Email
	currentUsername := req.Username

	if currentUsername == "" || currentEmail == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "username and email are required",
		})
	}

	if len(currentUsername) < 3 || len(currentUsername) > 30 {
		return c.Status(400).JSON(fiber.Map{
			"error": "username must be between 3 and 30 characters",
		})
	}

	if len(req.Password) < 8 || len(req.Password) > 100 {
		return c.Status(400).JSON(fiber.Map{
			"error": "password must be between 8 and 100 characters",
		})
	}

	// Above are checks for lengths, now if user already exists
	exists, err := tools.UserAlreadyExist(currentEmail, h.DB)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "internal server error",
		})
	}
	if exists {
		return c.Status(409).JSON(fiber.Map{
			"error": "user with this email already exists",
		})
	}

	// Above are checks for lengths, now username availaibility
	isUnique, err := tools.UsernameIsUnique(currentUsername, h.DB)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "internal server error",
		})
	}
	if !isUnique {
		return c.Status(409).JSON(fiber.Map{
			"error": "username already taken",
		})
	}

	// All validations passed, create the user

	// Hash the password
	hashedPassword, err := tools.HashPassword(req.Password)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	var userID string
	var name string
	names := strings.Split(currentEmail, "@")
	name = names[0]

	err = h.DB.QueryRow(
		c.Context(),
		`
	INSERT INTO users (name, username, email, password)
	VALUES ($1, $2, $3, $4)
	RETURNING id
	`,
		name,
		currentUsername,
		currentEmail,
		hashedPassword,
	).Scan(&userID)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to create user",
		})
	}

	token, err := tools.GenerateToken(userID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to generate token",
		})
	}

	return c.JSON(models.SignupResponse{
		Token: token,
	})
}

func (h *AuthHandler) CheckUsername(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"message": "username is available",
	})
}

func (h *AuthHandler) ValidateUserToken(c *fiber.Ctx) error {

	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return c.Status(401).JSON(fiber.Map{
			"error": "missing authorization header",
		})
	}
	token := strings.TrimSpace(
		strings.TrimPrefix(authHeader, "Bearer "),
	)

	if token == authHeader {
		return c.Status(401).JSON(fiber.Map{
			"error": "invalid authorization format",
		})
	}

	userID, exp, _, err := tools.GetDataFromToken(token)
	if err != nil {
		return c.Status(401).JSON(fiber.Map{
			"error": "invalid token",
		})
	}

	expTime := int64(exp)
	now := time.Now().Unix()
	var isVerified bool

	err = h.DB.QueryRow(
		c.Context(),
		`SELECT is_verified FROM users WHERE id = $1`,
		userID,
	).Scan(&isVerified)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to fetch user",
		})
	}

	if expTime <= now+(24*60*60) { // if token expires in next 24 hours
		newToken, err := tools.GenerateToken(userID)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "failed to generate new token",
			})
		}
		return c.Status(200).JSON(fiber.Map{
			"token": newToken,
		})
	}
	return c.Status(200).JSON(fiber.Map{
		"message":     "token is valid",
		"is_verified": isVerified,
	})
}

func (h *AuthHandler) CreateRoom(c *fiber.Ctx) error {

	// userID := c.Locals("userID").(string)

	newCode, _ := tools.GenerateRoomCode()

	// err := h.DB.QueryRow(
	// 	c.Context(),
	// 	`INSERT INTO rooms (id, created_by) VALUES ($1, $2) RETURNING id`,
	// 	newCode,
	// 	userID,
	// ).Scan(&roomID)

	// if err != nil {
	// 	return c.Status(500).JSON(fiber.Map{
	// 		"error": "failed to create room",
	// 	})
	// }

	return c.JSON(fiber.Map{
		"code": newCode,
	})
}

func (h *AuthHandler) RequireAuth(c *fiber.Ctx) error {
	// authHeader := c.Get("Authorization")
	// if authHeader == "" {
	// 	return c.Status(401).SendString("missing authorization header")
	// }

	// if !strings.HasPrefix(authHeader, "Bearer ") {
	// 	return c.Status(401).SendString("invalid authorization format")
	// }

	// token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer "))

	token := c.Query("token")
	fmt.Println("RAW TOKEN:", token)
	userID, _, _, err := tools.GetDataFromToken(token)
	if err != nil {
		return c.Status(401).SendString("invalid token")
	}

	// OPTIONAL: store userID for later use
	c.Locals("userID", userID)

	return c.Next()
}

var rooms = make(map[int64]*models.Room)

func (h *AuthHandler) HandleRoomsWebSocket(c *websocket.Conn) {
	defer c.Close()

	userId := c.Locals("userID").(string)
	codeString := c.Params("code")

	code, _ := strconv.ParseInt(codeString, 10, 64)
	userID, _ := strconv.ParseInt(userId, 10, 64)

	ctx := context.Background()

	room, exists := rooms[code]
	if !exists {
		room = &models.Room{
			ClientsStates: make(map[int64]*models.ClientState),
			Clients:       make(map[*models.Client]bool),
		}
		rooms[code] = room
	}

	var created_by string

	err := h.DB.QueryRow(
		ctx,
		`SELECT created_by FROM rooms WHERE id=$1`,
		code,
	).Scan(&created_by)

	var role string

	if userId == created_by {
		role = "admin"
	} else {
		role = "client"
	}

	client := &models.Client{
		Conn:   c,
		UserId: userID,
		Role:   role, // client or admin
	}

	room.Clients[client] = true

	if role == "client" {
		room.ClientsStates[userID] = &models.ClientState{}
	}

	if role == "admin" {
		for uid, state := range room.ClientsStates {
			client.Conn.WriteJSON(map[string]interface{}{
				"type":   "update",
				"userId": uid,
				"code":   state.Code,
			})
		}
	}

	// err = h.DB.QueryRow(
	// 	ctx,
	// 	`INSERT INTO rooms (id, created_by) VALUES ($1, $2)`,
	// 	code,
	// 	userID,
	// )

	if err != nil {
		// return c.Status(500).JSON(fiber.Map{
		// 	"error": "failed to create room",
		// })
	}

	fmt.Println("User:", userID, "Room:", code)

	for {
		_, msg, err := c.ReadMessage()
		if err != nil {
			fmt.Println("Disconnected:", err)
			break
		}

		var data models.WSMsg

		if err := json.Unmarshal(msg, &data); err != nil {
			continue
		}

		switch data.Type {
		case "code_change":
			if client.Role != "client" {
				continue
			}
			state := room.ClientsStates[userID]
			state.Code = data.Code
			state.LastUpdated = time.Now()

			for cl := range room.Clients {
				if cl.Role == "admin" {
					cl.Conn.WriteJSON(map[string]interface{}{
						"type":   "update",
						"userId": userID,
						"code":   data.Code,
					})
				}
			}
		}

		delete(room.Clients, client)
		if client.Role == "client" {
			delete(room.ClientsStates, userID)
		}

	}
}

func (h *AuthHandler) IsEmailVerified(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return c.Status(401).JSON(fiber.Map{
			"error": "missing authorization header",
		})
	}
	token := strings.TrimSpace(
		strings.TrimPrefix(authHeader, "Bearer "),
	)

	if token == authHeader {
		return c.Status(401).JSON(fiber.Map{
			"error": "invalid authorization format",
		})
	}

	userID, _, _, err := tools.GetDataFromToken(token)
	if err != nil {
		return c.Status(401).JSON(fiber.Map{
			"error": "invalid token",
		})
	}

	var isVerified bool
	err = h.DB.QueryRow(
		c.Context(),
		`SELECT is_verified FROM users WHERE id = $1`,
		userID,
	).Scan(&isVerified)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to fetch user verification status",
		})
	}

	return c.JSON(fiber.Map{
		"is_verified": isVerified,
	})
}

func (h *AuthHandler) GetUserProfile(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return c.Status(401).JSON(fiber.Map{
			"error": "missing authorization header",
		})
	}
	token := strings.TrimSpace(
		strings.TrimPrefix(authHeader, "Bearer "),
	)

	if token == authHeader {
		return c.Status(401).JSON(fiber.Map{
			"error": "invalid authorization format",
		})
	}

	userID, _, _, err := tools.GetDataFromToken(token)
	if err != nil {
		return c.Status(401).JSON(fiber.Map{
			"error": "invalid token",
		})
	}

	username, name, email := "", "", ""

	err = h.DB.QueryRow(
		c.Context(),
		`
	SELECT username, email, name FROM users 
	WHERE id = $1
	`,
		userID,
	).Scan(&username, &email, &name)

	return c.JSON(models.ProfileResponse{
		Email:    email,
		Username: username,
		Name:     name,
	})
}

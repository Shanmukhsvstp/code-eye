package models

import (
	"time"

	"github.com/gofiber/websocket/v2"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
type LoginResponse struct {
	Token string `json:"token"`
}

type SignupRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}
type SignupResponse struct {
	Token string `json:"token"`
}
type ProfileResponse struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Name     string `json:"name"`
	// Username string `json:"username"`
	// Username string `json:"username"`
}

// Websocket responses and req's
type WSMsg struct {
	Type string `json:"type"`
	Code string `json:"code,omitempty"`
}

// Websocket Data
type Client struct {
	Conn   *websocket.Conn
	UserId int64
	RoomId int64
	Role   string
}
type ClientState struct {
	Code        string
	LastUpdated time.Time
}
type Room struct {
	ClientsStates map[int64]*ClientState
	Clients       map[*Client]bool
}

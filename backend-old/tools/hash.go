package tools

import (
	"crypto/rand"
	"math/big"

	"golang.org/x/crypto/bcrypt"
)

const (
	MinCost     int = 4  // the minimum allowable cost as passed in to GenerateFromPassword
	MaxCost     int = 31 // the maximum allowable cost as passed in to GenerateFromPassword
	DefaultCost int = 10 // the cost that will actually be set if a cost below MinCost is passed into GenerateFromPassword
)

func HashPassword(password string) (string, error) {
	// Dummy hash function for illustration
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), DefaultCost)

	if err != nil {
		return "", err
	}

	return string(hashedPassword), nil
}
func PasswordMatches(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	if err != nil {
		return false
	}
	return err == nil
}

func GenerateRoomCode() (int64, error) {
	max := big.NewInt(900000000)
	n, err := rand.Int(rand.Reader, max)
	if err != nil {
		return 0, err
	}
	return n.Int64() + 100000000, nil
}

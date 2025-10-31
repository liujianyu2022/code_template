package tools

import (
	"time"

	"backend/config"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserAddress string `json:"user_address"`
	jwt.RegisteredClaims
}

// GenerateToken 生成JWT Token
func GenerateToken(userAddress string, config *config.Config) (string, error) {
	now := time.Now()
	expireTime := now.Add(time.Duration(config.JWT.ExpireTime) * time.Hour)

	claims := Claims{
		UserAddress: userAddress,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expireTime),
			Issuer:    "dapp",
			IssuedAt:  jwt.NewNumericDate(now),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(config.JWT.Secret))
}

// ParseToken 解析JWT Token
func ParseToken(tokenString string, config *config.Config) (*Claims, error) {
	// tokenString = strings.TrimPrefix(tokenString, "Bearer ")

	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (any, error) {
		return []byte(config.JWT.Secret), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, jwt.ErrTokenInvalidClaims
}

package auth

import (
	"errors"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

var (
    ErrInvalidToken = errors.New("invalid token")
    ErrExpiredToken = errors.New("token has expired")
)

type TokenPair struct {
    AccessToken  string
    RefreshToken string
}

type Claims struct {
    UserID int64  `json:"user_id"`
    Email  string `json:"email"`
    TokenID string `json:"token_id"`
    jwt.RegisteredClaims
}

type RefreshClaims struct {
    UserID  int64  `json:"user_id"`
    TokenID string `json:"token_id"`
    jwt.RegisteredClaims
}

type JWTService struct {
    accessSecret  []byte
    refreshSecret []byte
    tokenStore    TokenStore
}

func NewJWTService(accessSecret, refreshSecret string, tokenStore TokenStore) *JWTService {
    return &JWTService{
        accessSecret:  []byte(accessSecret),
        refreshSecret: []byte(refreshSecret),
        tokenStore:    tokenStore,
    }
}

func (j *JWTService) GenerateTokenPair(userID int64, email string) (*TokenPair, error) {
    tokenID := uuid.New().String()

    accessToken, err := j.generateAccessToken(userID, email, tokenID)
    if err != nil {
        return nil, err
    }

    refreshToken, err := j.generateRefreshToken(userID, tokenID)
    if err != nil {
        return nil, err
    }

    err = j.tokenStore.StoreToken(tokenID, userID, time.Now().Add(7*24*time.Hour))
    if err != nil {
        return nil, err
    }

    return &TokenPair{
        AccessToken:  accessToken,
        RefreshToken: refreshToken,
    }, nil
}

func (j *JWTService) generateAccessToken(userID int64, email, tokenID string) (string, error) {
    claims := &Claims{
        UserID:  userID,
        Email:   email,
        TokenID: tokenID,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(15 * time.Minute)),
            IssuedAt:  jwt.NewNumericDate(time.Now()),
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(j.accessSecret)
}

func (j *JWTService) generateRefreshToken(userID int64, tokenID string) (string, error) {
    claims := &RefreshClaims{
        UserID:  userID,
        TokenID: tokenID,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour)),
            IssuedAt:  jwt.NewNumericDate(time.Now()),
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(j.refreshSecret)
}

func (j *JWTService) ValidateAccessToken(tokenString string) (*Claims, error) {
    token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
        return j.accessSecret, nil
    })

    if err != nil {
        return nil, err
    }

    claims, ok := token.Claims.(*Claims)
    if !ok || !token.Valid {
        return nil, ErrInvalidToken
    }

    if j.tokenStore.IsTokenRevoked(claims.TokenID) {
        return nil, ErrInvalidToken
    }

    return claims, nil
}

func (j *JWTService) ValidateRefreshToken(tokenString string) (*RefreshClaims, error) {
    token, err := jwt.ParseWithClaims(tokenString, &RefreshClaims{}, func(token *jwt.Token) (interface{}, error) {
        return j.refreshSecret, nil
    })

    if err != nil {
        return nil, err
    }

    claims, ok := token.Claims.(*RefreshClaims)
    if !ok || !token.Valid {
        return nil, ErrInvalidToken
    }

    if !j.tokenStore.IsTokenValid(claims.TokenID) {
        return nil, ErrInvalidToken
    }

    return claims, nil
}

func (j *JWTService) RevokeToken(tokenID string) error {
    return j.tokenStore.RevokeToken(tokenID)
}

func (j *JWTService) SetTokenCookies(c echo.Context, tokenPair *TokenPair) {
    accessCookie := new(http.Cookie)
    accessCookie.Name = "access_token"
    accessCookie.Value = tokenPair.AccessToken
    accessCookie.Expires = time.Now().Add(15 * time.Minute)
    accessCookie.Path = "/"
    accessCookie.HttpOnly = true
    accessCookie.Secure = true
    accessCookie.SameSite = http.SameSiteStrictMode

    refreshCookie := new(http.Cookie)
    refreshCookie.Name = "refresh_token"
    refreshCookie.Value = tokenPair.RefreshToken
    refreshCookie.Expires = time.Now().Add(7 * 24 * time.Hour)
    refreshCookie.Path = "/auth/refresh"
    refreshCookie.HttpOnly = true
    refreshCookie.Secure = true
    refreshCookie.SameSite = http.SameSiteStrictMode

    c.SetCookie(accessCookie)
    c.SetCookie(refreshCookie)
}

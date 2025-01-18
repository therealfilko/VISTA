package auth

import (
    "golang.org/x/crypto/bcrypt"
)

type PasswordService struct {
    cost int
}

func NewPasswordService() *PasswordService {
    return &PasswordService{
        cost: bcrypt.DefaultCost,
    }
}

func (s *PasswordService) HashPassword(password string) (string, error) {
    hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), s.cost)
    if err != nil {
        return "", err
    }
    return string(hashedBytes), nil
}

func (s *PasswordService) CheckPassword(password, hash string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
    return err == nil
}

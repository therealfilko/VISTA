package auth

import (
	"sync"
	"time"
)

type TokenStore interface {
    StoreToken(tokenID string, userID int64, expiresAt time.Time) error
    IsTokenValid(tokenID string) bool
    IsTokenRevoked(tokenID string) bool
    RevokeToken(tokenID string) error
    CleanupExpiredTokens()
}

type TokenInfo struct {
    UserID    int64
    ExpiresAt time.Time
    Revoked   bool
}

type MemoryTokenStore struct {
    tokens map[string]TokenInfo
    mutex  sync.RWMutex
}

func NewMemoryTokenStore() *MemoryTokenStore {
    store := &MemoryTokenStore{
        tokens: make(map[string]TokenInfo),
    }

    go store.periodicCleanup()

    return store
}

func (s *MemoryTokenStore) StoreToken(tokenID string, userID int64, expiresAt time.Time) error {
    s.mutex.Lock()
    defer s.mutex.Unlock()

    s.tokens[tokenID] = TokenInfo{
        UserID:    userID,
        ExpiresAt: expiresAt,
        Revoked:   false,
    }

    return nil
}

func (s *MemoryTokenStore) IsTokenValid(tokenID string) bool {
    s.mutex.RLock()
    defer s.mutex.RUnlock()

    info, exists := s.tokens[tokenID]
    if !exists {
        return false
    }

    return !info.Revoked && time.Now().UTC().Before(info.ExpiresAt)
}

func (s *MemoryTokenStore) IsTokenRevoked(tokenID string) bool {
    s.mutex.RLock()
    defer s.mutex.RUnlock()

    info, exists := s.tokens[tokenID]
    if !exists {
        return false
    }

    return info.Revoked
}

func (s *MemoryTokenStore) RevokeToken(tokenID string) error {
    s.mutex.Lock()
    defer s.mutex.Unlock()

    if info, exists := s.tokens[tokenID]; exists {
        info.Revoked = true
        s.tokens[tokenID] = info
    }

    return nil
}

func (s *MemoryTokenStore) CleanupExpiredTokens() {
    s.mutex.Lock()
    defer s.mutex.Unlock()

    now := time.Now().UTC()
    for tokenID, info := range s.tokens {
        if now.After(info.ExpiresAt) {
            delete(s.tokens, tokenID)
        }
    }
}

func (s *MemoryTokenStore) periodicCleanup() {
    ticker := time.NewTicker(1 * time.Hour)
    for range ticker.C {
        s.CleanupExpiredTokens()
    }
}

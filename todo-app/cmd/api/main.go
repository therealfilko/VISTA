package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os/signal"
	"syscall"
	"time"

	//_ "todo-app/cmd/api/docs" // Import für generierte Swagger-Dokumentation
	"todo-app/internal/server"
)

func gracefulShutdown(done chan bool) {
	// Create context that listens for the interrupt signal from the OS.
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	// Listen for the interrupt signal.
	<-ctx.Done()

	log.Println("shutting down gracefully, press Ctrl+C again to force")

	// The context is used to inform the server it has 5 seconds to finish
	// the request it is currently handling
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Notify the main goroutine that the shutdown is complete
	done <- true
}

func main() {
	// Initialize server with error handling
	srv, err := server.NewServer()
	if err != nil {
		log.Fatalf("Failed to create server: %v", err)
	}

	// Create a done channel to signal when the shutdown is complete
	done := make(chan bool, 1)

	// Get the handler from the server
	handler := srv.RegisterRoutes()

	// Create http.Server
	httpServer := &http.Server{
		Addr:    fmt.Sprintf(":%d", srv.Port),
		Handler: handler,
	}

	// Run graceful shutdown in a separate goroutine
	go gracefulShutdown(done)

	log.Printf("Server starting on port %d", srv.Port)
	if err := httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal(err)
	}

	// Wait for the graceful shutdown to complete
	<-done
	log.Println("Graceful shutdown complete.")
}

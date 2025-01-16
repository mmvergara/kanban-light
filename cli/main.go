package main

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/google/uuid"
)

func getConfigFilePath() (string, error) {
	configDir, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}
	appConfigDir := filepath.Join(configDir, "cli-client")
	if err := os.MkdirAll(appConfigDir, 0755); err != nil {
		return "", fmt.Errorf("failed to create directory: %w", err)
	}

	configFile := filepath.Join(appConfigDir, "client_id")
	if err := checkWritePermission(configFile); err != nil {
		return "", fmt.Errorf("no write permissions to file: %w", err)
	}

	return configFile, nil
}

func checkWritePermission(filePath string) error {
	// Try to open the file for writing. If it fails, the app doesn't have write permission.
	f, err := os.OpenFile(filePath, os.O_RDWR|os.O_CREATE, 0644)
	if err != nil {
		return err
	}
	defer f.Close()
	return nil
}

func getOrCreateClientID() (string, error) {
	configFile, err := getConfigFilePath()
	if err != nil {
		return "", err
	}

	if _, err := os.Stat(configFile); os.IsNotExist(err) {
		id := uuid.New()
		err := os.WriteFile(configFile, []byte(id.String()), 0644)
		if err != nil {
			return "", err
		}
		return id.String(), nil
	}
	data, err := os.ReadFile(configFile)
	if err != nil {
		return "", err
	}
	return string(data), nil
}

func main() {
	id, err := getOrCreateClientID()
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	fmt.Println("Client ID:", id)
}

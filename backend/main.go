package main

import (
	"encoding/json"
	"log"
	"net/http"
)

type Athlete struct {
	Name           string `json:"name"`
	Grade          int    `json:"grade"`
	PersonalRecord string `json:"personalRecord"`
}

var athletes = []Athlete{
	{Name: "Marcus Johnson", Grade: 12, PersonalRecord: "16:42"},
	{Name: "Emily Chen", Grade: 11, PersonalRecord: "19:15"},
	{Name: "David Williams", Grade: 10, PersonalRecord: "17:28"},
	{Name: "Sarah Martinez", Grade: 12, PersonalRecord: "20:03"},
	{Name: "Jake Thompson", Grade: 9, PersonalRecord: "18:55"},
}

func main() {
	http.HandleFunc("/health", healthHandler)
	http.HandleFunc("/hello", helloHandler)
	http.HandleFunc("/api/athletes", athletesHandler)

	log.Println("Backend server starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Hello from Jones County XC!"})
}

func athletesHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(athletes)
}

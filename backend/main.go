package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
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
	r := gin.Default()

	r.GET("/health", healthHandler)
	r.GET("/hello", helloHandler)
	r.GET("/api/athletes", athletesHandler)

	r.Run(":8080")
}

func healthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func helloHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Hello from Jones County XC!"})
}

func athletesHandler(c *gin.Context) {
	c.JSON(http.StatusOK, athletes)
}

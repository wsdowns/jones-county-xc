package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Athlete struct {
	ID             int    `json:"id"`
	Name           string `json:"name"`
	Grade          int    `json:"grade"`
	PersonalRecord string `json:"personalRecord"`
}

type Meet struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Date     string `json:"date"`
	Location string `json:"location"`
}

type Result struct {
	ID        int    `json:"id"`
	AthleteID int    `json:"athleteId"`
	MeetID    int    `json:"meetId"`
	Time      string `json:"time"`
	Place     int    `json:"place"`
}

var athletes = []Athlete{
	{ID: 1, Name: "Marcus Johnson", Grade: 12, PersonalRecord: "16:42"},
	{ID: 2, Name: "Emily Chen", Grade: 11, PersonalRecord: "19:15"},
	{ID: 3, Name: "David Williams", Grade: 10, PersonalRecord: "17:28"},
	{ID: 4, Name: "Sarah Martinez", Grade: 12, PersonalRecord: "20:03"},
	{ID: 5, Name: "Jake Thompson", Grade: 9, PersonalRecord: "18:55"},
}

var meets = []Meet{
	{ID: 1, Name: "Jones County Invitational", Date: "2026-02-15", Location: "Gray, GA"},
	{ID: 2, Name: "Region 4-AAAAA Championship", Date: "2026-02-22", Location: "Macon, GA"},
	{ID: 3, Name: "State Qualifier", Date: "2026-03-01", Location: "Atlanta, GA"},
	{ID: 4, Name: "GHSA State Championship", Date: "2026-03-08", Location: "Carrollton, GA"},
}

var results = []Result{
	{ID: 1, AthleteID: 1, MeetID: 1, Time: "16:58", Place: 1},
	{ID: 2, AthleteID: 3, MeetID: 1, Time: "17:45", Place: 2},
	{ID: 3, AthleteID: 5, MeetID: 1, Time: "19:12", Place: 3},
	{ID: 4, AthleteID: 2, MeetID: 1, Time: "19:32", Place: 4},
	{ID: 5, AthleteID: 4, MeetID: 1, Time: "20:15", Place: 5},
	{ID: 6, AthleteID: 1, MeetID: 2, Time: "16:42", Place: 1},
	{ID: 7, AthleteID: 3, MeetID: 2, Time: "17:28", Place: 2},
}

func main() {
	r := gin.Default()

	r.GET("/health", healthHandler)
	r.GET("/hello", helloHandler)
	r.GET("/api/athletes", athletesHandler)
	r.GET("/api/meets", meetsHandler)
	r.GET("/api/results", resultsHandler)

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

func meetsHandler(c *gin.Context) {
	c.JSON(http.StatusOK, meets)
}

func resultsHandler(c *gin.Context) {
	c.JSON(http.StatusOK, results)
}

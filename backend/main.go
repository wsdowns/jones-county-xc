package main

import (
	"database/sql"
	"log"
	"net/http"
	"strconv"

	"jones-county-xc/backend/db"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

var queries *db.Queries

func main() {
	// Connect to MySQL
	conn, err := sql.Open("mysql", "xcapp:xcapp123@tcp(127.0.0.1:3306)/jones_county_xc?parseTime=true")
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer conn.Close()

	// Verify connection
	if err := conn.Ping(); err != nil {
		log.Fatal("Failed to ping database:", err)
	}
	log.Println("Connected to MySQL database")

	// Initialize queries
	queries = db.New(conn)

	// Setup router
	r := gin.Default()

	r.GET("/health", healthHandler)
	r.GET("/api/athletes", getAthletesHandler)
	r.GET("/api/athletes/:id", getAthleteByIDHandler)
	r.GET("/api/meets", getMeetsHandler)
	r.GET("/api/meets/:id/results", getResultsByMeetHandler)
	r.POST("/api/results", createResultHandler)
	r.GET("/api/results/top10", getTopTenFastestHandler)

	r.Run(":8080")
}

func healthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func getAthletesHandler(c *gin.Context) {
	athletes, err := queries.GetAllAthletes(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Convert to JSON-friendly format
	result := make([]gin.H, len(athletes))
	for i, a := range athletes {
		result[i] = gin.H{
			"id":             a.ID,
			"name":           a.Name,
			"grade":          a.Grade,
			"personalRecord": a.PersonalRecord.String,
			"events":         a.Events.String,
		}
	}
	c.JSON(http.StatusOK, result)
}

func getAthleteByIDHandler(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid athlete ID"})
		return
	}

	athlete, err := queries.GetAthleteByID(c.Request.Context(), int32(id))
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Athlete not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":             athlete.ID,
		"name":           athlete.Name,
		"grade":          athlete.Grade,
		"personalRecord": athlete.PersonalRecord.String,
		"events":         athlete.Events.String,
	})
}

func getMeetsHandler(c *gin.Context) {
	meets, err := queries.GetAllMeets(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	result := make([]gin.H, len(meets))
	for i, m := range meets {
		result[i] = gin.H{
			"id":          m.ID,
			"name":        m.Name,
			"date":        m.Date.Format("2006-01-02"),
			"location":    m.Location.String,
			"description": m.Description.String,
		}
	}
	c.JSON(http.StatusOK, result)
}

func getResultsByMeetHandler(c *gin.Context) {
	meetID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid meet ID"})
		return
	}

	results, err := queries.GetMeetResults(c.Request.Context(), int32(meetID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := make([]gin.H, len(results))
	for i, r := range results {
		response[i] = gin.H{
			"id":          r.ID,
			"athleteId":   r.AthleteID,
			"athleteName": r.AthleteName,
			"meetId":      r.MeetID,
			"time":        r.Time,
			"place":       r.Place.Int32,
		}
	}
	c.JSON(http.StatusOK, response)
}

type CreateResultRequest struct {
	AthleteID int32  `json:"athleteId" binding:"required"`
	MeetID    int32  `json:"meetId" binding:"required"`
	Time      string `json:"time" binding:"required"`
	Place     int32  `json:"place"`
}

func createResultHandler(c *gin.Context) {
	var req CreateResultRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := queries.CreateResult(c.Request.Context(), db.CreateResultParams{
		AthleteID: req.AthleteID,
		MeetID:    req.MeetID,
		Time:      req.Time,
		Place:     sql.NullInt32{Int32: req.Place, Valid: req.Place > 0},
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	id, _ := result.LastInsertId()
	c.JSON(http.StatusCreated, gin.H{
		"id":        id,
		"athleteId": req.AthleteID,
		"meetId":    req.MeetID,
		"time":      req.Time,
		"place":     req.Place,
	})
}

func getTopTenFastestHandler(c *gin.Context) {
	results, err := queries.GetTopTenFastestTimes(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := make([]gin.H, len(results))
	for i, r := range results {
		response[i] = gin.H{
			"id":           r.ID,
			"time":         r.Time,
			"place":        r.Place.Int32,
			"athleteId":    r.AthleteID,
			"athleteName":  r.AthleteName,
			"athleteGrade": r.AthleteGrade,
			"meetId":       r.MeetID,
			"meetName":     r.MeetName,
			"meetDate":     r.MeetDate.Format("2006-01-02"),
		}
	}
	c.JSON(http.StatusOK, response)
}

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
var dbConn *sql.DB

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
	dbConn = conn

	// Setup router
	r := gin.Default()

	r.GET("/health", healthHandler)
	r.GET("/api/athletes", getAthletesHandler)
	r.POST("/api/athletes", createAthleteHandler)
	r.GET("/api/athletes/:id", getAthleteByIDHandler)
	r.GET("/api/athletes/:id/results", getAthleteResultsHandler)
	r.GET("/api/meets", getMeetsHandler)
	r.POST("/api/meets", createMeetHandler)
	r.GET("/api/meets/:id/results", getResultsByMeetHandler)
	r.GET("/api/results", getResultsHandler)
	r.POST("/api/results", createResultHandler)
	r.GET("/api/results/top10", getTopTenFastestHandler)
	r.POST("/api/login", loginHandler)

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

func getAthleteResultsHandler(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid athlete ID"})
		return
	}

	results, err := queries.GetAthleteResults(c.Request.Context(), int32(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := make([]gin.H, len(results))
	for i, r := range results {
		response[i] = gin.H{
			"id":       r.ID,
			"athleteId": r.AthleteID,
			"meetId":   r.MeetID,
			"event":    r.Event.String,
			"time":     r.Time,
			"place":    r.Place.Int32,
			"meetName": r.MeetName,
			"meetDate": r.MeetDate.Format("January 2, 2006"),
		}
	}
	c.JSON(http.StatusOK, response)
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

type CreateMeetRequest struct {
	Name        string `json:"name" binding:"required"`
	Date        string `json:"date" binding:"required"`
	Location    string `json:"location"`
	Description string `json:"description"`
}

func createMeetHandler(c *gin.Context) {
	var req CreateMeetRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := dbConn.ExecContext(c.Request.Context(),
		"INSERT INTO meets (name, date, location, description) VALUES (?, ?, ?, ?)",
		req.Name, req.Date, req.Location, req.Description)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	id, _ := result.LastInsertId()
	c.JSON(http.StatusCreated, gin.H{
		"id":          id,
		"name":        req.Name,
		"date":        req.Date,
		"location":    req.Location,
		"description": req.Description,
	})
}

func getResultsHandler(c *gin.Context) {
	// Get all meets
	meets, err := queries.GetAllMeets(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Build response with results for each meet
	response := make([]gin.H, 0)
	for _, m := range meets {
		// Get results for this meet
		results, err := queries.GetMeetResults(c.Request.Context(), m.ID)
		if err != nil {
			continue // Skip meets with no results
		}
		if len(results) == 0 {
			continue
		}

		// Build athletes array
		athletes := make([]gin.H, len(results))
		for i, r := range results {
			athletes[i] = gin.H{
				"id":   r.AthleteID,
				"name": r.AthleteName,
				"time": r.Time,
			}
		}

		// Determine team placement (simplified - just use best individual place)
		placement := ""
		if len(results) > 0 && results[0].Place.Valid {
			place := results[0].Place.Int32
			switch place {
			case 1:
				placement = "1st"
			case 2:
				placement = "2nd"
			case 3:
				placement = "3rd"
			default:
				placement = strconv.Itoa(int(place)) + "th"
			}
		}

		response = append(response, gin.H{
			"id":        m.ID,
			"meetName":  m.Name,
			"date":      m.Date.Format("January 2, 2006"),
			"placement": placement,
			"athletes":  athletes,
		})
	}

	c.JSON(http.StatusOK, response)
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
			"event":       r.Event.String,
			"time":        r.Time,
			"place":       r.Place.Int32,
		}
	}
	c.JSON(http.StatusOK, response)
}

type CreateAthleteRequest struct {
	Name           string `json:"name" binding:"required"`
	Grade          int32  `json:"grade" binding:"required"`
	PersonalRecord string `json:"personalRecord"`
	Events         string `json:"events"`
}

func createAthleteHandler(c *gin.Context) {
	var req CreateAthleteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := dbConn.ExecContext(c.Request.Context(),
		"INSERT INTO athletes (name, grade, personal_record, events) VALUES (?, ?, ?, ?)",
		req.Name, req.Grade, req.PersonalRecord, req.Events)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	id, _ := result.LastInsertId()
	c.JSON(http.StatusCreated, gin.H{
		"id":             id,
		"name":           req.Name,
		"grade":          req.Grade,
		"personalRecord": req.PersonalRecord,
		"events":         req.Events,
	})
}

type CreateResultRequest struct {
	AthleteID int32  `json:"athleteId" binding:"required"`
	MeetID    int32  `json:"meetId" binding:"required"`
	Event     string `json:"event" binding:"required"`
	Time      string `json:"time" binding:"required"`
	Place     int32  `json:"place"`
}

func createResultHandler(c *gin.Context) {
	var req CreateResultRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := dbConn.ExecContext(c.Request.Context(),
		"INSERT INTO results (athlete_id, meet_id, event, time, place) VALUES (?, ?, ?, ?, ?)",
		req.AthleteID, req.MeetID, req.Event, req.Time, req.Place)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	id, _ := result.LastInsertId()
	c.JSON(http.StatusCreated, gin.H{
		"id":        id,
		"athleteId": req.AthleteID,
		"meetId":    req.MeetID,
		"event":     req.Event,
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

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func loginHandler(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var id int
	var username string
	err := dbConn.QueryRowContext(c.Request.Context(),
		"SELECT id, username FROM users WHERE username = ? AND password = ?",
		req.Username, req.Password).Scan(&id, &username)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":  true,
		"id":       id,
		"username": username,
	})
}

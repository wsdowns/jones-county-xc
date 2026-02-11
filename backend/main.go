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

	// Event Types CRUD
	r.GET("/api/event-types", getEventTypesHandler)
	r.GET("/api/event-types/:id", getEventTypeByIDHandler)
	r.POST("/api/event-types", createEventTypeHandler)
	r.PUT("/api/event-types/:id", updateEventTypeHandler)
	r.DELETE("/api/event-types/:id", deleteEventTypeHandler)

	// Athletes CRUD
	r.GET("/api/athletes", getAthletesHandler)
	r.GET("/api/athletes/:id", getAthleteByIDHandler)
	r.GET("/api/athletes/:id/results", getAthleteResultsHandler)
	r.POST("/api/athletes", createAthleteHandler)
	r.PUT("/api/athletes/:id", updateAthleteHandler)
	r.DELETE("/api/athletes/:id", deleteAthleteHandler)

	// Meets CRUD
	r.GET("/api/meets", getMeetsHandler)
	r.GET("/api/meets/:id", getMeetByIDHandler)
	r.GET("/api/meets/:id/results", getResultsByMeetHandler)
	r.POST("/api/meets", createMeetHandler)
	r.PUT("/api/meets/:id", updateMeetHandler)
	r.DELETE("/api/meets/:id", deleteMeetHandler)

	// Results CRUD
	r.GET("/api/results", getResultsHandler)
	r.GET("/api/results/top10", getTopTenFastestHandler)
	r.POST("/api/results", createResultHandler)
	r.PUT("/api/results/:id", updateResultHandler)
	r.DELETE("/api/results/:id", deleteResultHandler)

	// Auth
	r.POST("/api/login", loginHandler)

	r.Run(":8080")
}

func healthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

// =====================
// EVENT TYPES HANDLERS
// =====================

func getEventTypesHandler(c *gin.Context) {
	eventTypes, err := queries.GetAllEventTypes(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	result := make([]gin.H, len(eventTypes))
	for i, et := range eventTypes {
		result[i] = gin.H{
			"id":          et.ID,
			"name":        et.Name,
			"distance":    et.Distance.String,
			"description": et.Description.String,
		}
	}
	c.JSON(http.StatusOK, result)
}

func getEventTypeByIDHandler(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid event type ID"})
		return
	}

	et, err := queries.GetEventTypeByID(c.Request.Context(), int32(id))
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Event type not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":          et.ID,
		"name":        et.Name,
		"distance":    et.Distance.String,
		"description": et.Description.String,
	})
}

type EventTypeRequest struct {
	Name        string `json:"name" binding:"required"`
	Distance    string `json:"distance"`
	Description string `json:"description"`
}

func createEventTypeHandler(c *gin.Context) {
	var req EventTypeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := queries.CreateEventType(c.Request.Context(), db.CreateEventTypeParams{
		Name:        req.Name,
		Distance:    sql.NullString{String: req.Distance, Valid: req.Distance != ""},
		Description: sql.NullString{String: req.Description, Valid: req.Description != ""},
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	id, _ := result.LastInsertId()
	c.JSON(http.StatusCreated, gin.H{
		"id":          id,
		"name":        req.Name,
		"distance":    req.Distance,
		"description": req.Description,
	})
}

func updateEventTypeHandler(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid event type ID"})
		return
	}

	var req EventTypeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = queries.UpdateEventType(c.Request.Context(), db.UpdateEventTypeParams{
		ID:          int32(id),
		Name:        req.Name,
		Distance:    sql.NullString{String: req.Distance, Valid: req.Distance != ""},
		Description: sql.NullString{String: req.Description, Valid: req.Description != ""},
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":          id,
		"name":        req.Name,
		"distance":    req.Distance,
		"description": req.Description,
	})
}

func deleteEventTypeHandler(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid event type ID"})
		return
	}

	err = queries.DeleteEventType(c.Request.Context(), int32(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Event type deleted"})
}

// =====================
// ATHLETES HANDLERS
// =====================

func getAthletesHandler(c *gin.Context) {
	athletes, err := queries.GetAllAthletes(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

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
			"id":          r.ID,
			"athleteId":   r.AthleteID,
			"meetId":      r.MeetID,
			"eventTypeId": r.EventTypeID.Int32,
			"event":       r.EventName.String,
			"time":        r.Time,
			"place":       r.Place.Int32,
			"meetName":    r.MeetName,
			"meetDate":    r.MeetDate.Format("January 2, 2006"),
		}
	}
	c.JSON(http.StatusOK, response)
}

type AthleteRequest struct {
	Name           string `json:"name" binding:"required"`
	Grade          int32  `json:"grade" binding:"required"`
	PersonalRecord string `json:"personalRecord"`
	Events         string `json:"events"`
}

func createAthleteHandler(c *gin.Context) {
	var req AthleteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := queries.CreateAthlete(c.Request.Context(), db.CreateAthleteParams{
		Name:           req.Name,
		Grade:          req.Grade,
		PersonalRecord: sql.NullString{String: req.PersonalRecord, Valid: req.PersonalRecord != ""},
		Events:         sql.NullString{String: req.Events, Valid: req.Events != ""},
	})
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

func updateAthleteHandler(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid athlete ID"})
		return
	}

	var req AthleteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = queries.UpdateAthlete(c.Request.Context(), db.UpdateAthleteParams{
		ID:             int32(id),
		Name:           req.Name,
		Grade:          req.Grade,
		PersonalRecord: sql.NullString{String: req.PersonalRecord, Valid: req.PersonalRecord != ""},
		Events:         sql.NullString{String: req.Events, Valid: req.Events != ""},
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":             id,
		"name":           req.Name,
		"grade":          req.Grade,
		"personalRecord": req.PersonalRecord,
		"events":         req.Events,
	})
}

func deleteAthleteHandler(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid athlete ID"})
		return
	}

	err = queries.DeleteAthlete(c.Request.Context(), int32(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Athlete deleted"})
}

// =====================
// MEETS HANDLERS
// =====================

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
			"time":        m.Time.String,
			"location":    m.Location.String,
			"description": m.Description.String,
		}
	}
	c.JSON(http.StatusOK, result)
}

func getMeetByIDHandler(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid meet ID"})
		return
	}

	meet, err := queries.GetMeetByID(c.Request.Context(), int32(id))
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Meet not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":          meet.ID,
		"name":        meet.Name,
		"date":        meet.Date.Format("2006-01-02"),
		"time":        meet.Time.String,
		"location":    meet.Location.String,
		"description": meet.Description.String,
	})
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
			"eventTypeId": r.EventTypeID.Int32,
			"event":       r.EventName.String,
			"time":        r.Time,
			"place":       r.Place.Int32,
		}
	}
	c.JSON(http.StatusOK, response)
}

type MeetRequest struct {
	Name        string `json:"name" binding:"required"`
	Date        string `json:"date" binding:"required"`
	Time        string `json:"time"`
	Location    string `json:"location"`
	Description string `json:"description"`
}

func createMeetHandler(c *gin.Context) {
	var req MeetRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := dbConn.ExecContext(c.Request.Context(),
		"INSERT INTO meets (name, date, time, location, description) VALUES (?, ?, ?, ?, ?)",
		req.Name, req.Date, req.Time, req.Location, req.Description)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	id, _ := result.LastInsertId()
	c.JSON(http.StatusCreated, gin.H{
		"id":          id,
		"name":        req.Name,
		"date":        req.Date,
		"time":        req.Time,
		"location":    req.Location,
		"description": req.Description,
	})
}

func updateMeetHandler(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid meet ID"})
		return
	}

	var req MeetRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err = dbConn.ExecContext(c.Request.Context(),
		"UPDATE meets SET name = ?, date = ?, time = ?, location = ?, description = ? WHERE id = ?",
		req.Name, req.Date, req.Time, req.Location, req.Description, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":          id,
		"name":        req.Name,
		"date":        req.Date,
		"time":        req.Time,
		"location":    req.Location,
		"description": req.Description,
	})
}

func deleteMeetHandler(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid meet ID"})
		return
	}

	err = queries.DeleteMeet(c.Request.Context(), int32(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Meet deleted"})
}

// =====================
// RESULTS HANDLERS
// =====================

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
				"id":    r.AthleteID,
				"name":  r.AthleteName,
				"time":  r.Time,
				"event": r.EventName.String,
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
			"event":        r.EventName.String,
		}
	}
	c.JSON(http.StatusOK, response)
}

type ResultRequest struct {
	AthleteID   int32 `json:"athleteId" binding:"required"`
	MeetID      int32 `json:"meetId" binding:"required"`
	EventTypeID int32 `json:"eventTypeId" binding:"required"`
	Time        string `json:"time" binding:"required"`
	Place       int32  `json:"place"`
}

func createResultHandler(c *gin.Context) {
	var req ResultRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := queries.CreateResult(c.Request.Context(), db.CreateResultParams{
		AthleteID:   req.AthleteID,
		MeetID:      req.MeetID,
		EventTypeID: sql.NullInt32{Int32: req.EventTypeID, Valid: req.EventTypeID > 0},
		Time:        req.Time,
		Place:       sql.NullInt32{Int32: req.Place, Valid: req.Place > 0},
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	id, _ := result.LastInsertId()
	c.JSON(http.StatusCreated, gin.H{
		"id":          id,
		"athleteId":   req.AthleteID,
		"meetId":      req.MeetID,
		"eventTypeId": req.EventTypeID,
		"time":        req.Time,
		"place":       req.Place,
	})
}

func updateResultHandler(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid result ID"})
		return
	}

	var req ResultRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = queries.UpdateResult(c.Request.Context(), db.UpdateResultParams{
		ID:          int32(id),
		AthleteID:   req.AthleteID,
		MeetID:      req.MeetID,
		EventTypeID: sql.NullInt32{Int32: req.EventTypeID, Valid: req.EventTypeID > 0},
		Time:        req.Time,
		Place:       sql.NullInt32{Int32: req.Place, Valid: req.Place > 0},
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":          id,
		"athleteId":   req.AthleteID,
		"meetId":      req.MeetID,
		"eventTypeId": req.EventTypeID,
		"time":        req.Time,
		"place":       req.Place,
	})
}

func deleteResultHandler(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid result ID"})
		return
	}

	err = queries.DeleteResult(c.Request.Context(), int32(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Result deleted"})
}

// =====================
// AUTH HANDLERS
// =====================

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

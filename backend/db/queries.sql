-- =====================
-- EVENT TYPES
-- =====================

-- name: GetAllEventTypes :many
SELECT id, name, distance, description, created_at, updated_at
FROM event_types
ORDER BY name;

-- name: GetEventTypeByID :one
SELECT id, name, distance, description, created_at, updated_at
FROM event_types
WHERE id = ?;

-- name: CreateEventType :execresult
INSERT INTO event_types (name, distance, description)
VALUES (?, ?, ?);

-- name: UpdateEventType :exec
UPDATE event_types
SET name = ?, distance = ?, description = ?
WHERE id = ?;

-- name: DeleteEventType :exec
DELETE FROM event_types WHERE id = ?;

-- =====================
-- ATHLETES
-- =====================

-- name: GetAllAthletes :many
SELECT id, name, grade, personal_record, events, created_at, updated_at
FROM athletes
ORDER BY name;

-- name: GetAthleteByID :one
SELECT id, name, grade, personal_record, events, created_at, updated_at
FROM athletes
WHERE id = ?;

-- name: CreateAthlete :execresult
INSERT INTO athletes (name, grade, personal_record, events)
VALUES (?, ?, ?, ?);

-- name: UpdateAthlete :exec
UPDATE athletes
SET name = ?, grade = ?, personal_record = ?, events = ?
WHERE id = ?;

-- name: DeleteAthlete :exec
DELETE FROM athletes WHERE id = ?;

-- =====================
-- MEETS
-- =====================

-- name: GetAllMeets :many
SELECT id, name, date, time, location, description, created_at, updated_at
FROM meets
ORDER BY date;

-- name: GetMeetByID :one
SELECT id, name, date, time, location, description, created_at, updated_at
FROM meets
WHERE id = ?;

-- name: CreateMeet :execresult
INSERT INTO meets (name, date, time, location, description)
VALUES (?, ?, ?, ?, ?);

-- name: UpdateMeet :exec
UPDATE meets
SET name = ?, date = ?, time = ?, location = ?, description = ?
WHERE id = ?;

-- name: DeleteMeet :exec
DELETE FROM meets WHERE id = ?;

-- =====================
-- RESULTS
-- =====================

-- name: GetMeetResults :many
SELECT
    r.id,
    r.athlete_id,
    r.meet_id,
    r.event_type_id,
    r.time,
    r.place,
    r.created_at,
    a.name as athlete_name,
    et.name as event_name
FROM results r
JOIN athletes a ON r.athlete_id = a.id
LEFT JOIN event_types et ON r.event_type_id = et.id
WHERE r.meet_id = ?
ORDER BY r.place;

-- name: GetAthleteResults :many
SELECT
    r.id,
    r.athlete_id,
    r.meet_id,
    r.event_type_id,
    r.time,
    r.place,
    r.created_at,
    m.name as meet_name,
    m.date as meet_date,
    et.name as event_name
FROM results r
JOIN meets m ON r.meet_id = m.id
LEFT JOIN event_types et ON r.event_type_id = et.id
WHERE r.athlete_id = ?
ORDER BY m.date DESC;

-- name: GetResultByID :one
SELECT
    r.id,
    r.athlete_id,
    r.meet_id,
    r.event_type_id,
    r.time,
    r.place,
    r.created_at,
    a.name as athlete_name,
    m.name as meet_name,
    et.name as event_name
FROM results r
JOIN athletes a ON r.athlete_id = a.id
JOIN meets m ON r.meet_id = m.id
LEFT JOIN event_types et ON r.event_type_id = et.id
WHERE r.id = ?;

-- name: CreateResult :execresult
INSERT INTO results (athlete_id, meet_id, event_type_id, time, place)
VALUES (?, ?, ?, ?, ?);

-- name: UpdateResult :exec
UPDATE results
SET athlete_id = ?, meet_id = ?, event_type_id = ?, time = ?, place = ?
WHERE id = ?;

-- name: DeleteResult :exec
DELETE FROM results WHERE id = ?;

-- name: GetAllResults :many
SELECT
    r.id,
    r.athlete_id,
    r.meet_id,
    r.event_type_id,
    r.time,
    r.place,
    r.created_at,
    a.name as athlete_name,
    m.name as meet_name,
    m.date as meet_date,
    et.name as event_name
FROM results r
JOIN athletes a ON r.athlete_id = a.id
JOIN meets m ON r.meet_id = m.id
LEFT JOIN event_types et ON r.event_type_id = et.id
ORDER BY m.date DESC, r.place;

-- name: GetTopTenFastestTimes :many
SELECT
    r.id,
    r.time,
    r.place,
    a.id as athlete_id,
    a.name as athlete_name,
    a.grade as athlete_grade,
    m.id as meet_id,
    m.name as meet_name,
    m.date as meet_date,
    et.name as event_name
FROM results r
JOIN athletes a ON r.athlete_id = a.id
JOIN meets m ON r.meet_id = m.id
LEFT JOIN event_types et ON r.event_type_id = et.id
ORDER BY r.time ASC
LIMIT 10;

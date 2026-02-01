-- name: GetAllAthletes :many
SELECT id, name, grade, personal_record, events, created_at, updated_at
FROM athletes
ORDER BY name;

-- name: GetAthleteByID :one
SELECT id, name, grade, personal_record, events, created_at, updated_at
FROM athletes
WHERE id = ?;

-- name: GetAllMeets :many
SELECT id, name, date, location, description, created_at, updated_at
FROM meets
ORDER BY date;

-- name: GetMeetResults :many
SELECT
    r.id,
    r.athlete_id,
    r.meet_id,
    r.time,
    r.place,
    r.created_at,
    a.name as athlete_name
FROM results r
JOIN athletes a ON r.athlete_id = a.id
WHERE r.meet_id = ?
ORDER BY r.place;

-- name: CreateResult :execresult
INSERT INTO results (athlete_id, meet_id, time, place)
VALUES (?, ?, ?, ?);

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
    m.date as meet_date
FROM results r
JOIN athletes a ON r.athlete_id = a.id
JOIN meets m ON r.meet_id = m.id
ORDER BY r.time ASC
LIMIT 10;

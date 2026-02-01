-- Jones County XC Database Schema
-- MySQL

-- Create database
CREATE DATABASE IF NOT EXISTS jones_county_xc;
USE jones_county_xc;

-- Athletes table
CREATE TABLE athletes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    grade INT NOT NULL CHECK (grade >= 9 AND grade <= 12),
    personal_record VARCHAR(10),
    events VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Meets table
CREATE TABLE meets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Results table (links athletes to meets)
CREATE TABLE results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    athlete_id INT NOT NULL,
    meet_id INT NOT NULL,
    time VARCHAR(10) NOT NULL,
    place INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (athlete_id) REFERENCES athletes(id) ON DELETE CASCADE,
    FOREIGN KEY (meet_id) REFERENCES meets(id) ON DELETE CASCADE,
    UNIQUE KEY unique_athlete_meet (athlete_id, meet_id)
);

-- Indexes for faster queries
CREATE INDEX idx_results_athlete ON results(athlete_id);
CREATE INDEX idx_results_meet ON results(meet_id);
CREATE INDEX idx_meets_date ON meets(date);

-- Sample data
INSERT INTO athletes (name, grade, personal_record, events) VALUES
    ('Marcus Johnson', 12, '16:42', '5K, 3200m'),
    ('Emily Chen', 11, '19:15', '5K'),
    ('David Williams', 10, '17:28', '5K, 1600m'),
    ('Sarah Martinez', 12, '20:03', '5K'),
    ('Jake Thompson', 9, '18:55', '5K, 3200m');

INSERT INTO meets (name, date, location, description) VALUES
    ('Jones County Invitational', '2026-02-15', 'Gray, GA', 'Home meet at Jones County High School'),
    ('Region 4-AAAAA Championship', '2026-02-22', 'Macon, GA', 'Regional championship qualifier'),
    ('State Qualifier', '2026-03-01', 'Atlanta, GA', 'Top 10 advance to state finals'),
    ('GHSA State Championship', '2026-03-08', 'Carrollton, GA', 'Georgia High School State Championship');

INSERT INTO results (athlete_id, meet_id, time, place) VALUES
    (1, 1, '16:58', 1),
    (3, 1, '17:45', 2),
    (5, 1, '19:12', 3),
    (2, 1, '19:32', 4),
    (4, 1, '20:15', 5),
    (1, 2, '16:42', 1),
    (3, 2, '17:28', 2);

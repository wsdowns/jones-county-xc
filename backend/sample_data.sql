-- Sample Data for Jones County XC
-- Realistic Georgia high school cross country data

USE jones_county_xc;

-- Clear existing data
DELETE FROM results;
DELETE FROM meets;
DELETE FROM athletes;

-- Reset auto-increment
ALTER TABLE athletes AUTO_INCREMENT = 1;
ALTER TABLE meets AUTO_INCREMENT = 1;
ALTER TABLE results AUTO_INCREMENT = 1;

-- Athletes (Jones County High School runners with realistic 5K times)
INSERT INTO athletes (name, grade, personal_record, events) VALUES
    ('Jaylen Carter', 12, '16:24', '5K, 3200m'),
    ('Miguel Rodriguez', 12, '16:51', '5K, 1600m'),
    ('Ethan Brooks', 11, '17:08', '5K, 3200m'),
    ('Tyler Washington', 11, '17:32', '5K'),
    ('Noah Patterson', 10, '17:45', '5K, 1600m'),
    ('Caleb Morris', 10, '18:12', '5K'),
    ('Isaiah Green', 9, '18:45', '5K'),
    ('Brandon Lee', 9, '19:22', '5K'),
    ('Emma Sullivan', 12, '19:45', '5K, 3200m'),
    ('Olivia Chen', 11, '20:18', '5K, 1600m'),
    ('Sophia Williams', 11, '20:42', '5K'),
    ('Ava Martinez', 10, '21:15', '5K'),
    ('Madison Taylor', 10, '21:38', '5K'),
    ('Chloe Anderson', 9, '22:05', '5K');

-- Meets (Real Georgia locations and events)
INSERT INTO meets (name, date, location, description) VALUES
    ('Jones County Time Trial', '2026-08-15', 'Gray, GA', 'Pre-season time trial at Jones County High School'),
    ('Peach State Invitational', '2026-09-05', 'Macon, GA', 'Season opener at Central City Park'),
    ('Panther Creek Invitational', '2026-09-12', 'Stockbridge, GA', 'Hosted by Stockbridge High School'),
    ('Carrollton Orthopedic Invitational', '2026-09-19', 'Carrollton, GA', 'One of Georgia largest XC meets'),
    ('Region 4-AAAAA Championship', '2026-10-22', 'Warner Robins, GA', 'Regional championship at Rigby Field'),
    ('GHSA 5A State Championship', '2026-11-07', 'Carrollton, GA', 'State finals at Carrollton Elementary');

-- Results from Jones County Time Trial (Meet 1)
INSERT INTO results (athlete_id, meet_id, time, place) VALUES
    (1, 1, '16:42', 1),
    (2, 1, '17:05', 2),
    (3, 1, '17:28', 3),
    (4, 1, '17:51', 4),
    (5, 1, '18:02', 5),
    (6, 1, '18:33', 6),
    (7, 1, '19:12', 7),
    (8, 1, '19:45', 8),
    (9, 1, '20:15', 1),
    (10, 1, '20:48', 2),
    (11, 1, '21:05', 3),
    (12, 1, '21:42', 4),
    (13, 1, '22:01', 5),
    (14, 1, '22:38', 6);

-- Results from Peach State Invitational (Meet 2)
INSERT INTO results (athlete_id, meet_id, time, place) VALUES
    (1, 2, '16:31', 3),
    (2, 2, '16:58', 8),
    (3, 2, '17:15', 12),
    (4, 2, '17:42', 18),
    (5, 2, '17:55', 22),
    (9, 2, '20:02', 5),
    (10, 2, '20:35', 9),
    (11, 2, '20:58', 14);

-- Results from Panther Creek Invitational (Meet 3)
INSERT INTO results (athlete_id, meet_id, time, place) VALUES
    (1, 3, '16:24', 2),
    (2, 3, '16:51', 6),
    (3, 3, '17:08', 11),
    (4, 3, '17:35', 19),
    (5, 3, '17:48', 24),
    (6, 3, '18:15', 31),
    (9, 3, '19:52', 4),
    (10, 3, '20:22', 8),
    (11, 3, '20:45', 12),
    (12, 3, '21:18', 18);

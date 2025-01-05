CREATE DATABASE f1telemetry;

USE f1telemetry;

CREATE TABLE drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL,
    name VARCHAR(100) NOT NULL,
    team VARCHAR(100),
    country VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE races (
    id INT AUTO_INCREMENT PRIMARY KEY,
    year INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lap_times (
    id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id INT NOT NULL,
    race_id INT NOT NULL,
    lap_number INT NOT NULL,
    lap_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(id),
    FOREIGN KEY (race_id) REFERENCES races(id)
);

CREATE TABLE telemetry (
    id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id INT NOT NULL,
    race_id INT NOT NULL,
    lap_number INT NOT NULL,
    speed JSON,
    rpm JSON,
    throttle JSON,
    brake JSON,
    time JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(id),
    FOREIGN KEY (race_id) REFERENCES races(id)
);

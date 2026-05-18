-- Airline Management System - Database Schema

-- Module 1 - Authentication
CREATE TABLE users (
    user_id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('passenger', 'admin', 'airline_staff', 'crew_member')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE passengers (
    passenger_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(user_id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    passport_number VARCHAR(50) UNIQUE NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10),
    phone VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Module 2 - Airport Infrastructure
CREATE TABLE airports (
    airport_id UUID PRIMARY KEY,
    iata_code CHAR(3) UNIQUE NOT NULL CHECK (LENGTH(iata_code) = 3),
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE terminals (
    terminal_id UUID PRIMARY KEY,
    airport_id UUID NOT NULL REFERENCES airports(airport_id),
    terminal_name VARCHAR(50) NOT NULL,
    terminal_type VARCHAR(20) NOT NULL CHECK (terminal_type IN ('domestic', 'international')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE gates (
    gate_id UUID PRIMARY KEY,
    terminal_id UUID NOT NULL REFERENCES terminals(terminal_id),
    gate_code VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('available', 'occupied', 'maintenance')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Module 3 - Aircraft & Fleet
CREATE TABLE aircraft_models (
    model_id UUID PRIMARY KEY,
    manufacturer VARCHAR(100) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    total_seats INTEGER NOT NULL CHECK (total_seats > 0),
    range_km INTEGER NOT NULL CHECK (range_km > 0),
    cruise_speed_kmh INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE aircraft (
    aircraft_id UUID PRIMARY KEY,
    model_id UUID NOT NULL REFERENCES aircraft_models(model_id),
    tail_number VARCHAR(20) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'grounded', 'maintenance')),
    manufacture_year INTEGER,
    last_maintenance_at DATE,
    total_flight_hours NUMERIC(10,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE seat_configurations (
    seat_config_id UUID PRIMARY KEY,
    model_id UUID NOT NULL REFERENCES aircraft_models(model_id),
    seat_number VARCHAR(10) NOT NULL,
    cabin_class VARCHAR(20) NOT NULL CHECK (cabin_class IN ('economy', 'business', 'first')),
    seat_type VARCHAR(10) NOT NULL CHECK (seat_type IN ('window', 'middle', 'aisle')),
    has_extra_legroom BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Module 4 - Flight Management
CREATE TABLE routes (
    route_id UUID PRIMARY KEY,
    origin_airport_id UUID NOT NULL REFERENCES airports(airport_id),
    destination_airport_id UUID NOT NULL REFERENCES airports(airport_id),
    distance_km INTEGER NOT NULL CHECK (distance_km > 0),
    estimated_duration_min INTEGER NOT NULL CHECK (estimated_duration_min > 0),
    route_type VARCHAR(20) NOT NULL CHECK (route_type IN ('domestic', 'international')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE flight_schedules (
    flight_id UUID PRIMARY KEY,
    route_id UUID NOT NULL REFERENCES routes(route_id),
    aircraft_id UUID NOT NULL REFERENCES aircraft(aircraft_id),
    gate_id UUID REFERENCES gates(gate_id),
    flight_number VARCHAR(10) NOT NULL,
    departure_time TIMESTAMPTZ NOT NULL,
    arrival_time TIMESTAMPTZ NOT NULL CHECK (arrival_time > departure_time),
    status VARCHAR(20) NOT NULL CHECK (status IN ('scheduled', 'boarding', 'departed', 'landed', 'delayed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE seat_inventory (
    inventory_id UUID PRIMARY KEY,
    flight_id UUID NOT NULL REFERENCES flight_schedules(flight_id),
    seat_config_id UUID NOT NULL REFERENCES seat_configurations(seat_config_id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('available', 'reserved', 'occupied', 'blocked')),
    ticket_id UUID UNIQUE REFERENCES tickets(ticket_id),
    reserved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE flight_status_logs (
    log_id UUID PRIMARY KEY,
    flight_id UUID NOT NULL REFERENCES flight_schedules(flight_id),
    old_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    changed_by VARCHAR(100),
    reason TEXT
);

-- Module 5 - Booking System
CREATE TABLE bookings (
    booking_id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(user_id),
    booking_reference VARCHAR(10) UNIQUE NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount > 0),
    currency CHAR(3) NOT NULL CHECK (currency IN ('INR', 'USD', 'EUR')),
    booking_status VARCHAR(20) NOT NULL CHECK (booking_status IN ('pending', 'confirmed', 'cancelled')),
    booked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tickets (
    ticket_id UUID PRIMARY KEY,
    booking_id UUID NOT NULL REFERENCES bookings(booking_id),
    passenger_id UUID NOT NULL REFERENCES passengers(passenger_id),
    flight_id UUID NOT NULL REFERENCES flight_schedules(flight_id),
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    cabin_class VARCHAR(20) NOT NULL CHECK (cabin_class IN ('economy', 'business', 'first')),
    ticket_price NUMERIC(10,2) NOT NULL CHECK (ticket_price > 0),
    fare_class CHAR(1),
    status VARCHAR(20) NOT NULL CHECK (status IN ('booked', 'checked-in', 'boarded', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payments (
    payment_id UUID PRIMARY KEY,
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(booking_id),
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    currency CHAR(3) NOT NULL CHECK (currency IN ('INR', 'USD', 'EUR')),
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_ref VARCHAR(100) UNIQUE,
    gateway VARCHAR(50),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Module 6 - Crew Management
CREATE TABLE crew_members (
    crew_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(user_id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    crew_type VARCHAR(30) NOT NULL CHECK (crew_type IN ('pilot', 'co-pilot', 'cabin crew', 'purser')),
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_expiry DATE NOT NULL,
    date_of_birth DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE crew_schedules (
    schedule_id UUID PRIMARY KEY,
    crew_id UUID NOT NULL REFERENCES crew_members(crew_id),
    flight_id UUID NOT NULL REFERENCES flight_schedules(flight_id),
    role_on_flight VARCHAR(30) NOT NULL CHECK (role_on_flight IN ('captain', 'first officer', 'lead cabin', 'cabin crew')),
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Module 7 - Baggage
CREATE TABLE baggage (
    baggage_id UUID PRIMARY KEY,
    ticket_id UUID NOT NULL REFERENCES tickets(ticket_id),
    tag_number VARCHAR(20) UNIQUE NOT NULL,
    weight_kg NUMERIC(5,2) NOT NULL CHECK (weight_kg > 0),
    baggage_type VARCHAR(20) NOT NULL CHECK (baggage_type IN ('checked', 'cabin', 'sports', 'fragile')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('checked-in', 'loaded', 'arrived', 'claimed', 'lost')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_flight_schedules_flight_number ON flight_schedules(flight_number);
CREATE INDEX idx_tickets_ticket_number ON tickets(ticket_number);
CREATE INDEX idx_payments_transaction_ref ON payments(transaction_ref);

-- Triggers (example - automatic timestamp update)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('Admin', 'Manager', 'Staff') NOT NULL DEFAULT 'Staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE services (
  id CHAR(36) PRIMARY KEY,
  slug VARCHAR(190) NOT NULL UNIQUE,
  title VARCHAR(190) NOT NULL,
  category VARCHAR(120) NOT NULL,
  excerpt TEXT,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  duration VARCHAR(80),
  benefits JSON,
  image TEXT,
  gallery JSON,
  featured BOOLEAN DEFAULT FALSE,
  seo JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id CHAR(36) PRIMARY KEY,
  slug VARCHAR(190) NOT NULL UNIQUE,
  title VARCHAR(190) NOT NULL,
  category VARCHAR(120) NOT NULL,
  excerpt TEXT,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  compare_at_price DECIMAL(10,2),
  inventory INT NOT NULL DEFAULT 0,
  popularity INT NOT NULL DEFAULT 0,
  ingredients JSON,
  benefits JSON,
  image TEXT,
  gallery JSON,
  reviews JSON,
  featured BOOLEAN DEFAULT FALSE,
  seo JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
  id CHAR(36) PRIMARY KEY,
  service_slug VARCHAR(190) NOT NULL,
  service_title VARCHAR(190) NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(80) NOT NULL,
  payment ENUM('pay_at_spa', 'online', 'deposit') DEFAULT 'pay_at_spa',
  notes TEXT,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id CHAR(36) PRIMARY KEY,
  customer_name VARCHAR(160) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(80) NOT NULL,
  address TEXT NOT NULL,
  payment ENUM('cod', 'card', 'upi') DEFAULT 'upi',
  items JSON NOT NULL,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  status ENUM('pending', 'paid', 'shipped', 'delivered') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
  id CHAR(36) PRIMARY KEY,
  slug VARCHAR(190) NOT NULL UNIQUE,
  title VARCHAR(190) NOT NULL,
  category VARCHAR(120) NOT NULL,
  client VARCHAR(190),
  excerpt TEXT,
  story TEXT,
  result TEXT,
  services_used JSON,
  image TEXT,
  gallery JSON,
  featured BOOLEAN DEFAULT FALSE,
  seo JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE packages (
  id CHAR(36) PRIMARY KEY,
  slug VARCHAR(190) NOT NULL UNIQUE,
  title VARCHAR(190) NOT NULL,
  category VARCHAR(120),
  excerpt TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  cadence VARCHAR(80),
  inclusions JSON,
  image TEXT,
  featured BOOLEAN DEFAULT FALSE
);

CREATE TABLE blogs (
  id CHAR(36) PRIMARY KEY,
  slug VARCHAR(190) NOT NULL UNIQUE,
  title VARCHAR(190) NOT NULL,
  category VARCHAR(120),
  excerpt TEXT,
  content LONGTEXT,
  author VARCHAR(160),
  published_at DATE,
  image TEXT,
  related_services JSON,
  related_products JSON,
  seo JSON
);

CREATE TABLE testimonials (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  service VARCHAR(190),
  quote TEXT,
  rating INT DEFAULT 5,
  image TEXT,
  video_url TEXT,
  featured BOOLEAN DEFAULT FALSE
);

CREATE TABLE gallery (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(190) NOT NULL,
  category VARCHAR(120),
  type ENUM('image', 'video') DEFAULT 'image',
  image TEXT,
  video_url TEXT,
  related_label VARCHAR(160),
  related_href VARCHAR(255)
);

CREATE TABLE team (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  role VARCHAR(160),
  specialization TEXT,
  experience VARCHAR(80),
  bio TEXT,
  image TEXT,
  booking_href VARCHAR(255)
);

CREATE TABLE offers (
  id CHAR(36) PRIMARY KEY,
  slug VARCHAR(190) NOT NULL UNIQUE,
  title VARCHAR(190) NOT NULL,
  excerpt TEXT,
  discount VARCHAR(80),
  ends_at DATETIME,
  image TEXT,
  target_label VARCHAR(160),
  target_href VARCHAR(255),
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE leads (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(80),
  subject VARCHAR(190),
  message TEXT,
  source VARCHAR(120),
  status ENUM('new', 'contacted', 'won', 'lost') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  settings JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

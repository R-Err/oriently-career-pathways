
import Database from 'better-sqlite3';
import { QuizSubmission } from '@/types/quiz';

// Initialize SQLite database
const db = new Database('quiz.db');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS quiz_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    email TEXT NOT NULL,
    city TEXT NOT NULL,
    province TEXT,
    region TEXT,
    country TEXT DEFAULT 'Italy',
    gdpr_consent BOOLEAN NOT NULL DEFAULT 0,
    answers TEXT NOT NULL,
    profile_result TEXT NOT NULL,
    suggested_courses TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS italian_cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city TEXT NOT NULL,
    province TEXT NOT NULL,
    region TEXT NOT NULL,
    country TEXT DEFAULT 'Italy'
  );

  CREATE INDEX IF NOT EXISTS idx_cities_name ON italian_cities(city);
`);

// Insert sample Italian cities data if table is empty
const cityCount = db.prepare('SELECT COUNT(*) as count FROM italian_cities').get() as { count: number };
if (cityCount.count === 0) {
  const insertCity = db.prepare(`
    INSERT INTO italian_cities (city, province, region) VALUES (?, ?, ?)
  `);

  const cities = [
    ['Milano', 'MI', 'Lombardia'],
    ['Roma', 'RM', 'Lazio'],
    ['Napoli', 'NA', 'Campania'],
    ['Torino', 'TO', 'Piemonte'],
    ['Palermo', 'PA', 'Sicilia'],
    ['Genova', 'GE', 'Liguria'],
    ['Bologna', 'BO', 'Emilia-Romagna'],
    ['Firenze', 'FI', 'Toscana'],
    ['Bari', 'BA', 'Puglia'],
    ['Catania', 'CT', 'Sicilia'],
    ['Venezia', 'VE', 'Veneto'],
    ['Verona', 'VR', 'Veneto'],
    ['Messina', 'ME', 'Sicilia'],
    ['Padova', 'PD', 'Veneto'],
    ['Trieste', 'TS', 'Friuli-Venezia Giulia'],
    ['Taranto', 'TA', 'Puglia'],
    ['Brescia', 'BS', 'Lombardia'],
    ['Reggio Calabria', 'RC', 'Calabria'],
    ['Modena', 'MO', 'Emilia-Romagna'],
    ['Prato', 'PO', 'Toscana']
  ];

  for (const city of cities) {
    insertCity.run(city[0], city[1], city[2]);
  }
}

export const submitQuizToDatabase = async (submission: QuizSubmission): Promise<void> => {
  try {
    const stmt = db.prepare(`
      INSERT INTO quiz_submissions (
        first_name, email, city, province, region, country, 
        gdpr_consent, answers, profile_result, suggested_courses
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      submission.firstName,
      submission.email,
      submission.city,
      submission.province || null,
      submission.region || null,
      submission.country || 'Italy',
      submission.gdprConsent ? 1 : 0,
      JSON.stringify(submission.answers),
      JSON.stringify(submission.profile),
      JSON.stringify(submission.suggestedCourses || [])
    );

    console.log('Quiz submitted to database successfully');
  } catch (error) {
    console.error('Error in submitQuizToDatabase:', error);
    throw error;
  }
};

export const getCityData = async (cityName: string): Promise<{ city: string; province: string; region: string; country: string } | null> => {
  try {
    const stmt = db.prepare(`
      SELECT city, province, region, country 
      FROM italian_cities 
      WHERE city LIKE ? 
      LIMIT 1
    `);
    
    const result = stmt.get(`%${cityName}%`) as { city: string; province: string; region: string; country: string } | undefined;
    return result || null;
  } catch (error) {
    console.error('Error fetching city data:', error);
    return null;
  }
};

export const searchCities = async (query: string): Promise<{ city: string; province: string; region: string; country: string }[]> => {
  try {
    const stmt = db.prepare(`
      SELECT city, province, region, country 
      FROM italian_cities 
      WHERE city LIKE ? 
      LIMIT 10
    `);
    
    const results = stmt.all(`%${query}%`) as { city: string; province: string; region: string; country: string }[];
    return results;
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
};

export default db;

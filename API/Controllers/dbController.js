const mysql = require('mysql2');
const config = require('../config/config');

let pool;

// Function to create MySQL connection pool
function createPool() {
  if (pool) {
    // If a pool already exists, return without creating a new one
    return;
  }

  pool = mysql.createPool({
    connectionLimit: 10, // Adjust the limit as per your requirements
    host: config.DB_HOST,
    user: config.DB_USER,
    port: config.DB_PORT,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    authPlugins: {
      mysql_clear_password: () => () => Buffer.from(config.DB_PASSWORD),
    },
  });

  pool.on('connection', (connection) => {
    console.log('Connected to MySQL');
  });

  pool.on('error', (err) => {
    console.error('MySQL connection error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('Retrying connection in 5 seconds...');
      setTimeout(createPool, 5000);
    }
  });
}

// Function to insert data into the 'reports' table
function insertData(data) {
  return new Promise((resolve, reject) => {
    if (!pool) {
      // If the pool is not initialized, create a new pool
      createPool();
    }

    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      const query = 'INSERT INTO reports SET ?';
      connection.query(query, data, (error, results) => {
        connection.release(); // Release the connection back to the pool

        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  });
}

// Function to retrieve all data from the 'reports' table
function getAllData() {
  return new Promise((resolve, reject) => {
    if (!pool) {
      // If the pool is not initialized, create a new pool
      createPool();
    }

    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      const query = 'SELECT * FROM reports';
      connection.query(query, (error, results) => {
        connection.release(); // Release the connection back to the pool

        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  });
}

// Function to get the last LED state for a given location
function getLastLedState(location) {
  return new Promise((resolve, reject) => {
    if (!pool) {
      // If the pool is not initialized, create a new pool
      createPool();
    }

    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      const query = `SELECT LedStatus FROM reports WHERE localizacao = ? ORDER BY Tempo DESC LIMIT 1`;
      connection.query(query, [location], (error, results) => {
        connection.release(); // Release the connection back to the pool

        if (error) {
          reject(error);
          return;
        }

        if (results.length === 0) {
          resolve('No LED state found');
        } else {
          resolve(results[0].LedStatus);
        }
      });
    });
  });
}

// Function to get data by location from the 'reports' table
function getDataByLocation(location) {
  return new Promise((resolve, reject) => {
    if (!pool) {
      // If the pool is not initialized, create a new pool
      createPool();
    }

    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      const query = 'SELECT * FROM reports WHERE localizacao = ?';
      connection.query(query, [location], (error, results) => {
        connection.release(); // Release the connection back to the pool

        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  });
}

// Function to get the last 10 records by location from the 'reports' table
function getLast10RecordsByLocation(location) {
  return new Promise((resolve, reject) => {
    if (!pool) {
      // If the pool is not initialized, create a new pool
      createPool();
    }

    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      const query = `SELECT * FROM reports WHERE localizacao = ? ORDER BY tempo ASC LIMIT 10`;
      connection.query(query, [location], (error, results) => {
        connection.release(); // Release the connection back to the pool

        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  });
}
// Function to get distinct locations from the 'reports' table
function getDistinctLocations() {
  return new Promise((resolve, reject) => {
    if (!pool) {
      // If the pool is not initialized, create a new pool
      createPool();
    }

    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      const query = 'SELECT DISTINCT localizacao FROM reports';
      connection.query(query, (error, results) => {
        connection.release(); // Release the connection back to the pool

        if (error) {
          reject(error);
          return;
        }
        resolve(results.map((result) => result.localizacao));
      });
    });
  });
}

// Function to get the last record of each location from the 'reports' table
function getLastRecordOfEachLocation() {
  return new Promise((resolve, reject) => {
    if (!pool) {
      // If the pool is not initialized, create a new pool
      createPool();
    }

    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      const query = `
        SELECT r.*
        FROM reports r
        INNER JOIN (
          SELECT MAX(Tempo) AS maxTempo, localizacao
          FROM reports
          GROUP BY localizacao
        ) sub
        ON r.localizacao = sub.localizacao AND r.Tempo = sub.maxTempo
      `;

      connection.query(query, (error, results) => {
        connection.release(); // Release the connection back to the pool

        if (error) {
          reject(error);
          return;
        }

        resolve(results);
      });
    });
  });
}

// Function to get distinct locations from the 'reports' table
function getDistinctLocations() {
  return new Promise((resolve, reject) => {
    if (!pool) {
      // If the pool is not initialized, create a new pool
      createPool();
    }

    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      const query = 'SELECT DISTINCT localizacao FROM reports';
      connection.query(query, (error, results) => {
        connection.release(); // Release the connection back to the pool

        if (error) {
          reject(error);
          return;
        }
        resolve(results.map((result) => result.localizacao));
      });
    });
  });
}

// Function to get the last record by location from the 'reports' table
function getLastRecordByLocation(location) {
  return new Promise((resolve, reject) => {
    if (!pool) {
      // If the pool is not initialized, create a new pool
      createPool();
    }

    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      const query = `SELECT * FROM reports WHERE localizacao = ? ORDER BY tempo DESC LIMIT 1`;
      connection.query(query, [location], (error, results) => {
        connection.release(); // Release the connection back to the pool

        if (error) {
          reject(error);
          return;
        }

        if (results.length === 0) {
          resolve(null); // No record found for the location
        } else {
          resolve(results[0]);
        }
      });
    });
  });
}



module.exports = {
  createPool,
  insertData,
  getAllData,
  getLastLedState,
  getDataByLocation,
  getLast10RecordsByLocation,
  getLastRecordOfEachLocation,
  getDistinctLocations,
  getLastRecordByLocation,
};

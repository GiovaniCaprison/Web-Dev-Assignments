// backend
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;
const mysql = require('mysql2');



// Create a connection pool
const pool = mysql.createPool({
    host: '**********',
    user: '*******',
    password: '**********',
    database: '********',
    port: ****
});



// Simple query example
app.get('/test-db', (req, res) => {
    pool.query('SELECT 1 + 1 AS solution', (error, results) => {
        if (error) throw error;
        res.send(`The solution is: ${results[0].solution}`);
    });
});



// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// Basic route for GET request
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the user management API" });
});



// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



// POST route to create a new user
app.post('/createUser', (req, res) => {
    const { title, first_name, surname, full_name, mobile, email_address, addresses } = req.body;

    // First, insert the user's personal information
    const userInsertQuery = `INSERT INTO user_info (title, first_name, surname, full_name, mobile, email_address) VALUES (?, ?, ?, ?, ?, ?)`;

    pool.query(userInsertQuery, [title, first_name, surname, full_name, mobile, email_address], (error, results) => {
        if (error) {
            console.error("Error inserting user info: ", error);
            res.status(500).json({ error: "Database error while creating user" });
            return;
        }

        // Assuming addresses is an array of address objects
        const userId = results.insertId;
        addresses.forEach(address => {
            const { address_line_1, address_line_2, town, county_city, eircode } = address;
            const addressInsertQuery = `INSERT INTO addresses (user_id, address_line_1, address_line_2, town, county_city, eircode) VALUES (?, ?, ?, ?, ?, ?)`;

            pool.query(addressInsertQuery, [userId, address_line_1, address_line_2, town, county_city, eircode], (error) => {
                if (error) {
                    console.error("Error inserting address for user: ", error);
                }
            });
        });

        res.json({ message: "User created successfully", userId });
    });
});


// GET route to fetch user
app.get('/searchUsers', (req, res) => {
    const { name, id } = req.query;

    let searchQuery;
    let queryParams = [];

    if (id) {
        // If an ID is provided, search by user_id
        searchQuery = `
        SELECT user_info.*, addresses.address_line_1, addresses.town, addresses.county_city, addresses.eircode
        FROM user_info
        LEFT JOIN addresses ON user_info.user_id = addresses.user_id
        WHERE user_info.user_id = ?`;
        queryParams = [id];
    } else if (name) {
        // If a name is provided, search by name or surname or full name
        searchQuery = `
        SELECT user_info.*, addresses.address_line_1, addresses.town, addresses.county_city, addresses.eircode
        FROM user_info
        LEFT JOIN addresses ON user_info.user_id = addresses.user_id
        WHERE user_info.first_name LIKE ? OR user_info.surname LIKE ? OR user_info.full_name LIKE ?`;
        queryParams = [`%${name}%`, `%${name}%`, `%${name}%`];
    } else {
        // If neither ID nor name is provided, return a bad request response
        res.status(400).json({ error: "Please specify an ID or a name to search." });
        return;
    }

    pool.query(searchQuery, queryParams, (error, results) => {
        if (error) {
            console.error("Error searching for users: ", error);
            res.status(500).json({ error: "Database error while searching for users" });
            return;
        }

        const usersMap = {}; // Use an object to map user IDs to user objects

        results.forEach(row => {
            if (!usersMap[row.user_id]) {
                usersMap[row.user_id] = {
                    user_id: row.user_id,
                    title: row.title,
                    first_name: row.first_name,
                    surname: row.surname,
                    full_name: `${row.first_name} ${row.surname}`,
                    mobile: row.mobile,
                    email_address: row.email_address,
                    addresses: []
                };
            }

            if (row.address_line_1) {
                usersMap[row.user_id].addresses.push({
                    address_line_1: row.address_line_1,
                    town: row.town,
                    county_city: row.county_city,
                    eircode: row.eircode
                });
            }
        });

        const users = Object.values(usersMap);
        res.json(users);
    });
});


// PUT route to update a user's details
app.put('/updateUser/:userId', (req, res) => {
    const { userId } = req.params;
    const { first_name, last_name, title, mobile, email_address, address } = req.body;

    // Start with the base update query
    let queryValues = [];
    let toUpdate = [];

    // Check which fields are provided and need to be updated
    if (first_name) {
        toUpdate.push("first_name = ?");
        queryValues.push(first_name);
    }
    if (last_name) {
        toUpdate.push("surname = ?");
        queryValues.push(last_name);
    }
    if (title) {
        toUpdate.push("title = ?");
        queryValues.push(title);
    }
    if (mobile) {
        toUpdate.push("mobile = ?");
        queryValues.push(mobile);
    }
    if (email_address) {
        toUpdate.push("email_address = ?");
        queryValues.push(email_address);
    }
    // Now, dynamically building the address update query
    if (address) {
        let addressUpdateQuery = "UPDATE addresses SET ";
        let addressValues = [];
        let addressToUpdate = [];

        if (address.address_line_1) {
            addressToUpdate.push("address_line_1 = ?");
            addressValues.push(address.address_line_1);
        }
        if (address.town) {
            addressToUpdate.push("town = ?");
            addressValues.push(address.town);
        }
        if (address.county_city) {
            addressToUpdate.push("county_city = ?");
            addressValues.push(address.county_city);
        }
        if (address.eircode) {
            addressToUpdate.push("eircode = ?");
            addressValues.push(address.eircode);
        }

        // Finalizing and executing the address update query
        if (addressToUpdate.length > 0) {
            addressUpdateQuery += addressToUpdate.join(", ") + " WHERE user_id = ?";
            addressValues.push(userId);

            pool.query(addressUpdateQuery, addressValues, (error) => {
                if (error) {
                    console.error("Error updating address: ", error);
                    res.status(500).json({ error: "Database error while updating address" });
                    return;
                }

                // Responding after both updates (user and address) are attempted
                res.json({ message: "User and address updated successfully" });
            });
        } else {
            res.json({ message: "User updated successfully, no address changes made" });
        }
    } else {
        res.json({ message: "User updated successfully, no address provided for update" });
    }
});



// DELETE route to delete a user and their addresses
app.delete('/deleteUser/:userId', (req, res) => {
    const { userId } = req.params;

    // First, delete the user's addresses
    const deleteAddressesQuery = `DELETE FROM addresses WHERE user_id = ?`;

    pool.query(deleteAddressesQuery, [userId], (error) => {
        if (error) {
            console.error("Error deleting user's addresses: ", error);
            res.status(500).json({ error: "Database error while deleting user's addresses" });
            return;
        }

        // After successfully deleting addresses, delete the user
        const deleteUserQuery = `DELETE FROM user_info WHERE user_id = ?`;

        pool.query(deleteUserQuery, [userId], (error, results) => {
            if (error) {
                console.error("Error deleting user: ", error);
                res.status(500).json({ error: "Database error while deleting user" });
                return;
            }

            if (results.affectedRows === 0) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            res.json({ message: "User and associated addresses deleted successfully" });
        });
    });
});

// DELETE route to wipe the database
app.delete('/wipeDB', (req, res) => {
    // Example: Wiping user_info and addresses tables
    const wipeQueries = [
        'DELETE FROM addresses',
        'DELETE FROM user_info'
    ];

    // Execute wipe queries in sequence
    wipeQueries.forEach((query, index) => {
        pool.query(query, [], (error) => {
            if (error) {
                console.error("Error wiping database: ", error);
                return res.status(500).json({ error: "Database error during wipe" });
            }
            if(index === wipeQueries.length - 1) {
                res.json({ message: "Database wiped successfully" });
            }
        });
    });
});

// POST route to populate the database with predefined entries
// AKA database dump
app.post('/populateDB', (req, res) => {
    // Predefined entries
    const users = [
        { title: "Mr", first_name: "John", surname: "Doe", mobile: "832-491-8753", email_address: "johndoe1@example.com" },
        { title: "Ms", first_name: "Jane", surname: "Smith", mobile: "765-234-9872", email_address: "janesmith2@example.com" },
        { title: "Mr", first_name: "Mike", surname: "Brown", mobile: "901-462-3571", email_address: "mikebrown3@example.com" },
        { title: "Mrs", first_name: "Emily", surname: "White", mobile: "720-438-9632", email_address: "emilywhite4@example.com" },
        { title: "Mx", first_name: "Alex", surname: "Johnson", mobile: "839-245-1753", email_address: "alexjohnson5@example.com" },
        { title: "Dr", first_name: "Sam", surname: "Wilson", mobile: "812-123-4567", email_address: "samwilson6@example.com" },
        { title: "Mr", first_name: "Luke", surname: "Davis", mobile: "813-234-5678", email_address: "lukedavis7@example.com" },
        { title: "Ms", first_name: "Lara", surname: "Martinez", mobile: "814-345-6789", email_address: "laramartinez8@example.com" },
        { title: "Mrs", first_name: "Emma", surname: "Garcia", mobile: "815-456-7890", email_address: "emmagarcia9@example.com" },
        { title: "Mr", first_name: "Noah", surname: "Miller", mobile: "816-567-8901", email_address: "noahmiller10@example.com" },
        { title: "Dr", first_name: "Olivia", surname: "Martinez", mobile: "817-678-9012", email_address: "oliviamartinez11@example.com" },
        { title: "Mx", first_name: "Charlie", surname: "Garcia", mobile: "818-789-0123", email_address: "charliegarcia12@example.com" },
        { title: "Mr", first_name: "Jacob", surname: "Wilson", mobile: "819-890-1234", email_address: "jacobwilson13@example.com" },
        { title: "Ms", first_name: "Mia", surname: "Brown", mobile: "820-901-2345", email_address: "miabrown14@example.com" },
        { title: "Mrs", first_name: "Amelia", surname: "Davis", mobile: "821-012-3456", email_address: "ameliadavis15@example.com" },
        { title: "Dr", first_name: "Harper", surname: "Lopez", mobile: "822-123-4567", email_address: "harperlopez16@example.com" },
        { title: "Mx", first_name: "Ethan", surname: "Gonzalez", mobile: "823-234-5678", email_address: "ethangonzalez17@example.com" },
        { title: "Mr", first_name: "Mason", surname: "Hernandez", mobile: "824-345-6789", email_address: "masonhernandez18@example.com" },
        { title: "Ms", first_name: "Isabella", surname: "Moore", mobile: "825-456-7890", email_address: "isabellamoore19@example.com" },
        { title: "Mrs", first_name: "Sophia", surname: "Jackson", mobile: "826-567-8901", email_address: "sophiajackson20@example.com" }
    ];

    users.forEach(user => {
        const insertQuery = 'INSERT INTO user_info (title, first_name, surname, mobile, email_address) VALUES (?, ?, ?, ?, ?)';
        pool.query(insertQuery, [user.title, user.first_name, user.surname, user.mobile, user.email_address], (error) => {
            if (error) {
                console.error("Error populating database: ", error);
                return res.status(500).json({ error: "Database error during population" });
            }
        });
    });
    res.json({ message: "Database populated successfully" });
});

// GET route to fetch all users with their addresses
app.get('/getAllUsers', (req, res) => {
    const query = `
        SELECT user_info.*, 
               addresses.address_line_1, addresses.town, addresses.county_city, addresses.eircode 
        FROM user_info 
        LEFT JOIN addresses ON user_info.user_id = addresses.user_id
    `;

    pool.query(query, (error, results) => {
        if (error) {
            console.error("Error fetching users with addresses: ", error);
            return res.status(500).json({ error: "Database error while fetching users" });
        }

        // Organize users by user_id and append addresses
        const users = results.reduce((acc, currentValue) => {
            // Add user and its first address (if exists)
            acc[currentValue.user_id] = {
                user_id: currentValue.user_id,
                title: currentValue.title,
                first_name: currentValue.first_name,
                surname: currentValue.surname,
                mobile: currentValue.mobile,
                email_address: currentValue.email_address,
                addresses: currentValue.address_line_1 ? [{
                    address_line_1: currentValue.address_line_1,
                    town: currentValue.town,
                    county_city: currentValue.county_city,
                    eircode: currentValue.eircode
                }] : []
            };
            return acc;
        }, {});

        // Convert users object back to array
        const usersArray = Object.values(users);
        res.json(usersArray);
    });
});

# Adventure Routes App

This project is a React application designed to manage and view adventure routes. Users can:

· Add new routes with details like start and end points, distance, and route type.
· View a list of added routes.
· Delete existing routes.
· Open routes in Google Maps to visualize them.

## Setup

### Dependencies

- Run `npm install` in project directory. This will install server-related dependencies such as `express`.
- `cd client` and run `npm install`. This will install client dependencies (React).

### Database Prep

- Access the MySQL interface in your terminal by running `mysql -u root -p`
- Create a new database called facebook: `create database routes_db`
- Add a `.env` file to the project folder of this repository containing the MySQL authentication information for MySQL user. For example:

```bash
  DB_HOST=localhost
  DB_USER=root
  DB_NAME=routes_db
  DB_PASS=YOURPASSWORD
```

- Run `npm run migrate` in the project folder of this repository, in a new terminal window. This will create a table called 'students' in your database.

- Verify the structure of the table 
```bash
 use routes_db;
describe routes;
```


### Development

- Run `npm start` in project directory to start the Express server on port 5000
- In another terminal, do `cd client` and run `npm start` to start the client in development mode with hot reloading in port 3000.

## Basic Requirements

Creation of a webpage with the following functionality:

 - [ ] List of Adventure Routes: Display a list of routes with details.
 - [ ] Form to Add Routes: Include fields for start and end points, distance (in km), and route type. 
 - [ ] Submitting the form adds the route to the database and updates the list on the page.
 - [ ] Delete Routes: Each route has a delete button to remove it from the database and update the list.
 - [ ] Google Maps Integration: Each route has a button to view it on Google Maps.
 Styling: Use the provided color scheme and fonts for a polished look.


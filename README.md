# Roster API

- Create a MongoDB cluster and hook it to this app
- Review User model. What attributes a user has?
- Review UserDao and user route handlers. 
  - At which level of abstraction error handling occurs? 
- Write Postman request for every route (no need to make erroneous requests).
- Review `src/debug.js` file. How can you enable printing debug messages?
- Review the tests. Are there any missing tests?
  - Add one test for each missing test category!
- Open `package.json` and review it!
  - What are `cors` and `helmet` under dependencies?
  - What does `prettier` (under dev dependencies) do?
- Add a `password` field to the User model. 
    - Update the corresponding tests (add one test to each category of tests).
    - What requirements will you have for the password?
- Update UserDao to account for the newly added (`password`) attribute to User schema.
    - Update the corresponding tests (add one test to each category of tests).
- Update user route handlers to account for the updates made to UserDao.
    - Update the corresponding tests (add one test to each category of tests).
    
- Create an `auth` route for users to "login" provided their email and password!
  - As for the response, send a message that login was successful or not.
  - Make a Postman request for this new route.
  - Write tests for this new route.

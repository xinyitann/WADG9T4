# WAD2-G9T4

## Project Overview
This web application 'One Stop Planner' seeks to address the concerns an everyday commuter might have; route planning, journey time etc.
In this project, we aim to build a web-based one-stop portal for Singaporeans that travel via public transportation or their personal cars. There are many applications out there that provide Singaporeans the timing of their buses to plan their trip and the route of the bus. However, even though there are applications out there that cater to public transportation there is no one stop solution that caters to both public and private transportation. 

## How to Use Our Web Application (for Visitors to our Website)
User registration, authentication and log in.
User profile (password, email, favourites)
5 different tabs  (Home,  Bus, Taxi, Car and Traffic)

### Home
The main homepage with a Search bar with directions to users' destination. All the information is given by Google Maps API.
Click on the button to check traffic status to show possible traffic obstructions in users' journey.

### Bus
Users can search for bus services or bus stops for their arrival time.
Users can add their favourite bus services or bus stops to their profile.

### Taxi
Users can check for taxis near them.

### Car
Users can check for carpark availability.

### Traffic
Users can see the current traffic conditions in Singapore.

## How to Install and Run Our Web Application (for Developers)
Instructions for Windows:
Ensure that nodejs version 18.10.0 and npm version 8.19.2 is installed on the device.

1. To check, run node -v and npm -v in the command terminal
2. If node is not found, search windows for advanced systems settings --> environment variabless --> new , with name being nodejs and directory being where the nodejs folder is

Navigate to the ?? directory using the terminal, and from within that directory, run npm install inside the terminal
Create a file in the ?? directory called "??.js" and paste the data from the following link ??
Run npm run serve to startup the app
click on the localhost link to view the app

## Other Cool Things we did
### X-Factors
1. Google Maps API 
 API provides information for the search box, map and directions. It allows for markers to be placed on the map.
2. LTA API
 API provides information for bus arrival timings, bus stop locations, taxi stands, carpark availability
3. User authentication in firebase
4. User information storage in firebase
5. Deployment of app in firebase

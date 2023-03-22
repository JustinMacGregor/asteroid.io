# Asteroid.io

[Play here](https://justinmacgregor.github.io/asteroid.io/)

A browser-based version of the classic game Asteroids. This project is a demonstration of my skills in programming and game development, specifically in utilizing various gameplay programming methods.

### Gameplay Programming Methods
#### Physics Engine
Asteroid.io uses a simple circle collision technique to detect collisions between game objects such as the player's ship, bullets, and asteroids. The technique calculates the distance between the centers of the two circles and compares it to the sum of their radii. If the distance is less than or equal to the sum of their radii, a collision is detected. The technique is efficient and works well for circular objects like the asteroids in the game. However, it may not be as accurate for irregularly shaped objects. Despite its limitations, the collision technique used in asteroid.io is effective in creating engaging gameplay and challenging the player to avoid collisions with the asteroids.

#### Object-Oriented Programming
To organize the game's code and create modular components, I utilized object-oriented programming principles. Each game object, such as the player's ship or the asteroids, is its own class with its own properties and methods. This approach allowed for easy modification of each object's behavior and simplified the overall structure of the game code.

#### Event-Driven Programming
To handle game events such as the player shooting a bullet or an asteroid being destroyed, I utilized event-driven programming. Each game event is handled by a listener function that is triggered when the event occurs. This approach allowed for a more flexible and dynamic game experience, as events could be easily added or modified.

#### General Programming Methods Used
In addition to the gameplay programming methods mentioned above, I also utilized various general programming methods in developing Asteroid.io. These include:

#### HTML, CSS, and JavaScript
Asteroid.io is a browser-based game built using standard web development languages. HTML was used to structure the game's UI elements, CSS was used to style these elements, and JavaScript was used to handle game logic and physics calculations.

#### Cordova
To package Asteroid.io as a mobile app, I utilized Cordova. This allowed me to convert the browser-based game into a native app that can be installed on both iOS and Android devices.

#### Installation
To install Asteroid.io as a Cordova app, follow these steps:

Clone the repository from GitHub: git clone `https://github.com/yourusername/asteroid.io.git`
Install Cordova globally: `npm install -g cordova`
Navigate to the asteroid.io directory: `cd asteroid.io`
Install dependencies: `npm install`
Add the platforms you want to build for: `cordova platform add ios` or `cordova platform add android`
Build the app: `cordova build`
Run the app on a device emulator:` cordova emulate ios` or `cordova emulate android`
Alternatively, you can run the game in a web browser by opening index.html in the `www` directory.

Conclusion
Asteroid.io is a fun and challenging game that showcases my skills in gameplay programming and general programming techniques. Whether you're a computer science student or a seasoned game developer, I hope you enjoy playing Asteroid.io as much as I enjoyed creating it!

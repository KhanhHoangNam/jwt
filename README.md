# Authentication
# Create a new database with mongo:
* mkdir mongodb (if non-exits)
* mongod --dbpath ./home/user_directory/mongodb --port 27018 
* Conect from client:
* mongo --port 27018
* use db
* db.createUser({user:"your_name", pwd:"123456", roles: ["readWrite", "dbAdmin", "dbOwner"]});
# Restart server:

* mongod --dbpath ./home/user_directory/mongodb --port 27018 --auth
# Conect againt from client:

* mongo --port 27017 -u "your_name" -p "123456" --authenticationDatabase "db"
# For quickly this tutorials, you can open list of API for test


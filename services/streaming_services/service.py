from flask import Flask, jsonify
import mysql.connector as mysql

service = Flask(__name__)

DEBUG = True

MYSQL_SERVER = "databases"
MYSQL_USER = "root"
MYSQL_PASS = 'admin'
MYSQL_BD = "movietrine"

def get_connection_bd():
    connection = mysql.connect(host = MYSQL_SERVER, user = MYSQL_USER,password = MYSQL_PASS,database = MYSQL_BD)
    return connection

def generate_service(register):
    service_streaming = {
        "_id": register["id"],
        "name": register["name"],
        "avatar": register["avatar"]
    }
    return service_streaming

@service.route("/isalive")
def is_alive():
    return jsonify(alive=IS_ALIVE)

@service.route("/streaming_services")
def get_services():
    services = []

    connection = get_connection_bd()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("select id, name, avatar from Services")
    result = cursor.fetchall()
    for register in result:
        services.append(generate_service(register))

    return jsonify(services)


if __name__ == "__main__":
    service.run(
        host="0.0.0.0",
        port="5001",
        debug=DEBUG
    )
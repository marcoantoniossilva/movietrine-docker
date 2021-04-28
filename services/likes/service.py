from flask import Flask, jsonify
import mysql.connector as mysql

service = Flask(__name__)

IS_ALIVE = "yes"
DEBUG = True

MYSQL_SERVER = "databases"
MYSQL_USER = "root"
MYSQL_PASS = 'admin'
MYSQL_BD = "movietrine"

def get_connection_bd():
    connection = mysql.connect(host = MYSQL_SERVER, user = MYSQL_USER,password = MYSQL_PASS,database = MYSQL_BD)
    return connection

@service.route("/isalive")
def is_alive():
    return jsonify(alive=IS_ALIVE)

@service.route("/liked/<string:account>/<string:movie_id>")
def user_liked(account,movie_id):
    likes_num = 0

    connection = get_connection_bd()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("select count(*) as likes_num from Likes "+
        "where email = '"+account+"' and movie_id = "+movie_id)
    register = cursor.fetchone()
    if register:
        likes_num = register['likes_num']
    
    return jsonify(likes = likes_num)

@service.route("/like/<string:account>/<string:movie_id>")
def like(account,movie_id):
    result = jsonify(status='ok', error='')

    connection = get_connection_bd()
    cursor = connection.cursor()
    try:
        cursor.execute(
            f"insert into Likes (movie_id,email) values ({movie_id},'{account}')"
        )
        connection.commit()
    except:
        connection.rollback()
        result = jsonify(status='error', error='erro ao adicionar like')
    
    return result

@service.route("/unlike/<string:account>/<string:movie_id>")
def unlike(account,movie_id):
    result = jsonify(status='ok', error='')

    connection = get_connection_bd()
    cursor = connection.cursor()
    try:
        cursor.execute(
            f"delete from Likes where movie_id = {movie_id} and email = '{account}'"
        )
        connection.commit()
    except:
        connection.rollback()
        result = jsonify(status='error', error='erro ao remover like')
    
    return result

if __name__ == "__main__":
    service.run(
        host="0.0.0.0",
        port="5003",
        debug=DEBUG
    )
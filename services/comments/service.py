from flask import Flask, jsonify
import mysql.connector as mysql

service = Flask(__name__)

IS_ALIVE = "yes"
DEBUG = True
PAGE_SIZE = 8

MYSQL_SERVER = "databases"
MYSQL_USER = "root"
MYSQL_PASS = 'admin'
MYSQL_BD = "movietrine"

def get_connection_bd():
    connection = mysql.connect(host = MYSQL_SERVER, user = MYSQL_USER,password = MYSQL_PASS,database = MYSQL_BD)
    return connection

def generateComment(register):
    comment = {
        "_id":register["id"],
        "movieId":register["movie_id"],
        "user":{
            "email": register["account"],
            "name": register["name"]
        },
        "datetime": register["date"],
        "content":register["comment"]
    }

    return comment

@service.route("/isalive")
def is_alive():
    return jsonify(alive=IS_ALIVE)

@service.route("/comments/<string:movie_id>/<int:page>")
def getComments(movie_id,page):
    comments = []
    connection = get_connection_bd()
    cursor = connection.cursor(dictionary=True)
    cursor.execute(
        "select id, movie_id, comment, name, account, DATE_FORMAT(date,'%Y-%m-%d %T') as date "+
        "from Comments "+
        "where movie_id = "+movie_id+ " order by date desc "+
        "limit "+ str((page-1)*PAGE_SIZE) + ", " + str(PAGE_SIZE))
    result = cursor.fetchall()
    for register in result:
        comments.append(generateComment(register))


    return jsonify(comments)

@service.route("/comments/add/<string:movie_id>/<string:user_name>/<string:account>/<string:comment>")
def getAddComment(movie_id,user_name,account,comment):
    result = jsonify(status='ok', error='')

    connection = get_connection_bd()
    cursor = connection.cursor()
    try:
        cursor.execute(f"insert into Comments (movie_id,comment,name,account,date) values ({movie_id},'{comment}','{user_name}','{account}',NOW())")
        connection.commit()
    except:
        connection.rollback()
        result = jsonify(status='error', error='erro ao adicionar comentário')
    
    return result

@service.route("/comments/remove/<string:comment_id>")
def getRemoveComment(comment_id):
    result = jsonify(status='ok', error='')

    connection = get_connection_bd()
    cursor = connection.cursor()
    try:
        cursor.execute(
            f"delete from Comments where id = {comment_id}"
        )
        connection.commit()
    except:
        connection.rollback()
        result = jsonify(status='error', error='erro ao remover comentário')
    
    return result

if __name__ == "__main__":
    service.run(
        host="0.0.0.0",
        port="5002",
        debug=DEBUG
    )
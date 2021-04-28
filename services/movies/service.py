from flask import Flask, jsonify
import mysql.connector as mysql

service = Flask(__name__)

IS_ALIVE = "yes"
DEBUG = True
PAGE_SIZE = 4

MYSQL_SERVER = "databases"
MYSQL_USER = "root"
MYSQL_PASS = 'admin'
MYSQL_BD = "movietrine"

def get_connection_bd():
    connection = mysql.connect(host = MYSQL_SERVER, user = MYSQL_USER,password = MYSQL_PASS,database = MYSQL_BD)
    return connection

def generate_movie(register):
    print(register["service_id"])
    movie = {
        "_id": register["feed_id"],
        "datetime": register["date"],
        "movie":{
            "_id":register["movie_id"],
            "name": register["movie_name"],
            "description":register["movie_description"],
            "genre": register["movie_genre"],
            "year": register["movie_year"],
            "cast": register["movie_cast"],
            "director": register["movie_director"],
            "url": register["movie_url"],
        },
        "likes":register["likes"],
        "service":{
            "_id":register["service_id"],
            "name":register["service_name"],
            "avatar":register["service_avatar"]
        },
    }

    return movie

def get_total_likes(feed_id):
    likes = 0
    connection = get_connection_bd()
    cursor = connection.cursor(dictionary=True)
    cursor.execute(f"select count(*) as likes_num from Likes where movie_id = {feed_id}")
    result = cursor.fetchone()

    if result:
        likes = result["likes_num"]

    return likes

@service.route("/isalive")
def is_alive():
    return jsonify(alive=IS_ALIVE)


@service.route("/movies/<int:page>")
def get_movies(page):
    movies = []

    connection = get_connection_bd()
    cursor = connection.cursor(dictionary=True)
    cursor.execute(
        "Select Feeds.id as feed_id, DATE_FORMAT(Feeds.date,'%Y-%m-%d %T') as date, "+
        "Services.id as service_id, Services.name as service_name, Services.avatar as service_avatar, "+
        "Movies.genre as movie_genre, Movies.year as movie_year, Movies.cast as movie_cast, "+
        "Movies.director as movie_director, Movies.id as movie_id, "+
        "Movies.name as movie_name, Movies.description as movie_description, Movies.url as movie_url " +
        "from Feeds, Movies, Services "+
        "where Movies.id = Feeds.movie_id "+
        "and Services.id = Movies.service_id "+
        "order by date desc " +
        "limit "+ str((page-1)*PAGE_SIZE) + ", " + str(PAGE_SIZE))
    result = cursor.fetchall()
    for register in result:
        register["likes"] = get_total_likes(register["feed_id"])
        movies.append(generate_movie(register))
    return jsonify(movies)

@service.route("/movie/<string:movie_id>")
def get_movie(movie_id):
    movie = []

    connection = get_connection_bd()
    cursor = connection.cursor(dictionary=True)
    cursor.execute(
        "Select Feeds.id as feed_id, DATE_FORMAT(Feeds.date,'%Y-%m-%d %T') as date, "+
        "Services.id as service_id, Services.name as service_name, Services.avatar as service_avatar, "+
        "Movies.genre as movie_genre, Movies.year as movie_year, Movies.cast as movie_cast, "+
        "Movies.director as movie_director, Movies.id as movie_id, "+
        "Movies.name as movie_name, Movies.description as movie_description, Movies.url as movie_url " +
        "from Feeds, Movies, Services "+
        "where Movies.id = Feeds.movie_id "+
        "and Services.id = Movies.service_id "+
        "and Movies.id = "+movie_id+" ")
    register = cursor.fetchone()

    if register:
        register["likes"] = get_total_likes(register["feed_id"])
        movie = generate_movie(register)
    return jsonify(movie)

@service.route("/movies_name/<string:movie_name>/<int:page>")
def get_movie_by_name(movie_name, page):
    movies = []

    connection = get_connection_bd()
    cursor = connection.cursor(dictionary=True)
    cursor.execute(
        "Select Feeds.id as feed_id, DATE_FORMAT(Feeds.date,'%Y-%m-%d %T') as date, "+
        "Services.id as service_id, Services.name as service_name, Services.avatar as service_avatar, "+
        "Movies.genre as movie_genre, Movies.year as movie_year, Movies.cast as movie_cast, "+
        "Movies.director as movie_director, Movies.id as movie_id, "+
        "Movies.name as movie_name, Movies.description as movie_description, Movies.url as movie_url " +
        "from Feeds, Movies, Services "+
        "where Movies.id = Feeds.movie_id "+
        "and Services.id = Movies.service_id "+
        "and Movies.name LIKE '%"+movie_name+"%' "+
        "order by date desc " +
        "limit "+ str((page-1)*PAGE_SIZE) + ", " + str(PAGE_SIZE))
    result = cursor.fetchall()
    for register in result:
        register["likes"] = get_total_likes(register["feed_id"])
        movies.append(generate_movie(register))
    return jsonify(movies)

@service.route("/movies_service/<string:service_id>/<int:page>")
def get_movies_by_service(service_id, page):
    movies = []
    connection = get_connection_bd()
    cursor = connection.cursor(dictionary=True)

    initial_page = str((page-1)*PAGE_SIZE)
    final_page = str(PAGE_SIZE)
    sql = f"""Select Feeds.id as feed_id, DATE_FORMAT(Feeds.date,'%Y-%m-%d %T') as date,
        Services.id as service_id, Services.name as service_name, Services.avatar as service_avatar,
        Movies.genre as movie_genre, Movies.year as movie_year, Movies.cast as movie_cast,
        Movies.director as movie_director, Movies.id as movie_id,
        Movies.name as movie_name, Movies.description as movie_description, Movies.url as movie_url
        from Feeds, Movies, Services
        where Movies.id = Feeds.movie_id
        and Services.id = Movies.service_id 
        and Services.id = {service_id}
        order by date desc
        limit {initial_page} , {final_page}"""
    cursor.execute(sql)
    result = cursor.fetchall()
    for register in result:
        register["likes"] = get_total_likes(register["feed_id"])
        movies.append(generate_movie(register))
    return jsonify(movies)

if __name__ == "__main__":
    service.run(
        host="0.0.0.0",
        port="5000",
        debug=DEBUG
    )
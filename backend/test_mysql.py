import mysql.connector


try:
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="ilovemyself",
        database="soumi-database"
    )

    if connection.is_connected():
        print("Successfully connected to MySQL!")

        cursor = connection.cursor()

        cursor.execute("SELECT * FROM standards")

        results = cursor.fetchall()

        print("\nStandards in database:\n")

        for row in results:
            print(row[1])

        cursor.close()
        connection.close()

except mysql.connector.Error as error:
    print("Database connection failed:", error)
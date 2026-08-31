from database import get_db_connection


try:
    connection = get_db_connection()

    if connection.is_connected():
        print("Database connection successful!")

        cursor = connection.cursor()

        cursor.execute("SELECT COUNT(*) FROM standards;")

        count = cursor.fetchone()

        print("Standards found:", count[0])

        cursor.close()
        connection.close()

        print("Connection closed.")

except Exception as error:
    print("Error:", error)
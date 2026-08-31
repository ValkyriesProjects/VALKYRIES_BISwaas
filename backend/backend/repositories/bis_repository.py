from database import get_db_connection

connection = get_db_connection()
cursor = connection.cursor(dictionary=True)

cursor.execute("SELECT DATABASE() AS current_database")
print("Database:", cursor.fetchone())

cursor.execute("SELECT * FROM product_types")
print("\nProduct types:")

for row in cursor.fetchall():
    print(row)

cursor.close()
connection.close()
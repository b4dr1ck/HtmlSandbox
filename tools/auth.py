#!/usr/bin/python3

import sqlite3
import bcrypt
import getpass

# Database file
DB_FILE = "users.db"

# Initialize the database
def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

# Create a new user
def create_user():
    username = input("Enter a new username: ").strip()
    password = getpass.getpass("Enter a password: ").strip()
    confirm_password = getpass.getpass("Confirm the password: ").strip()

    if password != confirm_password:
        print("Passwords do not match!")
        return

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed_password))
        conn.commit()
        conn.close()
        print(f"User '{username}' created successfully!")
    except sqlite3.IntegrityError:
        print(f"Error: User '{username}' already exists.")

# Authenticate a user
def authenticate_user():
    username = input("Enter your username: ").strip()
    password = getpass.getpass("Enter your password: ").strip()

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT password FROM users WHERE username = ?", (username,))
    result = cursor.fetchone()
    conn.close()

    if result:
        stored_password = result[0]
        if bcrypt.checkpw(password.encode('utf-8'), stored_password):
            print("Authentication successful!")
        else:
            print("Invalid password.")
    else:
        print("User not found.")

def show_users():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT username FROM users")
    users = cursor.fetchall()
    conn.close()

    if users:
        print("Registered Users:")
        for user in users:
            print(f"- {user[0]}")
    else:
        print("No users found.")

def delete_user():
    username = input("Enter the username to delete: ").strip()

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE username = ?", (username,))
    conn.commit()
    rows_deleted = cursor.rowcount
    conn.close()

    if rows_deleted:
        print(f"User '{username}' deleted successfully.")
    else:
        print(f"User '{username}' not found.")

# Main menu
def main():
    init_db()
    while True:
        print("\nOptions:")
        print("1. Create a new user")
        print("2. Show Users")
        print("3. Delete User")
        print("4. Authenticate a user")
        print("5. Exit")
        choice = input("Enter your choice: ").strip()

        print("")
        
        if choice == "1":
            create_user()
        elif choice == "2":
            show_users()
        elif choice == "3":
            delete_user()
        elif choice == "4":
            authenticate_user()
        elif choice == "5":
            print("Goodbye!")
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
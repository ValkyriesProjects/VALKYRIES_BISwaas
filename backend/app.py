from dotenv import load_dotenv
from flask import Flask, jsonify 
from flask_cors import CORS

load_dotenv()

from routes.chat import chat_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(chat_bp)


@app.route("/")
def home():
    return jsonify({
        "message": "BIS Navigator backend is running!"
    })


@app.route("/api/health")
def health():
    return jsonify({
        "status": "success",
        "message": "Backend is healthy"
    })


if __name__ == "__main__":
    app.run(debug=True)
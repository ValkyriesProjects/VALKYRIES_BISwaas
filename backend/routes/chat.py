from flask import Blueprint, request, jsonify

from services.chat_service import process_question


chat_bp = Blueprint("chat", __name__)


@chat_bp.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "error": "Request body must contain JSON"
        }), 400

    message = data.get("message")

    if not message or not isinstance(message, str):
        return jsonify({
            "error": "Please provide a message"
        }), 400

    message = message.strip()

    if not message:
        return jsonify({
            "error": "Message cannot be empty"
        }), 400

    result = process_question(message)

    return jsonify(result), 200
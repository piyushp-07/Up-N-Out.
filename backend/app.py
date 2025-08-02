from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

import gemini_service

app = Flask(__name__)
CORS(app)

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    print("Error: GOOGLE_API_KEY not found in .env file. Please set it to proceed.")
    exit(1)


@app.route('/chat', methods=['POST'])
def chat():
    try:

        data = request.get_json()

        conversation_contents = data.get('contents')
        mentor_id = data.get('mentorId')


        if not conversation_contents or not mentor_id:
            return jsonify({"error": "Missing 'contents' or 'mentorId' in request."}), 400 # RETURN an error message


        ai_reply_text = gemini_service.get_ai_response_for_mentor(conversation_contents, mentor_id)


        return jsonify({"reply": ai_reply_text}), 200

    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500


if __name__ == '__main__':
    print("Starting Flask app...")


    app.run(host='0.0.0.0', debug=True, port=5000)


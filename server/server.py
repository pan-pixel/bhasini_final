from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
from helper import *

app = Flask(__name__)
CORS(app, support_credentials=True)

@app.route('/processContent', methods=['POST', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def contentProcess():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'POST':
        data = request.json['texts']
        lang = request.json['lang']
        res = processAllContent(data, lang)
        return _corsify_actual_response(jsonify({"status": "OK", "res": res}))



@app.route('/processAudio', methods=['POST', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def audioProcess():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'POST':
        data = request.json['audio'].split(",")[1]
        lang = request.json['lang']
        res = callBhashiniASR(data, lang)
        return _corsify_actual_response(jsonify({"status": "OK", "res": res}))

def _build_cors_preflight_response():
    response = make_response()
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

def _corsify_actual_response(response):
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

if __name__ == '__main__':
    app.run(debug=True)
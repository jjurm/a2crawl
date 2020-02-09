from flask import Flask,request,jsonify
import pub_hunting as ph

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/data/',methods=['GET'])
def data():
    content = request.get_json()
    return_data = ph.pub_hunting(content)
    return jsonify(return_data)

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000)

from flask import Flask,request

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/data/',method=['POST'])
def data():
    content = request.get_json()
    return 'Hello data'

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000)

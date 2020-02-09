from flask import Flask,request,jsonify,Response
import flask
import pub_hunting as ph
from flask_cors import CORS,cross_origin
import json

app = Flask(__name__)
CORS(app)
#app.config['CORS_HEADERS']='Content-Type'


@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/data',methods=['GET','POST','OPTIONS'])
def data():
    print(request)
    print("hello")
    content = request.get_json()
    if content is not None:
        print(content)
        return_data = ph.pub_hunting(content)
        resp = Response(json.dumps(return_data),status=200)
    else:
        resp = Response([],status=200)

    #resp.headers['Access-Control-Allow-Origin'] = '*'
    #resp.headers('Access-Control-Allow-Origin', 'http:/localhost:8100')
    #resp.headers('Access-Control-Allow-headers')
    #resp.headers.add('Access-Control-Allow-Origin','*')
    #resp.headers.add('Access-Control-Allow-Headers','Content-Type,Authorizations')
    #resp.headers.add('Access-Control-Allow-Headers','Content-Type,json')
    #resp.headers.add('Access-Control-Allow-Methods','GET,POST,OPTIONS')
    #resp.headers.add('Access-Control-Allow-Credentials','true')
    print(resp)
    return resp

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000)

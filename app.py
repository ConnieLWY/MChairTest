from flask import Flask, render_template
from flask_sockets import Sockets

app = Flask(__name__)
sockets = Sockets(app)

@app.route('/')
def index():
    return render_template('index.html')

@sockets.route('/ws')
def ws(ws):
    while not ws.closed:
        message = ws.receive()
        if message:
            print("Received message:", message)
            # Handle received message here

if __name__ == '__main__':
    from gevent import pywsgi
    from geventwebsocket.handler import WebSocketHandler
    server = pywsgi.WSGIServer(('localhost', 5000), app, handler_class=WebSocketHandler)
    print("Server running at http://localhost:5000/")
    server.serve_forever()

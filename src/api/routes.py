"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User,TokenBlockedList
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, create_refresh_token, get_jwt
from flask_bcrypt import Bcrypt

api = Blueprint('api', __name__)
app=Flask(__name__)
crypto = Bcrypt(app)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/signup', methods=['POST'])
def new_user():
    email = request.json.get('email')
    password = request.json.get('password')
    password = crypto.generate_password_hash(password).decode("utf-8")
    new_user = User(email=email,password=password,is_active=True)
    db.session.add(new_user)
    db.session.commit()

    return({"msg":"User created"})

@api.route('/login', methods=['POST'])
def user_login():
    email = request.json.get('email')
    password = request.json.get('password')
    user=User.query.filter(User.email==email).first()
    if user is None:
        return jsonify({"msg": "Login failed"}), 401
        
    #Validar la clave
    if not crypto.check_password_hash(user.password,password):
        return jsonify({"msg": "Login failed: Wrong password"}), 401

    token = create_access_token(identity=user.id)
    refresh_token=create_refresh_token(identity=user.id)
    return jsonify({"access_token":token,"refresh_token":refresh_token})

@api.route('/refresh',methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    user_id=get_jwt_identity()
    token=create_access_token(identity=user_id)
    return jsonify({"access_token":token})

@api.route('/logout',methods=['POST'])
@jwt_required()
def user_logout():
    jti=get_jwt()['jti']
    token_blocked=TokenBlockedList(token_id=jti)
    db.session.add(token_blocked)
    db.session.commit()
    return jsonify({"msg":"User logged out"})

@api.route('/userinfo')
@jwt_required()
def get_user_info():
    user_id=get_jwt_identity()
    user=User.query.get(user_id)

    return jsonify(user.serialize())
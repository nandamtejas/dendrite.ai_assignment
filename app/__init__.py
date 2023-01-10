import os
import certifi
import json
import stripe
from flask import Flask, request, jsonify, url_for, redirect, render_template
from flask_cors import CORS
from flask_oidc import OpenIDConnect
from mongoengine import connect
from ariadne import graphql_sync, combine_multipart_data
from ariadne.constants import PLAYGROUND_HTML
from . import config


#Initialize app
app = Flask(__name__)
app.config['SECRET_KEY'] = config.SECRET_KEY
app.config['ACCESS_CONTROL_ALLOW_ORIGIN'] = config.ACCESS_CONTROL_ALLOW_ORIGIN
app.config['Access-Control-Allow-Methods'.upper()] = 'HEAD, GET, POST, PUT, PATCH, DELETE OPTIONS'


# app.config.update({
#     'SECRET_KEY': '4tzmNXtr5xOZhQGUW55uPwGfYrBZciEP',
#     'TESTING': True,
#     'DEBUG': True,
#     'OIDC_CLIENT_SECRETS': 'client_secrets.json',
#     'OIDC_ID_TOKEN_COOKIE_SECURE': False,
#     'OIDC_REQUIRE_VERIFIED_EMAIL': False,
#     'OIDC_USER_INFO_ENABLED': True,
#     'OIDC_OPENID_REALM': 'flask-app',
#     'OIDC_SCOPES': ['openid', 'email', 'profile'],
#     'OIDC_INTROSPECTION_AUTH_METHOD': 'client_secret_post',
#     'OVERWRITE_REDIRECT_URI': "http://localhost:3000/"
# })
# oidc = OpenIDConnect(app)

stripe.api_key = config.STRIPE_SECRET_KEY

#Connect to DB
db = connect(host=config.DB_URI, tlsCAFile=certifi.where())
cors = CORS(app, resources={
    r"/*": {
        "origins": "*"
    }
})

# import schema
from .schema import schema

# app routes

@app.route("/")
def hello():
    args = request.args
    if "success" in args:
        return "Stripe Success"
    if "cancel" in args:
        return "Stripe cancel"
    return """
        <h1>Hello</h1>
        <p><a href="/create-checkout-session">Stripe Product</a></p>
    """

@app.route("/create-checkout-session")
def create_checkout_session():
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    "price": config.STRIPE_PRICE_API_KEY,
                    "quantity": 1
                }],
                mode="payment",
                success_url=url_for("hello", _external=True) + "?success=true",
                cancel_url= url_for("hello", _external=True) + "?cancel=true"
        )
    except Exception as err:
        return str(err)
    return redirect(checkout_session.url, code=303)

@app.route("/graphql", methods=['GET', 'POST'])
def graphql():
    # if not oidc.user_loggedin:
    #     return oidc.redirect_to_auth_server("http://localhost:5000/")
    if request.method == "POST":
        # print(request.content_type)
        if request.content_type.startswith("multipart/form-data"):
            data = combine_multipart_data(
                operations = json.loads(request.form.get("operations")),
                files_map = json.loads(request.form.get("map")),
                files = dict(request.files)
            )
        else:
            data = request.get_json()
        success, result = graphql_sync(schema, data, context_value=request, debug=app.debug)
        print(f"{result = }")
        status_code = 200 if success else 400
        return jsonify(result), status_code
    return PLAYGROUND_HTML, 200
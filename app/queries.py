from flask import url_for
from datetime import datetime
from ariadne import convert_kwargs_to_snake_case
from .models import Todo
from . import config, stripe

@convert_kwargs_to_snake_case
def resolve_todos(obj, info):
    try:
        todos = [todo for todo in Todo.objects().order_by("-createdAt", "-updatedAt")]
        payload ={
            "success": True,
            "todos": todos
        }
    
    except Exception as err:
        payload = {
            "success": False,
            "errors": [str(err)]
        }
    return payload

@convert_kwargs_to_snake_case
def resolve_todo(obj, info, todo_id):
    try:
        todo = Todo.objects.get(id=todo_id)
        payload = {
            "success": True,
            "todo": todo
        }
    except Exception as err:
        payload = {
            "success": False,
            "errors": [str(err)]
        }
    return payload

@convert_kwargs_to_snake_case
def resolve_add_todo(obj, info, title, description, time, is_subscribed=False):
    try:
        time = datetime.strptime(time, "%d-%m-%Y %H:%M:%S")
        todo = Todo(title=title, description=description, time=time)
        todo.is_subscribed = is_subscribed 
        todo.createdAt = datetime.now()
        todo.save()
        payload = {
            "success": True,
            "todo": todo
        }
    except Exception as err:
        payload = {
            "success": False,
            "errors": [str(err)]
        }
    print(payload)
    return payload


@convert_kwargs_to_snake_case
def resolve_edit_todo(obj, info, todo_id, **kwargs):
    try:
        todo = Todo.objects.get(id=todo_id)
        if not todo:
            raise Exception(f"Todo of {todo_id} not found")
        todo['title'] = kwargs.get("title", todo['title'])
        todo['description'] = kwargs.get("description", todo['description'])
        todo['time'] = kwargs.get("time", todo['time'])
        todo['updatedAt'] = datetime.now()
        todo.save()
        payload = {
            "success": True,
            "todo": todo
        }
        print(f"{kwargs = }")
    except Exception as err:
        payload = {
            "success": False,
            "errors": [str(err)]
        }
    return payload

@convert_kwargs_to_snake_case
def resolve_delete_todo(obj, info, todo_id):
    try:
        todo = Todo.objects.get(id=todo_id)
        todo.delete()
        payload = {
            "success": True,
        }
    except Exception as err:
        payload = {
            "success": False,
            "errors": [str(err)] 
        }
    return payload


@convert_kwargs_to_snake_case
def resolve_upload_image(obj, info, todo_id, image):
    try:
        todo = Todo.objects.get(id=todo_id)
        todo.image = image
        todo.save()
        payload = {
            "success": True,
        }

    except Exception as err:
        payload = {
            "success": False,
            "errors": [str(err)]
        }
    return payload

@convert_kwargs_to_snake_case
def resolve_checkout_payment(obj, info):
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
        payload = {
            "success": True,
            "session": checkout_session['id'],
            "public": config.STRIPE_PUBLISHABLE_KEY,
            "url": checkout_session['url']
        }
    except Exception as err:
        payload = {
            "success": False,
            "errors": [str(err)]
        }
    # print(payload)
    return payload

@convert_kwargs_to_snake_case
def resolve_after_checkout_payment(obj, info, is_subscribed):
    try:
        todo = Todo.objects(is_subscribed=not(is_subscribed)).update(is_subscribed=is_subscribed)
        # todo.is_subscribed = True
        # todo.save()
        payload = {
            "success": True
        }
    except Exception as err:
        payload = {
            "success": False,
            "errors": [str(err)]
        }
    return payload
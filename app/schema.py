from .queries import resolve_todos, resolve_todo, \
                     resolve_add_todo, resolve_edit_todo,\
                     resolve_delete_todo, resolve_upload_image, \
                     resolve_checkout_payment, resolve_after_checkout_payment
from ariadne import ObjectType, load_schema_from_path, \
                    make_executable_schema, snake_case_fallback_resolvers, upload_scalar

# Query type
query = ObjectType("Query")

query.set_field("todos", resolver=resolve_todos)
query.set_field("todo", resolver=resolve_todo)
query.set_field("checkoutPayment", resolver=resolve_checkout_payment)
query.set_field("afterCheckoutPayment", resolver=resolve_after_checkout_payment)

# Mutation
mutation = ObjectType("Mutation")

mutation.set_field("addTodo", resolver=resolve_add_todo)
mutation.set_field("editTodo", resolver=resolve_edit_todo)
mutation.set_field("deleteTodo", resolver=resolve_delete_todo)
mutation.set_field("uploadImage", resolver=resolve_upload_image)


# Get Schema from file
type_defs = load_schema_from_path("schema.graphql")
schema = make_executable_schema(type_defs, [query, mutation, upload_scalar, snake_case_fallback_resolvers])
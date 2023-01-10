import React, { Component } from "react";


export class Form extends Component {
    initialState = {
        title: "",
        description: "",
        time: ""
    }

    state = this.initialState;

    handleChange = (event) => {
        event.preventDefault(event);
        const {name, value} = event.target;

        this.setState({
            [name]: value,
        })
    }

    onSubmitForm = (event) => {
        var title = this.state.title
        var description = this.state.description
        var time = this.state.time
        time = time.split("T")
        var query = "";
        if (this.props.todoDetails !== '') {
            time[0] = time[0].split("-").join("-")
            time = time.join(" ") + ":00"
            var todoObject = JSON.parse(this.props.todoDetails)
            query = `
            mutation updateTodo {
                editTodo(todoId:"${todoObject.id}", title:"${title}", description: "${description}", time: "${time}") {
                  success
                  errors
                  todo {
                    id
                    title
                    isSubscribed
                    description
                    time
                  }
                }
              }
            `
        } else {
            time[0] = time[0].split("-").reverse().join("-")
            time = time.join(" ") + ":00"
            query = `
                mutation createTodo {
                    addTodo(title: "${title}", description: "${description}", time: "${time}"){ 
                    todo {
                        id
                        title
                        description
                        time
                        isSubscribed
                    }
                    success
                    errors
                    }
                }`
            }
            console.log(query);

        fetch("http://localhost:5000/graphql", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: query,
                variables: {}
            })
        })
        .then((response) => response.json())
        .then((response) => {
            // alert(JSON.stringify(response))
        })
        // alert("\ntime: "+time)
        if (todoObject)
            alert("Updated Todo!")
        else 
            alert("Created Todo")
    }

    // UNSAFE_componentWillMount() {
    //     if (this.props.todoDetails !== "") {
    //         var todoObject = JSON.parse(this.props.todoDetails);
    //         this.setState({
    //             title: todoObject.title,
    //             description: todoObject.description,
    //             time: todoObject.time
    //         })
    //     }
    // }
    

    render() {
        const {title, description, time} = this.state;

        return (
            <form>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input 
                        className="form-control"
                        type="text"
                        name="title"
                        id="title"
                        value={title}
                        onChange={this.handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="description">Description</label>
                    <input 
                        className="form-control"
                        type="text"
                        name="description"
                        id="description"
                        value={description}
                        onChange={this.handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="time">Time</label>
                    <input 
                        className="form-control"
                        type="datetime-local"
                        name="time"
                        id="time"
                        value={time}
                        onChange={this.handleChange} />
                </div>
                {/* <div className="mb-3">
                <label htmlFor="image">Image</label>
                <input 
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                    onChange={this.handleChange} />
                </div> */}
                <button className="btn btn-primary" onClick={this.onSubmitForm}>Submit</button>
            </form>
        )
    }
}
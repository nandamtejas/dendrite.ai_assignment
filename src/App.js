import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';
import {Top} from './Top';
import { Content } from './Content';
import { Popup } from './Popup';
import { StripePopup } from './StripePopup';

class App extends Component {

    state = {
        cardItems: [],
        formIsOpen: false,
        stripeFormIsOpen: false,
        stripeEle: null,
        isSubscribed: false,
        details: {},
        cardDetails: {}
    }

    UNSAFE_componentWillMount() {
        this.renderMyData();
    }

    handleAddCardItem = (cardItem) => {
        this.setState({
            cardItems: [...this.state.cardItems, cardItem]
        })
    }

    handleUpdateCardItem = (cardItem) => {
        //get cardItem index through id
        var card = this.state.cardDetails.forEach((row, index) => {
            return (row.id === cardItem.id) ? (index) : (null)
        })
        this.state.cardDetails[card] = cardItem;
    }


    handleSubmit = (event) => {
        event.preventDefault(event);
        const targetName = event.target.name;
        console.log("Target Name ", targetName)
        const url = "http://localhost:5000/graphql"
        var query="";
        var variables={};
        console.log(event.target.id)
        switch(targetName) {
            case "deleteTodo":
                  query = `
                    mutation deleteTodo {
                        deleteTodo(todoId:"${event.target.id}"){
                            success
                            errors
                        }
                    }`; break;
        }
        fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        })
        .then((response) => response.json())
        .then((result) => {
            switch(targetName) {
                case "getTodos":
                    this.setState({cardItems: result.data.todos.todos}); break;
                case "deleteTodo":
                    this.setState({
                        cardItems: this.state.cardItems.filter((cardItem, i) => cardItem.id !== event.target.id)
                    })
            }
        })
    }

    renderMyData() {
        fetch("http://localhost:5000/graphql", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: `
                query getTodos {
                    todos {
                      success
                      errors
                      todos {
                        id
                        title
                        description
                        time
                        isSubscribed
                      }
                    }
                  }`,
                  variables: {}
            })
        })
        .then((response) => response.json())
        .then((result) => {
            this.setState({cardItems: result.data.todos.todos});
        })
    }

    togglePopup = (event) => {
        event.preventDefault(event)
        // console.log(event.target.value === '');
        const stateForm = this.state.formIsOpen
        this.setState({
            formIsOpen: !stateForm,
            cardDetails: event.target.value
        })
    } 

    toggleStripePopup = (event) => {
        event.preventDefault(event);
        const stateForm = this.state.stripeFormIsOpen;
        this.setState({
            stripeFormIsOpen: !stateForm
        })
    }

    toggleSubscribe = (event) => {
        const stateSubscribe = this.state.isSubscribed;
        this.setState({
            isSubscribed: !stateSubscribe
        })

        var query = `
        query stripeL {
            afterCheckoutPayment(isSubscribed:${this.state.isSubscribed}) {
              success
              errors
            }
          }`
          console.log(query)

          fetch("http://localhost:5000", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: query,
                variables: {}
            })
          })
          .then((response) => console.log(response))
        //   .then((response) => {
        //     console.log(response)

        //   })
    }

    handleStripeEle = (event, ele) => {
        event.preventDefault(event);
        this.setState({
            stripeEle: ele
        })
    }



    render() {
        const cardItems = this.state.cardItems
        return (
            <div className='App'>
                <Top />
                <Content onHandleSubmit={this.handleSubmit} cardData={cardItems} togglePopup={this.togglePopup} toggleStripePopup={this.toggleStripePopup} handleAddCardItem={this.handleAddCardItem} toggleSubscribe={this.toggleSubscribe} handleStripeEle={this.handleStripeEle} />
                {this.state.formIsOpen && <Popup togglePopup={this.togglePopup} handleAddCardItem={this.handleAddCardItem} todoDetails={this.state.cardDetails} handleUpdateCardItem={this.handleUpdateCardItem}/>}
                {/* <div className='form' style={{display: "none"}}>
                    <Form />
                </div> */}
                {this.state.stripeFormIsOpen && <StripePopup toggleStripePopup={this.toggleStripePopup} ele={this.state.stripeEle}/>}

            </div>
        )
    }
}

export default App;

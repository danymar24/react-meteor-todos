import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import AccountsWrapper from './services/accounts-wrapper';
import { Tasks } from '../api/tasks/tasks';

import Task from './components/Task';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hideCompleted: false
        };
    }

    handleSubmit(event) {
        event.preventDefault();

        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
        const privateTodo = this.refs.privateTodo.checked;

        Meteor.call('tasks.insert', text, privateTodo);

        ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }

    toggleHideCompleted() {
        this.setState({
            hideCompleted: !this.state.hideCompleted
        });
    }

    renderTasks() {
        let filteredTasks = this.props.tasks;
        if (this.state.hideCompleted) {
            filteredTasks = filteredTasks.filter(task => !task.checked);
        }

        return filteredTasks.map((task) => (
            <Task key={task._id} task={task} />
        ));
    }

    render() {

        return (
            <div className="container">
                <header>
                    <div className="row">
                        <h1>Todo List ({this.props.incompleteCount})</h1>
                    </div>

                    <div className="row">
                        <div className="switch">
                            <label>Hide completed tasks: </label>
                            <label>
                                Off
                                <input type="checkbox"
                                    readOnly
                                    checked={this.state.hideCompleted}
                                    onClick={this.toggleHideCompleted.bind(this)}/>
                                <span className="lever"></span>
                                On
                            </label>
                        </div>
                    </div>

                    <div className="row">
                        <AccountsWrapper />
                    </div>

                    <div className="row">

                        { this.props.user ?
                            <form onSubmit={this.handleSubmit.bind(this)} className="new-task">
                                <div className="col s10">
                                    <input type="text"
                                        ref="textInput"
                                        placeholder="Type to add new tasks" />
                                </div>
                                <div className="col s1">
                                    <label>Private:
                                        <div className="switch">
                                            <label>
                                                <input type="checkbox"
                                                       ref="privateTodo"/>
                                                <span className="lever"></span>
                                            </label>
                                        </div>
                                    </label>
                                </div>
                                <div className="col s1">
                                    <button type="submit"
                                            className="btn-floating btn-sm waves-effect waves-light">
                                        <i className="mdi mdi-content-save"></i>
                                    </button>
                                </div>
                            </form> : ''                        
                        }
                    </div>
                </header>
                <ul>{this.renderTasks()}</ul>
            </div>
        );
    }
}

App.propTypes = {
    tasks: PropTypes.array.isRequired,
    incompleteCount: PropTypes.number.isRequired,
    currentUser: PropTypes.object
};

export default withTracker(props => {

    Meteor.subscribe('tasks');

    return {
        tasks: Tasks.find({}, { sort: { createdAt: -1 }}).fetch(),
        incompleteCount: Tasks.find({ checked: { $ne: true }}).count(),
        user: Meteor.user()
    };
})(App);
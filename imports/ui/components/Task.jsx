import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Tasks } from '../../api/tasks/tasks';

export default class Task extends Component {

    toggleChecked() {
        Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
    }

    deleteThisTask() {
        Meteor.call('tasks.remove', this.props.task._id);
    }

    setToPrivate() {
        Meteor.call('tasks.setPrivate', this.props.task._id, !this.props.task.private);
    }

    render() {

        const taskClassName = classnames({
            checked: this.props.task.checked,
            private: this.props.task.private
        });

        return (
            <li className={taskClassName}>
                <div className="row">
                    <div className="col s1">
                        { this.props.task.username === (Meteor.user() && Meteor.user().username) ? 
                            <label>Completed: 
                                <div className="switch">
                                    <label>
                                        <input type="checkbox"
                                            readOnly
                                            checked={this.props.task.checked}
                                            onClick={this.toggleChecked.bind(this)}/>
                                        <span className="lever"></span>
                                    </label>
                                </div>
                            </label> : ''}
                    </div>
                    <div className="col s9">
                        <div className="row">
                            <strong>{this.props.task.username}</strong>:
                        </div>
                        <div className="row">
                             {this.props.task.text}
                        </div>
                    </div>
                    <div className="col s1">
                        {this.props.task.username === (Meteor.user() && Meteor.user().username) ?
                            <label>Private:
                                <div className="switch">
                                    <label>
                                        <input type="checkbox"
                                            readOnly
                                            checked={this.props.task.private}
                                            onClick={this.setToPrivate.bind(this)} />
                                        <span className="lever"></span>
                                    </label>
                                </div>
                            </label> : '' }
                    </div>
                    <div className="col s1">
                        <button className="btn-floating btn-sm waves-effect waves-light red"
                                onClick={this.deleteThisTask.bind(this)}>
                            <i className="mdi mdi-delete"></i>
                        </button>
                    </div>
                </div>
            </li>
        );
    }
}

Task.propTypes = {
    task: PropTypes.object.isRequired,
};
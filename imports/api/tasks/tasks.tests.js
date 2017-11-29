/* eslint-env mocha */

import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { assert } from "meteor/practicalmeteor:chai";

import { Tasks } from "./tasks";

if (Meteor.isServer) {
    describe('Tasks', () => {
        describe('methods', () => {
            
            const userId = Random.id();
            let taskId;

            beforeEach(() => {
                Tasks.remove({});
                taskId = Tasks.insert({
                    text: 'tesk task',
                    createdAt: new Date(),
                    owner: userId,
                    username: 'danymar24'
                });
            });
            
            it('can delete owned task', () => {
                const deleteTask = Meteor.server.method_handlers['tasks.remove'];
                const invocation = { userId };

                deleteTask.apply(invocation, [taskId]);

                assert.equal(Tasks.find().count(), 0);
            });
        });
    });
}
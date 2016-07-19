import AppDispatcher from '../dispatcher/AppDispatcher';
import events from 'events';
import UserInfoConstants from '../constants/UserInfoConstants';
import assign from 'object-assign';

const EventEmitter = events.EventEmitter;

const CHANGE_EVENT = 'change';

let _userInfo = {};

function populate(user) {
    delete user.checks;
    _userInfo = user;
    // HEAP `identify` API
    heap.identify(user.userName);
}

const UserInfoStore = assign({}, EventEmitter.prototype, {
    getUserInfo() {
        return _userInfo;
    },
    emitChange() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

UserInfoStore.dispatchToken = AppDispatcher.register(function(action) {

    const user = action.user;

    switch (action.actionType) {

        case UserInfoConstants.USER_INFO_POPULATE:
            populate(user);
            UserInfoStore.emitChange();
            break;

        default:
    }
});

export default UserInfoStore;

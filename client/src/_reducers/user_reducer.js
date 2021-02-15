import {
    LOGIN_USER,
} from '../_actions/types';

export default function (state = {}, action) {
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, loginSuccess: action.payload }
            break;
                        // ...state는 똑같이 가져오는거
        default:
            break;
    }
}
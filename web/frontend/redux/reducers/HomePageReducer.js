import { HOME_PAGE_ITEM } from "../Types";

const initialState = {
    store_owner: '',
    store_name: '',
    store_email: '',
    subscription_plan_cost: 10,
    style_layout: 'compact'
};

export function HomePageReducer(state = initialState, action) {
    switch (action.type) {
        case HOME_PAGE_ITEM:
            return {
                ...state,
                store_owner: action.store_owner,
                store_name: action.store_name,
                store_email: action.store_email,
                subscription_plan_cost: action.subscription_plan_cost,
                style_layout: action.style_layout
            };
        default:
            return state;
    }
};
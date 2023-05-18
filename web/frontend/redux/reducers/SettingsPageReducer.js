import { SETTINGS_PAGE_ITEM } from "../Types";

const initialState = {
    store_owner: '',
    store_name: '',
    store_email: '',
    subscription_plan_cost: '',
    style_layout: '',
    marketing_notifications: undefined,
    order_notifications: undefined,
    update_notifications: undefined
};

export function SettingsPageReducer(state = initialState, action) {
    switch (action.type) {
        case SETTINGS_PAGE_ITEM:
            return {
                ...state,
                store_owner: action.store_owner,
                store_name: action.store_name,
                store_email: action.store_email,
                subscription_plan_cost: action.subscription_plan_cost,
                style_layout: action.style_layout,
                marketing_notifications: action.marketing_notifications,
                order_notifications: action.order_notifications,
                update_notifications: action.update_notifications
            };
        default:
            return state;
    }
};
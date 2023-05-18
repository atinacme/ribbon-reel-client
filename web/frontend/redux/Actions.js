import { HOME_PAGE_ITEM, SETTINGS_PAGE_ITEM } from "./Types";

export const HomePageAction = (store_owner, store_name, store_email, subscription_plan_cost, style_layout) => {
    return {
        type: HOME_PAGE_ITEM, store_owner, store_name, store_email, subscription_plan_cost, style_layout
    };
};

export const SettingsPageAction = (store_owner, store_name, store_email, subscription_plan_cost, style_layout, marketing_notifications, order_notifications, update_notifications) => {
    return {
        type: SETTINGS_PAGE_ITEM, store_owner, store_name, store_email, subscription_plan_cost, style_layout, marketing_notifications, order_notifications, update_notifications
    };
};
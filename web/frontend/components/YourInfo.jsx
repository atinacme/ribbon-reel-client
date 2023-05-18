import React from 'react';
import { Card, Layout, TextField } from "@shopify/polaris";
import { useSelector, useDispatch } from "react-redux";
import { HomePageAction, SettingsPageAction } from '../redux/Actions';
import { useLocation } from 'react-router-dom';

export function YourInfo() {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const location = useLocation();
    return (
        <Layout>
            <Layout.Section>
                <div className='info-wrapper'>
                    <Card title="Your Info" sectioned>
                        <p>Manage your contact details.</p>
                        <div className="textfeild-wrap">
                            <TextField
                                label="Store name"
                                value={location.pathname === "/Settings" ? state.settingsPage.store_name : state.homePage.store_name}
                                disabled
                                autoComplete="off"
                            />
                            <TextField
                                label="Email"
                                type="email"
                                value={location.pathname === "/Settings" ? state.settingsPage.store_email : state.homePage.store_email}
                                onChange={(e) => {
                                    if (location.pathname === "/Settings") {
                                        dispatch(SettingsPageAction(state.settingsPage.store_owner, state.settingsPage.store_name, e, state.settingsPage.subscription_plan_cost, state.settingsPage.style_layout, state.settingsPage.marketing_notifications, state.settingsPage.order_notifications, state.settingsPage.update_notifications));
                                    } else {
                                        dispatch(HomePageAction(state.homePage.store_owner, state.homePage.store_name, e, state.homePage.subscription_plan_cost, state.homePage.style_layout));
                                    }
                                }}
                                helpText="We’ll use this address if we need to contact you about your account."
                                autoComplete="email"
                            />
                        </div>
                    </Card>
                </div>
            </Layout.Section>
        </Layout>
    );
}

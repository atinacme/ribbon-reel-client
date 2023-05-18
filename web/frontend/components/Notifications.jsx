import React from 'react';
import { Card, TextContainer, Checkbox } from '@shopify/polaris';
import { useSelector, useDispatch } from "react-redux";
import { SettingsPageAction } from '../redux/Actions';

export function Notifications() {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const handleChangeMarketing = (newChecked) => {
        dispatch(SettingsPageAction(state.settingsPage.store_owner, state.settingsPage.store_name, state.settingsPage.store_email, state.settingsPage.subscription_plan_cost, state.settingsPage.style_layout, newChecked, state.settingsPage.order_notifications, state.settingsPage.update_notifications));
    };
    const handleChangeOrder = (newChecked) => {
        dispatch(SettingsPageAction(state.settingsPage.store_owner, state.settingsPage.store_name, state.settingsPage.store_email, state.settingsPage.subscription_plan_cost, state.settingsPage.style_layout, state.settingsPage.marketing_notifications, newChecked, state.settingsPage.update_notifications));
    };
    const handleChangeUpdate = (newChecked) => {
        dispatch(SettingsPageAction(state.settingsPage.store_owner, state.settingsPage.store_name, state.settingsPage.store_email, state.settingsPage.subscription_plan_cost, state.settingsPage.style_layout, state.settingsPage.marketing_notifications, state.settingsPage.order_notifications, newChecked));
    };
    return (
        <div>
            <Card sectioned title="Notifications Settings">
                <p>We may still send you important notificatons about your account outside of your notification settings.</p>
                <Card.Section>
                    <Checkbox
                        label="Marketing Newsletter"
                        checked={state.settingsPage.marketing_notifications}
                        onChange={handleChangeMarketing}
                    />
                    <TextContainer>
                        These are email newsletters from RibbonReel's about promotions and product improvements.
                    </TextContainer>
                </Card.Section>
                <Card.Section>
                    <Checkbox
                        label="Order Updates"
                        checked={state.settingsPage.order_notifications}
                        onChange={handleChangeOrder}
                    />
                    <TextContainer>
                        These are notifications for orders updates that require your immediate atention.
                    </TextContainer>
                </Card.Section>
                <Card.Section>
                    <Checkbox
                        label="Update Reminders"
                        checked={state.settingsPage.update_notifications}
                        onChange={handleChangeUpdate}
                    />
                    <TextContainer>
                        These are notifications to remind you of app updates you might have missed.
                    </TextContainer>
                </Card.Section>
            </Card>
        </div>
    );
}

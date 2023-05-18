import React, { useCallback, useState } from 'react';
import { Card, Layout, TextContainer, Link, Heading, Stack, Badge, List } from "@shopify/polaris";
import { Tick } from "../assets";
import { useSelector, useDispatch } from "react-redux";
import { HomePageAction, SettingsPageAction } from '../redux/Actions';
import { useLocation } from 'react-router-dom';

export function SubscriptionPlan() {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const location = useLocation();
    const [basicPlanClass, setBasicPlanClass] = useState(location.pathname === "/Settings" ? (state.settingsPage.subscription_plan_cost == 10 ? 'Subcription-card Polaris-Card__Section active' : 'Subcription-card Polaris-Card__Section') : 'Subcription-card Polaris-Card__Section active');
    const [proPlanClass, setProPlanClass] = useState(location.pathname === "/Settings" ? (state.settingsPage.subscription_plan_cost == 20 ? 'Subcription-card Polaris-Card__Section active' : 'Subcription-card Polaris-Card__Section') : 'Subcription-card Polaris-Card__Section');
    const [maxPlanClass, setMaxPlanClass] = useState(location.pathname === "/Settings" ? (state.settingsPage.subscription_plan_cost == 30 ? 'Subcription-card Polaris-Card__Section active' : 'Subcription-card Polaris-Card__Section') : 'Subcription-card Polaris-Card__Section');

    const handleBasicPlan = useCallback((newValue) => {
        setBasicPlanClass('Subcription-card Polaris-Card__Section active');
        setProPlanClass('Subcription-card Polaris-Card__Section');
        setMaxPlanClass('Subcription-card Polaris-Card__Section');
        if (location.pathname === "/Settings") {
            dispatch(SettingsPageAction(state.settingsPage.store_owner, state.settingsPage.store_name, state.settingsPage.store_email, 10, state.settingsPage.style_layout, state.settingsPage.marketing_notifications, state.settingsPage.order_notifications, state.settingsPage.update_notifications));
        } else {
            dispatch(HomePageAction(state.homePage.store_owner, state.homePage.store_name, state.homePage.store_email, 10, state.homePage.style_layout));
        }
    }, []);
    const handleProPlan = useCallback((newValue) => {
        setBasicPlanClass('Subcription-card Polaris-Card__Section');
        setProPlanClass('Subcription-card Polaris-Card__Section active');
        setMaxPlanClass('Subcription-card Polaris-Card__Section');
        if (location.pathname === "/Settings") {
            dispatch(SettingsPageAction(state.settingsPage.store_owner, state.settingsPage.store_name, state.settingsPage.store_email, 20, state.settingsPage.style_layout, state.settingsPage.marketing_notifications, state.settingsPage.order_notifications, state.settingsPage.update_notifications));
        } else {
            dispatch(HomePageAction(state.homePage.store_owner, state.homePage.store_name, state.homePage.store_email, 20, state.homePage.style_layout));
        }
    }, []);
    const handleMaxPlan = useCallback((newValue) => {
        setBasicPlanClass('Subcription-card Polaris-Card__Section');
        setProPlanClass('Subcription-card Polaris-Card__Section');
        setMaxPlanClass('Subcription-card Polaris-Card__Section active');
        if (location.pathname === "/Settings") {
            dispatch(SettingsPageAction(state.settingsPage.store_owner, state.settingsPage.store_name, state.settingsPage.store_email, 30, state.settingsPage.style_layout, state.settingsPage.marketing_notifications, state.settingsPage.order_notifications, state.settingsPage.update_notifications));
        } else {
            dispatch(HomePageAction(state.homePage.store_owner, state.homePage.store_name, state.homePage.store_email, 30, state.homePage.style_layout));
        }
    }, []);
    return (
        <Layout>
            <Card sectioned>
                <Layout.Section>
                    <div className='subscription-wrapper'>
                        <div title="Subcription Plan">
                            <h2>Subcription Plan</h2>
                            <p>Manage your billing and payment plan.</p>
                            <div style={{ display: 'flex', paddingTop: '24px' }} className="Subcription-card">
                                <div className={basicPlanClass} onClick={handleBasicPlan}>
                                    <Card sectioned>
                                        <Stack>
                                            <Stack.Item>
                                                <Heading>Basic Plan</Heading>
                                            </Stack.Item>
                                            <Stack.Item>
                                                <Badge>Monthly</Badge>
                                            </Stack.Item>
                                        </Stack>
                                        <p>Our most popular plan for small shops.</p>
                                        <div className='Subcription-month_wrap'>
                                            <Stack>
                                                <Stack.Item>
                                                    <span>$10</span>
                                                </Stack.Item>
                                                <Stack.Item>
                                                    <span className='month-detail'>per month</span>
                                                </Stack.Item>
                                            </Stack>
                                        </div>
                                        <Stack>
                                            <List type="bullet">
                                                <List.Item>### Amount of gifts</List.Item>
                                                <List.Item>### Amount of gifts</List.Item>
                                                <List.Item>### Amount of gifts</List.Item>
                                            </List>
                                        </Stack>
                                        <div className='slected'>
                                            {basicPlanClass === 'Subcription-card Polaris-Card__Section active' ?
                                                <>
                                                    <p>Selected</p>
                                                    <img src={Tick} />
                                                </>
                                                : <p>Choose Plan</p>
                                            }
                                        </div>
                                    </Card>
                                </div>
                                <div className={proPlanClass} onClick={handleProPlan}>
                                    <Card sectioned>
                                        <Stack>
                                            <Stack.Item>
                                                <Heading>Pro Plan</Heading>
                                            </Stack.Item>
                                            <Stack.Item>
                                                <Badge>Monthly</Badge>
                                            </Stack.Item>
                                        </Stack>
                                        <p>Our most popular plan for small shops.</p>
                                        <Stack>
                                            <Stack.Item>
                                                <span>$20</span>
                                            </Stack.Item>
                                            <Stack.Item>
                                                <span className='month-detail'>per month</span>
                                            </Stack.Item>
                                        </Stack>
                                        <Stack>
                                            <List type="bullet">
                                                <List.Item>### Amount of gifts</List.Item>
                                                <List.Item>### Amount of gifts</List.Item>
                                                <List.Item>### Amount of gifts</List.Item>
                                            </List>
                                        </Stack>
                                        <div className='slected'>
                                            {proPlanClass === 'Subcription-card Polaris-Card__Section active' ?
                                                <>
                                                    <p>Selected</p>
                                                    <img src={Tick} />
                                                </>
                                                : <p>Choose Plan</p>
                                            }
                                        </div>
                                    </Card>
                                </div>
                                <div className={maxPlanClass} onClick={handleMaxPlan}>
                                    <Card sectioned>
                                        <Stack>
                                            <Stack.Item>
                                                <Heading>Max Plan</Heading>
                                            </Stack.Item>
                                            <Stack.Item>
                                                <Badge>Monthly</Badge>
                                            </Stack.Item>
                                        </Stack>
                                        <p>Our most popular plan for small shops.</p>
                                        <Stack>
                                            <Stack.Item>
                                                <span>$30</span>
                                            </Stack.Item>
                                            <Stack.Item>
                                                <span className='month-detail'>per month</span>
                                            </Stack.Item>
                                        </Stack>
                                        <Stack>
                                            <List type="bullet">
                                                <List.Item>### Amount of gifts</List.Item>
                                                <List.Item>### Amount of gifts</List.Item>
                                                <List.Item>### Amount of gifts</List.Item>
                                            </List>

                                        </Stack>
                                        <div className='slected'>
                                            {maxPlanClass === 'Subcription-card Polaris-Card__Section active' ?
                                                <>
                                                    <p>Selected</p>
                                                    <img src={Tick} />
                                                </>
                                                : <p>Choose Plan</p>
                                            }
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </Layout.Section>
                <TextContainer>Subscription will be monthly and payment method can be managed thru you <Link>shopify account</Link></TextContainer>
            </Card>
        </Layout>
    );
}

import React, { useState, useCallback } from 'react';
import {
    Card, Page, Layout, Select, Button, Stack, DataTable, Heading, TextContainer, Thumbnail
} from "@shopify/polaris";
import { ChatMajor } from '@shopify/polaris-icons';
import { Mark, chat, RibbonReel_BrandElements, Imageshoe, arrow } from "../assets";
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

export default function MerchantDashboardPage() {
    const [selected, setSelected] = useState('today');

    const handleSelectChange = useCallback((value) => setSelected(value), []);

    const options = [
        { label: 'Today', value: 'today' },
        { label: 'Yesterday', value: 'yesterday' },
        { label: 'Last 7 days', value: 'lastWeek' },
    ];

    const state = {
        labels: ['January', 'February', 'March',
            'April', 'May'],
        datasets: [
            {
                label: 'Rainfall',
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: [65, 59, 80, 81, 56]
            }
        ]
    };

    const rows = [
        ['Emerald Silk Gown', '$875.00', 124689, 140, '$122,500.00'],
        ['Mauve Cashmere Scarf', '$230.00', 124533, 83, '$19,090.00'],
        [
            'Navy Merino Wool Blazer with khaki chinos and yellow belt',
            '$445.00',
            124518,
            32,
            '$14,240.00',
        ],
    ];
    return (
        <div className=''>
            <Page narrowWidth>
                <Layout>
                    <Layout.Section>
                        <div className='merchant-header header'>
                            <Stack.Item><Thumbnail size="small" alt="logo" source={Mark} /><h2>ribbonreel</h2></Stack.Item>
                            <Stack.Item><Button><Thumbnail size="small" alt="chat" source={chat} /><span className='header-title'> Contact Support</span></Button></Stack.Item>
                        </div>
                    </Layout.Section>
                </Layout>
                <Layout>
                    <Layout.Section>
                        <div className='merachnt-wrapper'>
                            <p>Good Afternoon</p>
                            <Heading>Alexander</Heading>
                            <h3>Here’s what’s happening with Ribbon Reel today.</h3>
                            <div className='merchant-card'>
                                <Card sectioned>
                                    <div style={{ display: 'block', alignItems: 'center' }}>
                                        <h2>Total Gift Revenue</h2>
                                        <h4>$9,475.31</h4>
                                        <Stack.Item>
                                            <div className='arrow-wrap'> <img src={arrow} />3%</div>
                                            <TextContainer>+$39.8 this week</TextContainer>
                                        </Stack.Item>
                                    </div>
                                </Card>

                                <Card sectioned>
                                    <div style={{ display: 'block', alignItems: 'center' }}>
                                        <h2>Total Gifting Customers</h2>
                                        <h4>345</h4>
                                        <Stack.Item>
                                            <div className='arrow-wrap'> <img src={arrow} />3%</div>
                                            <TextContainer>+$39.8 this week</TextContainer>
                                        </Stack.Item>
                                    </div>
                                </Card>
                                <Card sectioned>
                                    <div style={{ display: 'block', alignItems: 'center' }}>
                                        <h2>Total Reel Orders</h2>
                                        <h4>3,169</h4>
                                        <Stack.Item>
                                            <div className='arrow-wrap'> <img src={arrow} />3%</div>
                                            <TextContainer>+$39.8 this week</TextContainer>
                                        </Stack.Item>
                                    </div>
                                </Card>
                                <Card sectioned>
                                    <div style={{ display: 'block', alignItems: 'center' }}>
                                        <h2>Most Gifted Product</h2>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>  <Thumbnail size="small" alt="logo" source={Imageshoe} /><h4>$9,475.31</h4></div>
                                        <Stack.Item>
                                            <div className='arrow-wrap'> <img src={arrow} />3%</div>
                                            <TextContainer>+$39.8 this week</TextContainer>
                                        </Stack.Item>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </Layout.Section>
                </Layout>
                <Layout>
                    <Layout.Section>
                        <div className='merchant-graph_wrapper'>
                            <Card sectioned>
                                <div style={{ display: 'block', alignItems: 'center' }}>
                                    <div className='merachant-range'>
                                        <h2>Generated Revenue</h2>
                                        <Select
                                            options={options}
                                            onChange={handleSelectChange}
                                            value={selected}
                                        />
                                    </div>
                                    <span className='price'>$3,6358</span>

                                    <Bar
                                        data={state}
                                        options={{
                                            title: {
                                                display: true,
                                                text: 'Average Rainfall per month',
                                                fontSize: 20
                                            },
                                            legend: {
                                                display: true,
                                                position: 'right'
                                            }
                                        }}
                                    />

                                </div>
                            </Card>
                            <Card sectioned>
                                <div style={{ display: 'block', alignItems: 'center' }}>
                                    <div className='merachant-range'>
                                        <h2>Reel Orders Summary</h2>
                                        <Select
                                            options={options}
                                            onChange={handleSelectChange}
                                            value={selected}
                                        />
                                    </div>
                                    <span className='price'>1,343</span>

                                    <Bar
                                        data={state}
                                        options={{
                                            title: {
                                                display: true,
                                                text: 'Average Rainfall per month',
                                                fontSize: 20
                                            },
                                            legend: {
                                                display: true,
                                                position: 'right'
                                            }
                                        }}
                                    />
                                </div>
                            </Card>
                        </div>
                    </Layout.Section>
                </Layout>
                <Layout>
                    <Layout.Section>
                        <div className=''>
                            <Card sectioned>
                                <div style={{ display: 'block', alignItems: 'center' }}>
                                    <div className='recent-order'>
                                        <h3>Recent Orders</h3>
                                        <Button>View Orders</Button>
                                    </div>
                                    <DataTable
                                        columnContentTypes={[
                                            'text',
                                            'numeric',
                                            'numeric',
                                            'numeric',
                                            'numeric',
                                        ]}
                                        headings={[
                                            'Product',
                                            'Price',
                                            'SKU Number',
                                            'Net quantity',
                                            'Net sales',
                                        ]}
                                        rows={rows}
                                        totals={['', '', '', 255, '$155,830.00']}
                                    />
                                </div>
                            </Card>
                        </div>
                    </Layout.Section>
                </Layout>
                <Layout>
                    <Layout.Section>
                        <div className='support-wrapper'>
                            <Card sectioned>
                                <div style={{ display: 'block', alignItems: 'center' }}>
                                    <h3>Need Support?</h3>
                                    <p>Get our gifting experts to help with any issues you may be facing!</p>
                                    <div className='merchant-cta-wrap'>
                                        <Button><Thumbnail size="small" alt="chat" source={ChatMajor} />Contact Support</Button>
                                        <Button>Read FAQ</Button></div>
                                    <Thumbnail size="small" alt="chat" source={RibbonReel_BrandElements} />
                                </div>
                            </Card>
                        </div>
                    </Layout.Section>
                </Layout>
                <div className='merchant-footer_wrap'>
                    <Stack>
                        <Stack.Item><Thumbnail size="small" alt="logo" source={Mark} /><h2>ribbonreel</h2></Stack.Item>
                        <Stack.Item>
                            © 2022 RibbonReel. All rights reserved. <span>Privacy Policy</span>
                        </Stack.Item>
                    </Stack>
                </div>
            </Page>
        </div>
    );
}

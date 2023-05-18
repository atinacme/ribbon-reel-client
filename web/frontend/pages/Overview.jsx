import React, { useState, useEffect } from 'react';
import {
    Card, Page, Layout, Button, Stack, IndexTable, Heading, TextContainer, Thumbnail
} from "@shopify/polaris";
import { ChatMajor } from '@shopify/polaris-icons';
import { Mark, chat, RibbonReel_BrandElements, Imageshoe, arrow, MerchantDashboard } from "../assets";
// import Chart from 'chart.js/auto';
// import { Bar } from 'react-chartjs-2';
import { Footer } from '../components';
import { OrderGetService } from '../services/OrderService';
import { useAuthenticatedFetch } from '../hooks';
import { useNavigate } from '@shopify/app-bridge-react';

export default function Overview() {
    // const [selected, setSelected] = useState('today');
    const [accountSetUp, setAccountSetUp] = useState(false);
    const [giftRevenue, setGiftRevenue] = useState();
    const [giftCustomer, setGiftCustomer] = useState();
    const [giftOrder, setGiftOrder] = useState();
    const [recentOrder, setRecentOrder] = useState([]);
    const fetch = useAuthenticatedFetch();
    const resourceName = {
        singular: 'customer',
        plural: 'customers',
    };
    const navigate = useNavigate();

    useEffect(() => {
        const handleGiftData = async () => {
            try {
                const result = await OrderGetService();
                if (result) {
                    var sum = 0;
                    var cust;
                    var customer = [];
                    result.forEach(element => {
                        sum += parseInt(element.reel_revenue);
                        customer.push(element.sender_email);
                        let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index);
                        cust = [...new Set(findDuplicates(customer))].length;
                    });
                    setGiftRevenue(sum);
                    setGiftCustomer(cust);
                    setGiftOrder(result.length);
                }
            } catch (e) { }
        };
        const handleGetAllOrders = () => {
            try {
                fetch("/api/orders/all").then((res) => res.json()).then((data) => {
                    const lineItems = data.map(itm => itm.line_items.map((itms) => (itms.vendor.indexOf("RIBBON_REELS_CARD") > -1 ? itms.vendor : 0)).indexOf("RIBBON_REELS_CARD") > -1 ? itm : []);
                    const rows = lineItems.map(element => {
                        if (!Array.isArray(element)) {
                            return element;
                        }
                    });
                    const rowsArray = rows.filter(item => item !== undefined);
                    setRecentOrder(rowsArray);
                });
            } catch (e) { }
        };
        handleGiftData();
        handleGetAllOrders();
    }, []);

    // const handleSelectChange = useCallback((value) => setSelected(value), []);

    // const options = [
    //     { label: 'Today', value: 'today' },
    //     { label: 'Yesterday', value: 'yesterday' },
    //     { label: 'Last 7 days', value: 'lastWeek' },
    // ];

    // const state = {
    //     labels: ['January', 'February', 'March',
    //         'April', 'May'],
    //     datasets: [
    //         {
    //             label: 'Rainfall',
    //             backgroundColor: '#4F0ACC',
    //             borderColor: '#4F0ACC',
    //             borderWidth: 2,
    //             data: [65, 59, 80, 81, 56]
    //         }
    //     ]
    // };

    const rowMarkup = recentOrder[0]?.line_items.map(
        (item, index) => (
            <IndexTable.Row id={item.id} key={item.id} position={index}>
                <IndexTable.Cell>{item.title}</IndexTable.Cell>
                <IndexTable.Cell>{item.price}</IndexTable.Cell>
                <IndexTable.Cell>{item.sku}</IndexTable.Cell>
                <IndexTable.Cell>{item.quantity}</IndexTable.Cell>
                <IndexTable.Cell>{item.price}</IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    return (
        <div>
            {!accountSetUp ?
                <div>
                    <Card sectioned>
                        <div style={{ display: 'block', alignItems: 'center' }}>
                            <Stack.Item><Thumbnail size="small" alt="logo" source={MerchantDashboard} /></Stack.Item>
                            <h3>Oh! Seems like some ribbons were left out...</h3>
                            <h4>We just need need to wrap the setup!</h4>
                            <Stack.Item><Button onClick={() => setAccountSetUp(true)}>Finish Account Setup</Button></Stack.Item>
                        </div>
                    </Card>
                </div>
                :
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
                                            <h4>${giftRevenue}</h4>
                                            <Stack.Item>
                                                <div className='arrow-wrap'> <img src={arrow} />3%</div>
                                                <TextContainer>+$39.8 this week</TextContainer>
                                            </Stack.Item>
                                        </div>
                                    </Card>
                                    <Card sectioned>
                                        <div style={{ display: 'block', alignItems: 'center' }}>
                                            <h2>Total Gifting Customers</h2>
                                            <h4>{giftCustomer}</h4>
                                            <Stack.Item>
                                                <div className='arrow-wrap'> <img src={arrow} />3%</div>
                                                <TextContainer>+$39.8 this week</TextContainer>
                                            </Stack.Item>
                                        </div>
                                    </Card>
                                    <Card sectioned>
                                        <div style={{ display: 'block', alignItems: 'center' }}>
                                            <h2>Total Reel Orders</h2>
                                            <h4>{giftOrder}</h4>
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
                    {/* <Layout>
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
                    </Layout> */}
                    <Layout>
                        <Layout.Section>
                            <div>
                                <Card sectioned>
                                    <div style={{ display: 'block', alignItems: 'center' }}>
                                        <div className='recent-order'>
                                            <h3>Recent Orders</h3>
                                            <Button onClick={() => navigate('/ReelOrders')}>View Orders</Button>
                                        </div>
                                        <IndexTable
                                            resourceName={resourceName}
                                            itemCount={recentOrder.length}
                                            headings={[
                                                { title: 'Product' },
                                                { title: 'Price' },
                                                { title: 'SKU Number' },
                                                { title: 'Net quantity' },
                                                { title: 'Net sales' },
                                            ]}
                                            selectable={false}
                                        >
                                            {rowMarkup}
                                        </IndexTable>
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
                                            <Button onClick={() => navigate('/Support')}><Thumbnail size="small" alt="chat" source={ChatMajor} />Contact Support</Button>
                                            <Button onClick={() => navigate('/Support')}>Read FAQ</Button></div>
                                        <Thumbnail size="small" alt="chat" source={RibbonReel_BrandElements} />
                                    </div>
                                </Card>
                            </div>
                        </Layout.Section>
                    </Layout>
                </Page>
            }
            <Footer />
        </div>
    );
}

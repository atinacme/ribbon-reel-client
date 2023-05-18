import React, { useState, useCallback, useEffect } from 'react';
import {
    Heading, Button, IndexTable, Card, Modal, TextContainer, Stack
} from '@shopify/polaris';
import { Footer } from '../components';
import moment from 'moment';
import { useAuthenticatedFetch } from '../hooks';
import { OrderCreateService } from '../services/OrderService';

export default function ReelOrders() {
    const [customers, setCustomers] = useState([]);
    const [active, setActive] = useState(false);
    // const [orderNumber, setOrderNumber] = useState();
    const [orderId, setOrderId] = useState();
    // const [addedVideo, setAddedVideo] = useState();
    const [orderData, setOrderData] = useState();
    const resourceName = {
        singular: 'customer',
        plural: 'customers',
    };
    const fetch = useAuthenticatedFetch();

    useEffect(() => {
        var shop;
        try {
            const ShopData = async () => {
                fetch("/api/shop")
                    .then((res) => res.json())
                    .then((data) => {
                        shop = data[0].shop_owner;
                    });
            };
            ShopData();
        } catch (e) { }
        try {
            const handleGetAllOrders = async () => {
                fetch("/api/orders/all").then((res) => res.json()).then((data) => {
                    const lineItems = data.map(itm => itm.line_items.map((itms) => (itms.vendor.indexOf("RIBBON_REELS_CARD") > -1 ? itms.vendor : 0)).indexOf("RIBBON_REELS_CARD") > -1 ? itm : []);
                    const rows = lineItems.map(element => {
                        if (!Array.isArray(element)) {
                            return element;
                        }
                    });
                    const rowsArray = rows.filter(item => item !== undefined);
                    setCustomers(rowsArray);
                    const newArr = rowsArray.map(v => ({
                        ...v, store_owner: shop,
                        reel_revenue: v.line_items[0].price
                    }));
                    // OrderCreateService(newArr);
                });
            };
            handleGetAllOrders();
        } catch (e) { }
    }, []);

    const handleChange = useCallback(() => setActive(!active), [active]);

    const rowMarkup = customers.map(
        (item, index) => (
            <IndexTable.Row id={item.id} key={item.id} position={index}>
                <IndexTable.Cell>{item.name}</IndexTable.Cell>
                <IndexTable.Cell>{moment(item.created_at).format('MM/DD/YYYY')}</IndexTable.Cell>
                <IndexTable.Cell>{item.customer.first_name + " " + item.customer.last_name}</IndexTable.Cell>
                <IndexTable.Cell>{item.total_price}</IndexTable.Cell>
                <IndexTable.Cell>{item.line_items[0].price}</IndexTable.Cell>
                <IndexTable.Cell>{item.source_name}</IndexTable.Cell>
                <IndexTable.Cell>{item.line_items.length}</IndexTable.Cell>
                <IndexTable.Cell>
                    <Button onClick={async () => {
                        setOrderData();
                        setActive(!active);
                        setOrderId(item.id);
                        // setOrderNumber(item.order_number);
                        fetch(`/api/order/${item.id}`).then((res) => res.json()).then((data) => {
                            setOrderData(data);
                        });
                    }}>View</Button>
                </IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    return (
        <div className='order-wrapper'>
            <Heading>Reel Orders</Heading>
            <Card>
                <IndexTable
                    resourceName={resourceName}
                    itemCount={customers.length}
                    headings={[
                        { title: 'Order' },
                        { title: 'Date' },
                        { title: 'Customer' },
                        { title: 'Total' },
                        { title: 'Reel Revenue' },
                        { title: 'Shipping Status' },
                        { title: 'Items' },
                        { title: 'Details' }
                    ]}
                    selectable={false}
                >
                    {rowMarkup}
                </IndexTable>
            </Card>
            <Modal
                open={active}
                onClose={handleChange}
                title={`Details of Order with Id ${orderId}`}
                secondaryActions={[
                    {
                        content: 'Close',
                        onAction: handleChange,
                    },
                ]}
            >
                <Modal.Section>
                    <TextContainer>
                        <Stack vertical>
                            <div className='heading-wrap'>
                                <Heading variant="headingMd" as="h2">
                                    Order Details
                                </Heading>
                            </div>
                            {orderData && (
                                <div className='shipping-list'>
                                    <ul>
                                        <li>Order Number: <span>{orderData.name}</span></li>
                                        <li>Total Price: <span>{orderData.subtotal_price}</span></li>
                                        <li>Currency:  <span>{orderData.currency}</span></li>
                                    </ul>
                                </div>
                            )}
                            <div className='heading-wrap'>
                                <Heading variant="headingMd" as="h2">
                                    Shipping Address
                                </Heading>
                            </div>
                            {orderData && (
                                <div className='shipping-list'>
                                    <ul>
                                        <li>Name: <span>{orderData.shipping_address?.name}</span></li>
                                        <li>Company: <span>{orderData.shipping_address?.company}</span></li>
                                        <li>Country:  <span>{orderData.shipping_address?.country}</span></li>
                                        <li>Country Code: <span>{orderData.shipping_address?.country_code}</span></li>
                                        <li>Phone: <span>{orderData.shipping_address?.phone} </span></li>
                                        <li>Province: <span>{orderData.shipping_address?.province} </span></li>
                                    </ul>
                                </div>
                            )}
                            <div className='heading-wrap'>
                                <Heading variant="headingMd" as="h2">
                                    Customer Details
                                </Heading>
                            </div>
                            {orderData && (
                                <div className='shipping-list'>
                                    <ul>
                                        <li>Name: <span>{orderData.customer.first_name + " " + orderData.customer.last_name}</span></li>
                                        <li>Email: <span>{orderData.customer.email}</span></li>
                                        <li>Phone: <span>{orderData.customer.phone}</span></li>
                                    </ul>
                                </div>
                            )}
                        </Stack>
                    </TextContainer>
                </Modal.Section>
            </Modal>
            <Footer />
        </div>
    );
}

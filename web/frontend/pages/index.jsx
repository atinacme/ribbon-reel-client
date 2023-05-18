import React, { useState, useEffect } from 'react';
import {
  Card, Page, Layout, TextContainer, Link, Heading, Button, Thumbnail, Stack, ButtonGroup, Banner
} from "@shopify/polaris";
import { TitleBar, useNavigate } from "@shopify/app-bridge-react";
import { Mark, Vector1 } from "../assets";
import { YourInfo, SubscriptionPlan, Style } from '../components';
import { useAuthenticatedFetch } from '../hooks';
import { useSelector, useDispatch } from "react-redux";
import { HomePageAction } from '../redux/Actions';
import { OnboardingCreateService } from '../services/OnboardingService';

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [freeTrial, setFreeTrail] = useState(false);
  const [progressBarStep1, setProgressBarStep1] = useState();
  const [progressBarStep2, setProgressBarStep2] = useState();
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const fetch = useAuthenticatedFetch();
  const navigate = useNavigate();

  const handleBack = () => {
    if (page === 1) {
      setFreeTrail(false);
    } else if (page === 2) {
      setPage(1);
    } else {
      setPage(2);
    }
  };
  const handleNext = () => {
    if (page === 1) {
      setPage(2);
      setProgressBarStep1("progress-bar");
    } else if (page === 2) {
      setPage(3);
      setProgressBarStep2("progress-bar");
    } else {
      setPage(4);
    }
  };
  useEffect(() => {
    const ShopData = async () => {
      try {
        fetch("/api/shop")
          .then((res) => res.json())
          .then((data) => {
            console.log("sucxg-->", data)
            dispatch(HomePageAction(data.data[0].shop_owner, data.data[0].name, data.data[0].email, state.homePage.subscription_plan_cost, state.homePage.style_layout));
          });
      } catch (e) {
        console.log(e)
      }
    };
    ShopData();
    const Utils = async () => {
      try {
        fetch("/auth/callback")
          .then((res) => res.json())
          .then((data) => { console.log(data) });
      } catch (e) {
        console.log(e)
      }
    };
    Utils();
  }, []);
  const handleSubmitOnboarding = async () => {
    const data = {
      merchant_name: state.homePage.store_owner,
      store_name: state.homePage.store_name,
      account_email: state.homePage.store_email,
      layout: state.homePage.style_layout,
      subscription_plan: state.homePage.subscription_plan_cost
    };
    try {
      const result = await OnboardingCreateService(data);
      if (result) {
        navigate('/ReelOrders');
      }
    } catch (e) { }
  };
  return (
    <>
      {!freeTrial ?
        <Page narrowWidth>
          <TitleBar title="App name" primaryAction={null} />
          <Stack>
            <Stack.Item fill>
              <Heading>Approve Subscription</Heading>
            </Stack.Item>
            <Stack.Item>
              <Button>Cancel</Button>
            </Stack.Item>
          </Stack>
          <div style={{ width: '100%', float: 'right' }}>
            <Banner
              title="Before you can purchase a shipping label, this change needs to be made:"
              status="warning"
            ></Banner>
          </div>
          <Layout>
            <div className="riben-reels-wrapper">
              <div className="left-ribon-reels_plan">
                <Layout.Section>
                  <Card sectioned>
                    <TextContainer>
                      <div className="riben-content">
                        <div className="riben-content_img">
                          <svg xmlns="http://www.w3.org/2000/svg" width="51" height="51" viewBox="0 0 51 51" fill="none">
                            <rect width="51" height="51" rx="3.1875" fill="#4F0ACC" />
                            <g clipPath="url(#clip0_317_11490)">
                              <path fillRule="evenodd" clipRule="evenodd" d="M8.03781 13.6816H12.8395C14.1122 13.6816 15.3328 14.1872 16.2328 15.0872C17.1328 15.9871 17.6383 17.2078 17.6383 18.4805H12.8395V28.081C13.4699 28.081 14.0942 28.2052 14.6766 28.4466C15.259 28.6879 15.7881 29.0417 16.2338 29.4876C16.6794 29.9335 17.0328 30.4628 17.2738 31.0454C17.5148 31.6279 17.6387 32.2523 17.6383 32.8827V37.6816H12.8395V28.081C12.209 28.0814 11.5847 27.9575 11.0022 27.7165C10.4196 27.4755 9.89028 27.1221 9.44437 26.6765C8.99845 26.2308 8.64472 25.7017 8.40337 25.1193C8.16203 24.5369 8.03781 23.9126 8.03781 23.2822V13.6816ZM17.6383 18.4805C18.2688 18.4805 18.893 18.6047 19.4754 18.846C20.0578 19.0874 20.587 19.4411 21.0326 19.887C21.4783 20.333 21.8317 20.8623 22.0727 21.4449C22.3137 22.0274 22.4376 22.6517 22.4372 23.2822V28.081C21.1645 28.081 19.9439 27.5754 19.0439 26.6755C18.1439 25.7755 17.6383 24.5549 17.6383 23.2822V18.4805ZM32.5725 13.6816V18.4805C32.5721 19.1109 32.696 19.7352 32.937 20.3178C33.178 20.9003 33.5314 21.4297 33.9771 21.8756C34.4227 22.3215 34.9518 22.6753 35.5343 22.9166C36.1167 23.158 36.7409 23.2822 37.3714 23.2822L37.3714 32.8827H32.5725C32.5725 34.1554 33.0781 35.376 33.9781 36.276C34.878 37.176 36.0986 37.6816 37.3714 37.6816H42.173V28.081C42.173 27.4506 42.0488 26.8263 41.8075 26.2439C41.5661 25.6615 41.2124 25.1324 40.7665 24.6867C40.3206 24.2411 39.7912 23.8876 39.2087 23.6466C38.6261 23.4057 38.0018 23.2818 37.3714 23.2822V13.6816H32.5725ZM22.972 18.4805V13.6816H27.7737V23.2822C29.0464 23.2822 30.267 23.7878 31.1669 24.6877C32.0669 25.5877 32.5725 26.8083 32.5725 28.081V32.8827C31.942 32.8827 31.3178 32.7585 30.7354 32.5171C30.153 32.2758 29.6238 31.9221 29.1782 31.4762C28.7325 31.0302 28.3791 30.5009 28.1381 29.9183C27.8971 29.3358 27.7733 28.7115 27.7736 28.081V23.2822C26.5002 23.2822 25.2788 22.7763 24.3784 21.8758C23.4779 20.9753 22.972 19.754 22.972 18.4805ZM22.4372 37.6816V28.081C23.7107 28.081 24.932 28.5869 25.8325 29.4874C26.733 30.3879 27.2389 31.6092 27.2389 32.8827V37.6816H22.4372Z" fill="white" />
                            </g>
                            <defs>
                              <clipPath id="clip0_317_11490">
                                <rect width="34.1352" height="23.9999" fill="white" transform="translate(8.03781 13.6816)" />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                        <div className="riben-heading">
                          <Heading>Ribbon Reel</Heading>
                          <div style={{ display: 'flex' }}>by<span className="placeholder col-6"></span></div>
                        </div>
                      </div>
                    </TextContainer>
                    <hr />
                    <TextContainer>
                      <Heading>Ribbon Reel</Heading>
                      <div style={{ display: 'flex' }}><span className="placeholder col-6" style={{ width: '54px', height: '19px', marginleft: '5px' }}></span>USD every 30 days</div>
                      <div style={{ display: 'flex' }}>Basic Plan-<span className="placeholder col-6" style={{ width: '54px', height: '19px', margin: '0 5px' }}></span>USD</div>
                    </TextContainer>
                  </Card>
                </Layout.Section>
              </div>
              <div className="right_riben-reels">
                <Layout.Section>
                  <Card title="On your next bill" sectioned>
                    <TextContainer>
                      <div style={{ display: 'block', margin: '5px' }}>
                        <div className="heading-with-bg">  <Heading>Ribbon Reel</Heading> </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>$<span className="placeholder col-6" style={{ width: '44px', height: '19px' }}></span>USD</div>
                        <p>Recurring every 30 days</p>
                        <p>Starts today</p>
                      </div>
                    </TextContainer>
                    <hr />
                    <div className="riben-para">
                      <p>30 days free trial</p>
                      <p>Trial ends 19th August 2021</p>
                    </div>
                    <hr />
                    <Stack>
                      <Stack.Item fill>
                        <p>Amount</p>
                      </Stack.Item>
                      <Stack.Item>
                        <strong>$<span className="placeholder col-6" style={{
                          width: '43px',
                          height: '15px'
                        }}></span>USD</strong>
                      </Stack.Item>
                    </Stack>
                    <Stack>
                      <Stack.Item fill>
                        <p>Date</p>
                      </Stack.Item>
                      <Stack.Item>
                        <strong>19th August 2021</strong>
                      </Stack.Item>
                    </Stack>
                    <div style={{ padding: '20px' }}> <Button style={{ width: 'auto' }} primary onClick={() => setFreeTrail(true)}>Start free trial</Button></div>
                  </Card>
                </Layout.Section>
              </div>
            </div>
          </Layout>
          <div style={{ textAlignLast: 'center' }}>
            By proceeding, you are agreeing to the <Link>Terms of Service</Link>,<br />
            Subject to government tax and other prevailing charges.
          </div>
        </Page>
        :
        <div className='onboard-wrap'>
          <Page narrowWidth>
            <div className='onboard-items'>
              <Stack fill>
                <Stack.Item><div style={{ display: 'flex', alignItems: 'center' }}><Thumbnail size="small" alt="logo" source={Mark} /><h2>ribbonreel</h2></div></Stack.Item>
                <div className='onboard-progressbar'>
                  <TextContainer>
                    <div className='progress-wrap'>
                      <span>1</span>
                      <div className="progress">
                        <div className={progressBarStep1} role="progressbar" style={{ width: '100%' }} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                    <div className='progress-wrap'>
                      <span>2</span>
                      <div className="progress">
                        <div className={progressBarStep2} role="progressbar" style={{ width: '100%' }} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                    <div className='progress-wrap'>
                      <span>3</span>
                    </div>
                  </TextContainer>
                </div>
              </Stack>
            </div>
            {page === 1 ?
              <YourInfo />
              : page === 2 ?
                <SubscriptionPlan />
                : page === 3 ?
                  <Style />
                  :
                  <Layout>
                    <Layout.Section>
                      <div className='congrats-wrap'>
                        <Card sectioned>
                          <div style={{ display: 'block', alignItems: 'center' }}>
                            <Stack.Item><Thumbnail size="small" alt="logo" source={Vector1} /></Stack.Item>
                            <h3>Congratulations you finished setting up RibbonReel!</h3>
                            <h4>Your customers can now gift thier firends and family with Reels.</h4>
                            <Stack.Item><Button onClick={handleSubmitOnboarding}>Continue to Site</Button></Stack.Item>
                            <Stack.Item><Thumbnail size="small" alt="logo" source={Mark} />ribbonreel</Stack.Item>
                          </div>
                        </Card>
                      </div>
                    </Layout.Section>
                  </Layout>
            }
            {page === 1 || page === 2 || page === 3 ?
              <div className='copyright'>
                <Stack>
                  <Stack.Item>
                    © 2022 RibbonReel. All rights reserved. <span>Privacy Policy</span>
                  </Stack.Item>
                  <Stack.Item>
                    <ButtonGroup>
                      <Button onClick={handleBack}>Back</Button>
                      <div className="next-cta"><Button onClick={handleNext}>Next</Button></div>
                    </ButtonGroup>
                  </Stack.Item>
                </Stack>
              </div>
              : null}
          </Page>
        </div>
      }
    </>
  );
}

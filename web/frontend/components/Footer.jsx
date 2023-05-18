import React from 'react'
import { Stack, Thumbnail } from "@shopify/polaris";
import { Mark } from "../assets";

export function Footer() {
    return (
        <div className='merchant-footer_wrap'>
            <Stack>
                <Stack.Item><Thumbnail size="small" alt="logo" source={Mark} /><h2>ribbonreel</h2></Stack.Item>
                <Stack.Item>
                    © 2022 RibbonReel. All rights reserved. <span>Privacy Policy</span>
                </Stack.Item>
            </Stack>
        </div>
    )
}

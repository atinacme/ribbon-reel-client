import React, { useState, useCallback } from 'react';
import { Card, Layout, DropZone, RadioButton, Thumbnail } from "@shopify/polaris";
import { Vector } from "../assets";
import { useSelector, useDispatch } from "react-redux";
import { HomePageAction, SettingsPageAction } from '../redux/Actions';
import { useLocation } from 'react-router-dom';

export function Style() {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const location = useLocation();
    const [files, setFiles] = useState([]);
    const [value, setValue] = useState(location.pathname === "/Settings" ? state.settingsPage.style_layout : 'compact');

    const handleDropZoneDrop = useCallback(
        (_dropFiles, acceptedFiles, _rejectedFiles) =>
            setFiles((files) => [...files, ...acceptedFiles]),
        [],
    );

    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    const fileUpload = !files.length && <>
        <Thumbnail size="small" alt="video camera" source={Vector} />
        <DropZone.FileUpload actionTitle='Add a video Message.' /><p>Powered by <span>RibbonReel</span></p>
    </>;
    const uploadedFiles = files.length > 0 && (
        <div style={{ padding: '0' }}>
            <Stack vertical>
                {files.map((file, index) => (
                    <Stack alignment="center" key={index}>
                        <Thumbnail
                            size="small"
                            alt={file.name}
                            source={
                                validImageTypes.includes(file.type)
                                    ? window.URL.createObjectURL(file)
                                    : NoteMinor
                            }
                        />
                        <div>
                            {file.name} <Caption>{file.size} bytes</Caption>
                        </div>
                    </Stack>
                ))}
            </Stack>
        </div>
    );

    const handleChange = useCallback((_checked, newValue) => {
        setValue(newValue);
        if (location.pathname === "/Settings") {
            dispatch(SettingsPageAction(state.settingsPage.store_owner, state.settingsPage.store_name, state.settingsPage.store_email, state.settingsPage.subscription_plan_cost, newValue, state.settingsPage.marketing_notifications, state.settingsPage.order_notifications, state.settingsPage.update_notifications));
        } else {
            dispatch(HomePageAction(state.homePage.store_owner, state.homePage.store_name, state.homePage.store_email, state.homePage.subscription_plan_cost, newValue));
        }
    }, []);

    return (
        <Layout>
            <Layout.Section>
                <div className='compact-layout_wrap'>
                    <Card title="Style" sectioned>
                        <p>Manage the design RibbonReel in your Cart.</p>
                        <h3>Select Your Layout</h3>
                        <div style={{ display: 'flex', paddingTop: '24px' }} className='compact-layout_card'>
                            <Card sectioned>
                                <div className='compact-dropzone'>  <DropZone onDrop={handleDropZoneDrop}>
                                    {uploadedFiles}
                                    {fileUpload}
                                </DropZone>
                                </div>
                                <RadioButton
                                    label="Compact Layout"
                                    helpText="Minimal design to maximize space"
                                    checked={value === 'compact'}
                                    id="compact"
                                    name="compact_layout"
                                    onChange={handleChange}
                                />
                                <strong>Recommended</strong>
                            </Card>
                            <Card sectioned>
                                <div className='compact-dropzone'>
                                    <DropZone onDrop={handleDropZoneDrop}>
                                        {uploadedFiles}
                                        {fileUpload}
                                    </DropZone>
                                </div>
                                <RadioButton
                                    label="Expanded Layout"
                                    helpText="Draw attention to gifting option"
                                    checked={value === 'expanded'}
                                    id="expanded"
                                    name="expanded_layout"
                                    onChange={handleChange}
                                />
                            </Card>
                            <Card sectioned>
                                <div className='compact-dropzone'>  <DropZone onDrop={handleDropZoneDrop}>
                                    {uploadedFiles}
                                    {fileUpload}
                                </DropZone>
                                </div>
                                <RadioButton
                                    label="Accordion Layout"
                                    helpText="Minimal design to maximize space"
                                    checked={value === 'accordion'}
                                    id="accordion"
                                    name="accordion_layout"
                                    onChange={handleChange}
                                />
                            </Card>
                        </div>
                    </Card>
                </div>
            </Layout.Section>
        </Layout>
    );
}

import React, { useState, useCallback } from 'react'
import {
    Heading, TextField, Icon, Button, Popover, OptionList, Card, Form, FormLayout, DropZone, Stack, Thumbnail
} from '@shopify/polaris'
import {
    ArrowRightMinor, NoteMinor
} from '@shopify/polaris-icons';
import { Trigger, Ellipse } from "../assets";
import { Footer } from '../components';

export default function Support() {
    const [value, setValue] = useState('Jaded Pixel');
    const [sendBtn, setSendBtn] = useState(false);
    const [selected, setSelected] = useState([]);
    const [popoverActive, setPopoverActive] = useState(true);
    const [moreFiltersSelected, setMoreFiltersSelected] = useState([]);
    const [moreFiltersPopoverActive, setMoreFiltersPopoverActive] = useState(true);
    const [files, setFiles] = useState([]);

    const handleSubmit = useCallback((_event) => {
        setSendBtn(true);
    }, []);

    const handleChange = useCallback((newValue) => setValue(newValue), []);

    const togglePopoverActive = useCallback(
        () => setPopoverActive((popoverActive) => !popoverActive),
        [],
    );

    const activator = (
        <Button onClick={togglePopoverActive} disclosure>
            Select Issue Type
        </Button>
    );

    const moreFiltersTogglePopoverActive = useCallback(
        () => setMoreFiltersPopoverActive((moreFiltersPopoverActive) => !moreFiltersPopoverActive),
        [],
    );

    const moreFiltersActivator = (
        <Button onClick={moreFiltersTogglePopoverActive}>
            Choose a Topic
        </Button>
    );

    const handleDropZoneDrop = useCallback(
        (_dropFiles, acceptedFiles, _rejectedFiles) =>
            setFiles((files) => [...files, ...acceptedFiles]),
        [],
    );

    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    const fileUpload = !files.length && (
        <DropZone.FileUpload actionHint="Accepts .gif, .jpg, and .png" />
    );

    const uploadedFiles = files.length > 0 && (
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
                        {file.name}{' '}
                        <Text variant="bodySm" as="p">
                            {file.size} bytes
                        </Text>
                    </div>
                </Stack>
            ))}
        </Stack>
    );
    return (
        <div className='wrapper support-wrap'>
            <Heading>Customer Support</Heading>
            <div className='support-card'>
                <Card sectioned title="Chat With Us" actions={[{ content: <Icon source={ArrowRightMinor} color="base" /> }]}>
                    <p>
                        Real-time conversations with our Customer Support team.
                    </p>
                </Card>
            </div>
            {!sendBtn ?
                <>
                    <div className='support-card'>
                        <Card sectioned title="FAQ" actions={[{ content: <Icon source={ArrowRightMinor} color="base" /> }]}>
                            <p>
                                Read helpful commonly answered questions and tips.
                            </p>
                        </Card>
                    </div>
                    <Card sectioned>
                        <Form onSubmit={handleSubmit}>
                            <FormLayout>
                                <Heading>Email Us</Heading>
                                <p>Send us a message and read our answer when it's convenient for you.</p>
                                <TextField label="Store name" value='Vandelay Industries' disabled autoComplete="off" />
                                <label>Issue Type*</label>
                                <div>
                                    <Popover
                                        active={popoverActive}
                                        activator={activator}
                                        onClose={togglePopoverActive}
                                    >
                                        <OptionList
                                            onChange={setSelected}
                                            options={[
                                                {
                                                    value: 'byward_market',
                                                    label: 'Byward Market',
                                                    // active: true,
                                                },
                                                { value: 'centretown', label: 'Centretown' },
                                                {
                                                    value: 'hintonburg',
                                                    label: 'Hintonburg',
                                                    // active: true,
                                                },
                                                { value: 'westboro', label: 'Westboro' },
                                                { value: 'downtown', label: 'Downtown' },
                                            ]}
                                            selected={selected}
                                        />
                                    </Popover>
                                </div>
                                <label>Tell Us More*</label>
                                <div>
                                    <Popover
                                        active={moreFiltersPopoverActive}
                                        activator={moreFiltersActivator}
                                        onClose={moreFiltersTogglePopoverActive}
                                    >
                                        <OptionList
                                            onChange={setMoreFiltersSelected}
                                            options={[
                                                {
                                                    value: 'byward_market',
                                                    label: 'Byward Market',
                                                    // active: true,
                                                },
                                                { value: 'centretown', label: 'Centretown' },
                                                {
                                                    value: 'hintonburg',
                                                    label: 'Hintonburg',
                                                    // active: true,
                                                },
                                                { value: 'westboro', label: 'Westboro' },
                                                { value: 'downtown', label: 'Downtown' },
                                            ]}
                                            selected={moreFiltersSelected}
                                        />
                                    </Popover>
                                </div>
                                <TextField
                                    label="Subject*"
                                    value={value}
                                    onChange={handleChange}
                                    autoComplete="off"
                                    placeholder='Type your subject'
                                />
                                <TextField
                                    label="Description"
                                    value={value}
                                    onChange={handleChange}
                                    multiline={4}
                                    autoComplete="off"
                                    helpText='Please enter the details of your request. A member of our team will respond as soon as possible.'
                                />
                                <DropZone onDrop={handleDropZoneDrop} variableHeight label="Uplodad Screenshot">
                                    {uploadedFiles}
                                    {fileUpload}
                                </DropZone>
                                <div className='support-submit_wrap'>
                                    <Button submit>Send</Button>
                                </div>
                            </FormLayout>
                        </Form>
                    </Card>
                </>
                :
                <div className='chat-wrapper'>
                    <Card sectioned>
                        <Thumbnail source={Ellipse} alt="Ellipse" />
                        <div>
                            <h2>Operator from RibbonReel</h2>
                            <p>Hi there 👋</p>
                            <p>How can we help you today?</p>
                        </div>
                        <div className='chat-para'>
                            <p>I'm new and want to learn about Intercom.</p>
                            <p>I’m a current customer with a question.</p>
                            <p>Just browsing!</p>
                            <Thumbnail source={Trigger} alt="Trigger" />
                        </div>
                    </Card>
                </div>
            }
            <Footer />
        </div>
    )
}

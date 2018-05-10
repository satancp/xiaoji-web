import React, { Component } from 'react';
import axios from 'axios';
import configs from '../../config';
import { Title } from '~/Components/Title';
import { Form, Input, Tooltip, Upload, Icon, Cascader, Select, Button, Spin } from 'antd';
import Cookies from 'universal-cookie';
import ScrollAnim from 'rc-scroll-anim';
import QueueAnim from 'rc-queue-anim';
import styles from './PublishScreen.css';

const OverPack = ScrollAnim.OverPack;
let BraftEditor;
const cookies = new Cookies();
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;

let categorys = [];
let tags = [];

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

const beforeUpload = file => {
    console.log(file);
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        console.log('Image must smaller than 2MB!');
    }
    return isLt2M;
};

let ResourceAdd = undefined;

class ResourceCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            canRenderEditor: false,
            loading: false,
            richTextLoading: false,
            action: `${configs.server_url}resource/upload`,
            height: 0,
            contentFormat: 'html',
            onChange: this.handleRichChange,
            onRawChange: this.handleRichRawChange,
            language: 'en',
            media: {
                uploadFn: undefined,
                audio: false,
                externalMedias: {
                    image: false,
                    audio: false,
                    video: false,
                    embed: false
                }
            },
            excludeControls: ['code']
        };
        this.handleRichChange = content => {
            console.log(content);
        };
        this.handleRichRawChange = rawContent => {
            console.log(rawContent);
        };
        this.state.media.uploadFn = param => {
            const serverURL = this.state.action;
            const xhr = new XMLHttpRequest();
            const fd = new FormData();
            const successFn = response => {
                param.success({
                    url: JSON.parse(xhr.responseText).data
                });
            };
            const progressFn = event => {
                param.progress(event.loaded / event.total * 100);
            };
            const errorFn = response => {
                param.error({
                    msg: 'unable to upload.'
                });
            };
            xhr.upload.addEventListener('progress', progressFn, false);
            xhr.addEventListener('load', successFn, false);
            xhr.addEventListener('error', errorFn, false);
            xhr.addEventListener('abort', errorFn, false);
            fd.append('fileType', param.file.type.substring(0, param.file.type.indexOf('/')));
            fd.append('file', param.file);
            xhr.open('POST', serverURL, true);
            xhr.send(fd);
        };
        this.handleSubmit = e => {
            e.preventDefault();
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    values.preview_image = values.preview_image[0].response.data;
                    let html = this.editorInstance.getContent('html');
                    values.content = html;
                    values.category_id = values.category[0];
                    delete values.category;
                    const cache = cookies.get('loginInfo');
                    values.created_by = cache.id;
                    console.log(values);
                    axios.post(`${configs.server_url}resource/add`, values).then(response => {
                        this.setState({ data: response.data.data, loading: false });
                        window.location = '/';
                    });
                }
            });
        };
        this.normFile = e => {
            console.log('Upload event:', e);
            if (Array.isArray(e)) {
                return e;
            }
            return e && e.fileList;
        };
        this.handleChange = info => {
            if (info.file.status === 'uploading') {
                this.setState({ loading: true });
                return;
            }
            if (info.file.status === 'done') {
                getBase64(info.file.originFileObj, imageUrl =>
                    this.setState({
                        imageUrl: info.file.response.data,
                        loading: false
                    })
                );
            }
        };
    }

    componentDidMount() {
        const cache = cookies.get('loginInfo');
        if (!cache) {
            window.location = '/user/login';
        }
        BraftEditor = require('braft-editor').default;
        axios.get(`${configs.server_url}category/list`).then(response => {
            if (response.data.code == 0) response = response.data;
            categorys = response.data.map(v => {
                v.value = v.id;
                v.label = v.display_name;
                return v;
            });
            axios.get(`${configs.server_url}tag/list`).then(response => {
                if (response.data.code == 0) response = response.data;
                tags = response.data.map(v => {
                    return <Option key={v.id}>{v.name}</Option>;
                });
                this.setState({ canRenderEditor: true });
            });
        });
    }

    componentWillUnmount() {
        this.setState({ canRenderEditor: false });
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
            }
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0
                },
                sm: {
                    span: 16,
                    offset: 8
                }
            }
        };

        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text" />
            </div>
        );
        const imageUrl = this.state.imageUrl;
        return (
            <div>
                <OverPack id="title" playScale={0} className={styles.container1}>
                    <QueueAnim leaveReverse key="featureWrapper">
                        <Title key="title" name="Publish a new resource" style={{ width: 500 }} />
                    </QueueAnim>
                </OverPack>
                <div className={styles.container}>
                    <QueueAnim className={styles.wrapper} type="scaleBig" delay={200} duration={600}>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <span>
                                        Resource Name&nbsp;
                                        <Tooltip title="What do you want others to call it?">
                                            <Icon type="question-circle-o" />
                                        </Tooltip>
                                    </span>
                                }
                            >
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: 'Please input the name!', whitespace: true }]
                                })(<Input />)}
                            </FormItem>
                            <FormItem {...formItemLayout} label="Category">
                                {getFieldDecorator('category', {
                                    initialValue: ['art'],
                                    rules: [{ type: 'array', required: true, message: 'Please select the category!' }]
                                })(<Cascader options={categorys} />)}
                            </FormItem>
                            <FormItem {...formItemLayout} label="Tags">
                                {getFieldDecorator('tags', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please select tags for the resource!',
                                            type: 'array'
                                        }
                                    ]
                                })(
                                    <Select mode="multiple" placeholder="Please select tags">
                                        {tags}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={<span>Brief Introduction</span>}>
                                {getFieldDecorator('desc', {
                                    rules: [
                                        { required: true, message: 'Please input the description!', whitespace: true }
                                    ]
                                })(<TextArea autosize={true} row={20} />)}
                            </FormItem>
                            <FormItem {...formItemLayout} label="Preview Image">
                                <div className="dropbox">
                                    {getFieldDecorator('preview_image', {
                                        rules: [{ required: true, message: 'Please select a file!' }],
                                        valuePropName: 'fileList',
                                        getValueFromEvent: this.normFile
                                    })(
                                        <Upload
                                            name="avatar"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            action={this.state.action}
                                            beforeUpload={beforeUpload}
                                            onChange={this.handleChange}
                                            data={{ fileType: 'thumbnail' }}
                                        >
                                            {imageUrl ? <img src={imageUrl} alt="" /> : uploadButton}
                                        </Upload>
                                    )}
                                </div>
                            </FormItem>
                            {this.state.canRenderEditor ? (
                                <FormItem {...formItemLayout} label="Content">
                                    <div
                                        style={{
                                            borderStyle: 'solid',
                                            borderWidth: 'thin',
                                            borderColor: '#d8d8d8',
                                            borderRadius: 5
                                        }}
                                    >
                                        <Spin spinning={this.state.richTextLoading}>
                                            {BraftEditor !== undefined ? (
                                                <BraftEditor
                                                    {...this.state}
                                                    ref={instance => (this.editorInstance = instance)}
                                                />
                                            ) : null}
                                        </Spin>
                                    </div>
                                </FormItem>
                            ) : null}
                            <FormItem {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit">
                                    Publish
                                </Button>
                            </FormItem>
                        </Form>
                    </QueueAnim>
                </div>
            </div>
        );
    }
}

export default (ResourceAdd = Form.create()(ResourceCreateForm));

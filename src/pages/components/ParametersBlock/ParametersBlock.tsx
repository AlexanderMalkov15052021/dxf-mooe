import { ConverterStor } from "@/entities";
import { observer } from "mobx-react-lite";
import { RotateRightOutlined } from "@ant-design/icons";
import styles from "./ParametersBlock.module.css";
import { Button, Form, FormProps, Input } from 'antd/lib';
import Title from "antd/lib/typography/Title";
import { FieldType } from "@/types";



const ParametersBlock = observer(() => {
    const {
        store: { mooeDoc, setParams },
    } = ConverterStor;

    const [form] = Form.useForm();

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log(values);


        setParams(values);


        // setFormValues(values);
        // setIsModalOpen(true);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
        // setFormValues(null);
    };

    return <>
        <Form
            form={form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ rotAngle: "0", autocadPointX: "0", moeePointX: "0", autocadPointY: "0", moeePointY: "0" }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className={styles["form"]}
        >
            <div className={styles["form-block"]}>

                <div className={styles["form-item"]}>
                    <Title className={styles["item-title"]} level={4}>Дополнительные данные</Title>
                    <div className={styles["form-item-block"]}>

                        <Title className={styles.subTitle} level={5}>{"Угол поворота:"}</Title>
                        <div className={styles["item-content"]}>
                            <Form.Item<FieldType>
                                label={<RotateRightOutlined style={{ fontSize: '32px' }} />}
                                name="rotAngle"
                                rules={[{ required: true, message: 'Пожалуйста, введите угол поворота!' }]}
                                className={styles["input-wrapper"]}
                            >
                                <Input type="number" autoComplete="on" />
                            </Form.Item>

                        </div>
                    </div>

                </div>
                <div className={styles["form-item"]}>
                    <Title className={styles["item-title"]} level={4}>Настройка систем координат</Title>
                    <div className={styles["item-content"]}>
                        <div className={styles["form-item-block"]}>

                            <Title className={styles.subTitle} level={5}>{"Точка Autocad:"}</Title>

                            <Form.Item<FieldType>
                                label={"x:"}
                                name="autocadPointX"
                                rules={[{ required: true, message: 'Пожалуйста, введите угол поворота!' }]}
                                className={styles["input-wrapper"]}
                            >
                                <Input type="number" autoComplete="on" />
                            </Form.Item>
                            <Form.Item<FieldType>
                                label={"y:"}
                                name="autocadPointY"
                                rules={[{ required: true, message: 'Пожалуйста, введите угол поворота!' }]}
                                className={styles["input-wrapper"]}
                            >
                                <Input type="number" autoComplete="on" />
                            </Form.Item>

                        </div>
                        <div className={styles["form-item-block"]}>

                            <Title className={styles.subTitle} level={5}>{"Точка Mooe:"}</Title>

                            <Form.Item<FieldType>
                                label={"x:"}
                                name="moeePointX"
                                rules={[{ required: true, message: 'Пожалуйста, введите угол поворота!' }]}
                                className={styles["input-wrapper"]}
                            >
                                <Input type="number" autoComplete="on" />
                            </Form.Item>
                            <Form.Item<FieldType>
                                label={"y:"}
                                name="moeePointY"
                                rules={[{ required: true, message: 'Пожалуйста, введите угол поворота!' }]}
                                className={styles["input-wrapper"]}
                            >
                                <Input type="number" autoComplete="on" />
                            </Form.Item>

                        </div>
                    </div>
                </div>

            </div>


            <Form.Item wrapperCol={{ offset: 8, span: 16 }} className={styles["submit-btn"]}>
                <Button disabled={!mooeDoc ? true : false} type="primary" htmlType="submit">
                    Применить
                </Button>
            </Form.Item>


        </Form>

    </>
});

export default ParametersBlock;
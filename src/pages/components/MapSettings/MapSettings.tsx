import { ConverterStor } from "@/entities";
import { observer } from "mobx-react-lite";
import { ArrowsAltOutlined, RotateRightOutlined, ShrinkOutlined } from "@ant-design/icons";
import styles from "./MapSettings.module.css";
import { Button, Form, FormProps, Input } from 'antd/lib';
import Title from "antd/lib/typography/Title";
import { FieldType } from "@/types";
import { FormEvent } from "react";

const MapSettings = observer(() => {
    const {
        store: { mooeDoc, dxfStr, inaccuracy, permission, setInaccuracy, setParams, setPermission, setRotAngle },
    } = ConverterStor;

    const [form] = Form.useForm();

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        setParams(values);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const changeInaccuracyHandler = (evt: FormEvent<HTMLInputElement>) => {
        setInaccuracy(evt.currentTarget.value);
    }

    const permissionhcangeHandler = (evt: FormEvent<HTMLInputElement>) => {
        setPermission(evt.currentTarget.value);
    }

    const changeRotAngleHandler = (evt: FormEvent<HTMLInputElement>) => {
        setRotAngle(evt.currentTarget.value);
    }

    return <>
        <Form
            form={form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{
                rotAngle: "0",
                autocadPointX: "0",
                moeePointX: "0",
                autocadPointY: "0",
                moeePointY: "0",
                inaccuracy,
                permission
            }}
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
                                <Input onChange={changeRotAngleHandler} type="number" autoComplete="on" />
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





                <div className={styles["form-item"]}>
                    <Title className={styles["item-title"]} level={4}>Настройка параметров карты</Title>
                    <div className={styles["item-content"]}>




                        <div className={styles["form-item-block"]}>

                            <Title className={styles.subTitle} level={5}>{"Погрешность:"}</Title>

                            <Form.Item<FieldType>
                                label={<ArrowsAltOutlined style={{ fontSize: '32px' }} />}
                                name="inaccuracy"
                                rules={[{ required: true, message: 'Пожалуйста, введите угол поворота!' }]}
                                className={styles["input-wrapper"]}
                            >
                                <Input onChange={changeInaccuracyHandler} type="number" autoComplete="on" />
                            </Form.Item>

                        </div>

                        <div className={styles["form-item-block"]}>

                            <Title className={styles.subTitle} level={5}>{"Допуск:"}</Title>

                            <Form.Item<FieldType>
                                label={<ShrinkOutlined style={{ fontSize: '32px' }} />}
                                name="permission"
                                rules={[{ required: true, message: 'Пожалуйста, введите угол поворота!' }]}
                                className={styles["input-wrapper"]}
                            >
                                <Input onChange={permissionhcangeHandler} type="number" autoComplete="on" />
                            </Form.Item>

                        </div>









                    </div>
                </div>







            </div>


            <Form.Item wrapperCol={{ offset: 8, span: 16 }} className={styles["submit-btn"]}>
                <Button disabled={!mooeDoc || !dxfStr ? true : false} type="primary" htmlType="submit">
                    Применить
                </Button>
            </Form.Item>


        </Form>
    </>
});

export default MapSettings;
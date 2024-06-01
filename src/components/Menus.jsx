import React, { useState } from "react";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu, Switch } from "antd";
import { useNavigate } from "react-router-dom";
const items = [
  {
    key: "sub1",
    label: "Navigation One",
    icon: <MailOutlined />,
    children: [
      {
        key: "1",
        label: "Livestream",
        link: "/",
      },
      {
        key: "2",
        label: "Pre-record stream",
        link: "/pre",
      },
      {
        key: "3",
        label: "Analytic",
        link: "/analytic",
      },
    ],
  },
];
const App = () => {
  const [theme, setTheme] = useState("dark");
  const [current, setCurrent] = useState("1");
  const navigate = useNavigate();
  const changeTheme = (value) => {
    setTheme(value ? "dark" : "light");
  };
  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
    const item = findItemByKey(items, e.key);
    if (item && item.link) {
      navigate(item.link);
    }
  };

  const findItemByKey = (items, key) => {
    for (const item of items) {
      if (item.key === key) {
        return item;
      }
      if (item.children) {
        const childItem = findItemByKey(item.children, key);
        if (childItem) {
          return childItem;
        }
      }
    }
    return null;
  };
  return (
    <>
      <Menu
        theme={"light"}
        onClick={onClick}
        style={{
          backgroundColor: "#EBEBEB",
          width: 200,
        }}
        defaultOpenKeys={["sub1"]}
        selectedKeys={[current]}
        mode="inline"
        items={items}
      />
    </>
  );
};
export default App;

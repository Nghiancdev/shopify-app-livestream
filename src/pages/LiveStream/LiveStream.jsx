import React, { useEffect, useRef, useState } from "react";
import {
  LiveStreamStyle,
  ModalStyle,
  ProductStyle,
  HeaderStyle,
} from "./style";
import {
  Typography,
  Avatar,
  List,
  message,
  Input,
  Modal,
  Dropdown,
  Checkbox,
  Select,
  Upload,
} from "antd";
import { WHIPClient } from "@eyevinn/whip-web-client";
import ImgCrop from "antd-img-crop";
import {
  SendOutlined,
  ShoppingCartOutlined,
  SmileOutlined,
  PushpinOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import VirtualList from "rc-virtual-list";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Menus from "../../components/Menus";
import Container from "../../components/Container";

const { TextArea } = Input;
const ContainerHeight = 550;
const host = "https://socket.api.windoo.vn/socket";
const options = [
  {
    label: "Camera defaut",
    value: "1",
  },
  {
    label: "Camera 2",
    value: "2",
  },
];
const optionss = [
  {
    label: "Mic defaut",
    value: "1",
  },
  {
    label: "Mic head phone",
    value: "2",
  },
];
const LiveStream = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [like, setLike] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [livestreamData, setLivestreamData] = useState([]);

  const [inputValue, setInputValue] = useState("");
  const [data1, setData1] = useState(null);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [streamId, setStreamId] = useState(null);

  const [listProduct, setListProduct] = useState([]);
  // const [client, setClient] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cameraInput: "",
    micInput: "",
    thumbnail: [],
  });

  const shop_domain = sessionStorage.getItem("shop_domain");
  const access_token = sessionStorage.getItem("access_token");
  const token = sessionStorage.getItem("token");
  const url = `https://livestream.windoo.vn/rtc/v1/whip/?app=live&stream=${streamId}`;

  console.log("🚀 ~ LiveStream ~ url:", url);
  // const client = new WHIPClient({
  //   endpoint: `https://livestream.windoo.vn/rtc/v1/whip/?app=live&stream=${streamId}`,
  //   opts: {
  //     debug: true,
  //     iceServers: [{ urls: "stun:stun.l.google.com:19320" }],
  //   },
  // });

  // const createNewClient = (streamId) => {
  //   return new WHIPClient({
  //     endpoint: `https://livestream.windoo.vn/rtc/v1/whip/?app=live&stream=${streamId}`,
  //     opts: {
  //       debug: true,
  //       iceServers: [{ urls: "stun:stun.l.google.com:19320" }],
  //     },
  //   });
  // };

  // // Mỗi khi streamId thay đổi, tạo client mới
  // useEffect(() => {
  //   const newClient = createNewClient(sessionStorage.getItem("liveId"));
  //   setClient(newClient);
  // }, [streamId]);

  const onChanges = (value, key) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: value,
    }));
  };
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  const navigate = useNavigate();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showModal1 = () => {
    setIsModalOpen1(true);

    axios({
      method: "get",
      url: `https://api.windoo.vn/api/livestream/all-product`,
      headers: {
        Authorization: token,
      },
    })
      .then((response) => {
        console.log(response.data.docs);
        setListProduct(response.data.docs);
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
      });
  };
  const handleOk1 = () => {
    setIsModalOpen1(false);
  };
  const handleCancel1 = () => {
    setIsModalOpen1(false);
  };
  const showModal2 = () => {
    setIsModalOpen(false);
    setIsModalOpen2(true);
  };

  const handleOk2 = async () => {
    console.log(formData);
    const value = {
      title: formData.title,
      description: formData.description,
    };
    axios
      .post(`https://api.windoo.vn/api/livestream/create`, value, {
        headers: {
          "X-Authorization": token,
        },
      })
      .then((response) => {
        console.log("live stream create successfully:", response.data);
        setStreamId(response.data.docs._id);
        console.log("idddddd:", response.data.docs._id);
        if (response.data.docs._id != null) {
          sessionStorage.setItem("liveId", response.data.docs._id);
          const socket = io(host, {
            extraHeaders: {
              "x-authorization": token,
            },
          });
          socket.on("connect", () => {
            const roomId = `livestream_${response.data.docs._id}`; // Thay roomId bằng roomId bạn nhận được từ server
            console.log("roomId: ", roomId);
            console.log("host: ", host);
            console.log("token: ", token);
            // socket.emit("joinRoom", roomId);
            setTimeout(() => {
              socket.emit("joinRoom", roomId);
            }, 500);

            // joinRoom(roomId);
            console.log("Connected to server");
          });

          socket.on("livestreamToClient", (datas) => {
            setData1(datas);
            console.log("🚀 ~ socket.on ~ datas:", datas);
            // setLivestreamData((prevData) => [...prevData, datas]);
            setLivestreamData((prevData) => [datas, ...prevData]);
          });

          socket.on("emojiToClient", (datass) => {
            setLike(JSON.parse(datass));
          });
        }
      })
      .catch((error) => {
        console.error("Error posting comment:", error);
        // Xử lý lỗi tại đây nếu cần
      });
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video:
          formData.cameraInput == ""
            ? false
            : {
                width: { ideal: 1280 },
                height: { ideal: 720 },
              },
        audio: formData.micInput == "" ? false : true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // startWebRTC();
        // setTimeout(() => {
        //   console.log(
        //     "🚀 ~ handleOk2 ~ client:",
        //     sessionStorage.getItem("liveId")
        //   );
        // }, 3000);
        const liveId = sessionStorage.getItem("liveId");
        const client = new WHIPClient({
          endpoint: `https://livestream.windoo.vn/rtc/v1/whip/?app=live&stream=${liveId}`,
          opts: {
            debug: true,
            iceServers: [{ urls: "stun:stun.l.google.com:19320" }],
          },
        });
        await client.setIceServersFromEndpoint();
        await client.ingest(mediaStream);
      }
    } catch (err) {
      console.error("Error accessing media devices: ", err);
    }

    setFormData({
      title: "",
      description: "",
      cameraInput: "",
      micInput: "",
      thumbnail: [],
    });
    setIsModalOpen2(false);
  };
  const handleCancel2 = () => {
    setFormData({
      title: "",
      description: "",
      cameraInput: "",
      micInput: "",
      thumbnail: [],
    });
    setIsModalOpen2(false);
  };
  async function startMedia() {
    showModal();
    // try {
    //   const mediaStream = await navigator.mediaDevices.getUserMedia({
    //     video: true,
    //     audio: true,
    //   });
    //   setStream(mediaStream);
    //   if (videoRef.current) {
    //     videoRef.current.srcObject = mediaStream;
    //     startWebRTC();
    //   }
    // } catch (err) {
    //   console.error("Error accessing media devices: ", err);
    // }
  }

  function stopMedia() {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
        // client.destroy();
      });

      setStream(null);
      setLivestreamData([]);
      setLike(null);
      setStreamId(null);
    }
  }

  // useEffect(() => {
  //   if (!shop_domain || !token) {
  //     // Chuyển hướng đến trang đăng nhập nếu token hoặc userId không tồn tại
  //     navigate("/auth");
  //   }
  // }, [navigate]);
  const handleEnter = (e) => {
    const comment = {
      livestream_id: streamId,
      chat_content: e.target.value,
    };

    axios
      .post(`https://api.windoo.vn/api/livestream/comment`, comment, {
        headers: {
          "X-Authorization": token,
        },
      })
      .then((response) => {
        console.log("Comment posted successfully:", response.data);
        setInputValue(""); // Xóa nội dung trong input sau khi gửi
      })
      .catch((error) => {
        console.error("Error posting comment:", error);
        // Xử lý lỗi tại đây nếu cần
      });
    setInputValue("");
  };
  const handleClick = (value) => {
    const comment = {
      livestream_id: streamId,
      chat_content: value,
    };

    axios
      .post(`https://api.windoo.vn/api/livestream/comment`, comment, {
        headers: {
          "X-Authorization": token,
        },
      })
      .then((response) => {
        console.log("Comment posted successfully:", response.data);
        setInputValue(""); // Xóa nội dung trong input sau khi gửi
      })
      .catch((error) => {
        console.error("Error posting comment:", error);
        // Xử lý lỗi tại đây nếu cần
      });
    setInputValue("");
  };
  const handleChange = (e) => {
    setInputValue(e.target.value); // Cập nhật giá trị trong biến state khi người dùng nhập vào Input
  };

  const handleLike = () => {
    const like = {
      livestream_id: streamId,
      react_type: "wow",
    };

    axios
      .post(`https://api.windoo.vn/api/livestream/like`, like, {
        headers: {
          "X-Authorization": token,
        },
      })
      .then((response) => {
        console.log("Comment posted successfully:", response.data);
        setInputValue(""); // Xóa nội dung trong input sau khi gửi
      })
      .catch((error) => {
        console.error("Error posting comment:", error);
        // Xử lý lỗi tại đây nếu cần
      });
    setInputValue("");
  };

  const items = [
    {
      key: "1",
      label: (
        <>
          <img
            onClick={() => handleLike()}
            src="https://media.tenor.com/_e4JAx0iHS0AAAAi/facebook-emoji.gif"
            alt="External GIF"
            width={30}
          />
          <img
            onClick={() => handleLike()}
            src="https://media.tenor.com/J1Nk6FEG2yYAAAAi/facebook-emoji.gif"
            alt="External GIF"
            width={30}
          />
          <img
            onClick={() => handleLike()}
            src="https://media.tenor.com/RYibGej0GvcAAAAi/facebook-emoji.gif"
            alt="External GIF"
            width={30}
          />
        </>
      ),
    },
  ];
  return (
    <Container>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <Menus />
        </div>

        <LiveStreamStyle>
          <div className="container">
            <div className="container_top">Live Stream</div>
            <div className="container_main">
              <div className="container_main_left">
                {stream ? null : (
                  <button
                    style={{
                      position: "absolute",
                      zIndex: 999,
                      marginLeft: "28%",
                      marginTop: "16%",
                      background: "#E51C00",
                      height: "50px",
                      width: "120px",
                      borderRadius: 10,
                      color: "white",
                      fontSize: 20,
                      fontWeight: 600,
                    }}
                    onClick={stream ? stopMedia : startMedia}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="20"
                      viewBox="0 0 20 15"
                      fill="none"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M5.27298 6.28033C3.22273 8.33058 3.22273 11.6547 5.27298 13.705C5.56587 13.9978 5.56587 14.4727 5.27298 14.7656C4.98009 15.0585 4.50521 15.0585 4.21232 14.7656C1.57628 12.1296 1.57628 7.85571 4.21232 5.21967C4.50521 4.92678 4.98009 4.92678 5.27298 5.21967C5.56587 5.51256 5.56587 5.98744 5.27298 6.28033ZM10 9.25C9.5858 9.25 9.25002 9.58578 9.25002 10C9.25002 10.4142 9.5858 10.75 10 10.75C10.4142 10.75 10.75 10.4142 10.75 10C10.75 9.58578 10.4142 9.25 10 9.25ZM7.75002 10C7.75002 8.75735 8.75738 7.75 10 7.75C11.2427 7.75 12.25 8.75735 12.25 10C12.25 11.2426 11.2427 12.25 10 12.25C8.75738 12.25 7.75002 11.2426 7.75002 10ZM14.7124 13.705C16.7627 11.6547 16.7627 8.33058 14.7124 6.28033C14.4195 5.98744 14.4195 5.51256 14.7124 5.21967C15.0053 4.92678 15.4802 4.92678 15.7731 5.21967C18.4091 7.85571 18.4091 12.1296 15.7731 14.7656C15.4802 15.0585 15.0053 15.0585 14.7124 14.7656C14.4195 14.4727 14.4195 13.9978 14.7124 13.705ZM7.29074 8.0481C6.21679 9.12204 6.21679 10.8632 7.29074 11.9372C7.58363 12.2301 7.58363 12.705 7.29074 12.9978C6.99784 13.2907 6.52297 13.2907 6.23008 12.9978C4.57035 11.3381 4.57035 8.64717 6.23008 6.98744C6.52297 6.69454 6.99784 6.69454 7.29074 6.98744C7.58363 7.28033 7.58363 7.7552 7.29074 8.0481ZM12.6945 11.9372C13.7685 10.8632 13.7685 9.12204 12.6945 8.0481C12.4016 7.7552 12.4016 7.28033 12.6945 6.98744C12.9874 6.69454 13.4623 6.69454 13.7552 6.98744C15.4149 8.64717 15.4149 11.3381 13.7552 12.9978C13.4623 13.2907 12.9874 13.2907 12.6945 12.9978C12.4016 12.705 12.4016 12.2301 12.6945 11.9372Z"
                        fill="white"
                      />
                    </svg>
                    Go Live
                  </button>
                )}

                {like == null ? null : (
                  <div
                    style={{
                      width: 50,

                      position: "absolute",
                      zIndex: 999,
                      left: 100,
                      display: "grid",

                      gridTemplateColumns: "1fr 1fr",
                      padding: 5,
                      borderRadius: 10,
                      background: "#DDDDDD",
                    }}
                  >
                    <i
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: 20,
                      }}
                      class="fa-regular fa-heart"
                    ></i>
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {like?.livestream_id?.like_number}
                    </span>
                  </div>
                )}
                <div className="container_main_left_video">
                  <video
                    style={{
                      objectFit: "cover",

                      width: "100%",
                      height: "100%",
                      borderRadius: 10,
                      backgroundColor: "#303030",
                    }}
                    ref={videoRef}
                    autoPlay
                    playsInline
                  />
                </div>

                <Modal
                  title="Livestream’s setting"
                  open={isModalOpen}
                  onOk={handleOk}
                  onCancel={handleCancel}
                >
                  <ModalStyle>
                    <div
                      className="modal_container"
                      // style={{
                      //   display: "grid",
                      //   gridTemplateColumns: "1fr 1fr",
                      // }}
                    >
                      <div
                        onClick={showModal2}
                        className="modal_container_left"
                      >
                        <div>
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/2989/2989838.png"
                            alt=""
                            width={"60px"}
                          />
                        </div>
                        <div>Custom RTMP</div>
                        <div>
                          <p>
                            Tailored streaming solution for diverse broadcasting
                            needs by using your streaming software
                          </p>
                        </div>
                      </div>
                      <div className="modal_container_left">
                        <div>
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/1159/1159798.png"
                            alt=""
                            width={"60px"}
                          />
                        </div>
                        <div>Webcam</div>
                        <div>
                          <p>
                            Stream directly with your webcam using our shopify
                            app!
                          </p>
                        </div>
                      </div>
                    </div>
                  </ModalStyle>
                </Modal>
                <Modal
                  title="Product"
                  open={isModalOpen1}
                  onOk={handleOk1}
                  onCancel={handleCancel1}
                >
                  <ProductStyle>
                    <div className="product_container">
                      <Input
                        placeholder="Search for product"
                        prefix={<SearchOutlined />}
                      />
                      {/* {listProduct.products?.map((item, index) => (
                        <div key={index} className="product_containers">
                          <Checkbox>
                            <div className="product_container_item">
                              <img
                                onClick={() => handleLike()}
                                src={item.image?.src}
                                alt=""
                                width={31}
                              />
                              <span>{item.title}</span>
                              <PushpinOutlined />
                            </div>
                          </Checkbox>
                        </div>
                      ))} */}
                    </div>
                  </ProductStyle>
                </Modal>
                <Modal
                  title="Livestream’s setting"
                  open={isModalOpen2}
                  onOk={handleOk2}
                  onCancel={handleCancel2}
                >
                  <div style={{ height: "auto" }}>
                    <Typography.Title level={5}>Title</Typography.Title>
                    <Input
                      placeholder="Title of stream..."
                      value={formData.title}
                      onChange={(e) => onChanges(e.target.value, "title")}
                    />
                    <Typography.Title level={5}>Description</Typography.Title>
                    <TextArea
                      showCount
                      maxLength={100}
                      placeholder="disable resize"
                      style={{ height: 120, resize: "none" }}
                      value={formData.description}
                      onChange={(e) => onChanges(e.target.value, "description")}
                    />
                    <Typography.Title level={5}>Camera input</Typography.Title>
                    <Select
                      style={{ width: "100%" }}
                      options={options}
                      value={formData.cameraInput}
                      onChange={(value) => onChanges(value, "cameraInput")}
                    />
                    <Typography.Title level={5}>Mic input</Typography.Title>
                    <Select
                      style={{ width: "100%" }}
                      options={optionss}
                      value={formData.micInput}
                      onChange={(value) => onChanges(value, "micInput")}
                    />
                    <Typography.Title level={5}>
                      Choose a thumbnail
                    </Typography.Title>
                    <ImgCrop rotationSlider>
                      <Upload
                        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                        listType="picture-card"
                        fileList={fileList}
                        onChange={onChange}
                        onPreview={onPreview}
                      >
                        {fileList.length < 5 && "+ Upload"}
                      </Upload>
                    </ImgCrop>
                  </div>
                </Modal>
              </div>

              <div className="container_main_right">
                <div className="container_main_right_bottom">
                  <div className="container_main_right_bottom_top">
                    <span style={{ fontSize: 27, fontWeight: 600 }}>Chat</span>
                  </div>
                  <div className="container_main_right_bottom_bottom">
                    <List>
                      <VirtualList
                        data={livestreamData.map((jsonString) =>
                          JSON.parse(jsonString)
                        )}
                        height={ContainerHeight}
                        itemHeight={47}
                        itemKey="_id"
                        // onScroll={onScroll}
                      >
                        {(item) => (
                          <List.Item key={item.user_email}>
                            <List.Item.Meta
                              avatar={
                                <Avatar src={item.createBy.user_avatar} />
                              }
                              title={
                                <a href="https://ant.design">
                                  {item.createBy.user_name}
                                </a>
                              }
                              description={item.chat_content}
                            />
                          </List.Item>
                        )}
                      </VirtualList>
                    </List>
                    <br />
                    <Input
                      placeholder="comment..."
                      style={{
                        width: "100%",
                        height: 50,
                      }}
                      value={inputValue}
                      onPressEnter={handleEnter}
                      onChange={handleChange}
                      suffix={
                        <>
                          <Dropdown
                            menu={{
                              items,
                            }}
                            placement="top"
                            arrow
                          >
                            <SmileOutlined
                              style={{ fontSize: 20 }}
                              // onClick={() => handleClick(inputValue)}
                            />
                          </Dropdown>
                          <SendOutlined
                            style={{ fontSize: 20 }}
                            onClick={() => handleClick(inputValue)}
                          />
                        </>
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
              }}
            >
              <div
                onClick={showModal1}
                style={{
                  backgroundColor: "white",
                  padding: 8,
                  borderRadius: 12,
                  cursor: "pointer",
                }}
              >
                <ShoppingCartOutlined
                  // onClick={showModal1}
                  style={{ fontSize: 20 }}
                />
                Product list
              </div>
            </div>
            <div className="container_bottom">
              <div className="container_bottom_left">
                <div className="container_bottom_left_title">
                  [LIVESTREAM] Dai ha gia tat ca các mat hang có trong phien
                  livestream ngay hom nay. Nhanh tay keo het
                </div>
                <div className="container_bottom_left_info">
                  <img
                    src="/portrait06.png"
                    style={{ width: 64, borderRadius: 100 }}
                    alt=""
                  />
                  <div className="container_bottom_left_info_name">Nghĩa</div>
                </div>
                <div className="container_bottom_left_pin">
                  <div className="container_bottom_left_pin_product">
                    <span
                      style={{
                        fontSize: 16,
                        fontStyle: "normal",
                        fontWeight: 550,
                        color: "#616161",
                      }}
                    >
                      Pinned Product
                    </span>
                    <div className="container_bottom_left_pin_product_item">
                      <img
                        src="/Image.png"
                        style={{ borderRadius: 10, height: 70 }}
                        alt=""
                      />
                      <div>
                        <div
                          style={{
                            fontSize: 18,
                            fontStyle: "normal",
                            fontWeight: 600,
                          }}
                        >
                          Orange Sofa size S{" "}
                        </div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 450,
                            color: "#616161",
                          }}
                        >
                          $99.99
                        </div>
                        <div
                          style={{
                            borderRadius: 10,
                            background: "#FFF1E3",
                            padding: 5,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="25"
                              height="25"
                              viewBox="0 0 20 20"
                              fill="none"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M8.57473 4.64885C9.28162 3.91477 10.2568 3.5 11.2759 3.5H13.25C15.0449 3.5 16.5 4.95507 16.5 6.75V8.93673C16.5 9.81995 16.1405 10.6651 15.5043 11.2778L10.7572 15.8491C9.77593 16.794 8.21868 16.7793 7.25537 15.816L4.35746 12.9181C3.29782 11.8585 3.28166 10.1455 4.32112 9.06605L8.57473 4.64885ZM13 8C13.5523 8 14 7.55228 14 7C14 6.44772 13.5523 6 13 6C12.4477 6 12 6.44772 12 7C12 7.55228 12.4477 8 13 8Z"
                                fill="#998A00"
                              />
                            </svg>
                            <span style={{ color: "#4F4700" }}>
                              Discount 50%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="container_bottom_left_pin_product">
                    <span
                      style={{
                        fontSize: 16,
                        fontStyle: "normal",
                        fontWeight: 550,
                        color: "#616161",
                      }}
                    >
                      Pinned Discount
                    </span>
                    <div className="container_bottom_left_pin_product_item">
                      <div>
                        <div
                          style={{
                            fontSize: 18,
                            fontStyle: "normal",
                            fontWeight: 600,
                          }}
                        >
                          5TWR36ZRGNK3
                        </div>

                        <div
                          style={{
                            marginTop: 10,
                            borderRadius: 10,
                            background: "#FFF1E3",
                            padding: 5,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="25"
                              height="25"
                              viewBox="0 0 20 20"
                              fill="none"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M8.57473 4.64885C9.28162 3.91477 10.2568 3.5 11.2759 3.5H13.25C15.0449 3.5 16.5 4.95507 16.5 6.75V8.93673C16.5 9.81995 16.1405 10.6651 15.5043 11.2778L10.7572 15.8491C9.77593 16.794 8.21868 16.7793 7.25537 15.816L4.35746 12.9181C3.29782 11.8585 3.28166 10.1455 4.32112 9.06605L8.57473 4.64885ZM13 8C13.5523 8 14 7.55228 14 7C14 6.44772 13.5523 6 13 6C12.4477 6 12 6.44772 12 7C12 7.55228 12.4477 8 13 8Z"
                                fill="#998A00"
                              />
                            </svg>
                            <span style={{ color: "#4F4700" }}>
                              Discount 50%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container_bottom_right">analys</div>
            </div>
          </div>
        </LiveStreamStyle>
      </div>
    </Container>
  );
};

export default LiveStream;

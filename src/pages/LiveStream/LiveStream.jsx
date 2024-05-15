import React, { useEffect, useRef, useState } from "react";
import { LiveStreamStyle, ModalStyle, ProductStyle } from "./style";
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
import ImgCrop from "antd-img-crop";
import {
  SendOutlined,
  ShoppingCartOutlined,
  SmileOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import VirtualList from "rc-virtual-list";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const { TextArea } = Input;
const ContainerHeight = 296;
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
    axios
      .get(`https://${shop_domain}/admin/api/2024-04/products.json`, {
        // params: {
        //     ids: ids
        // },
        headers: {
          "X-Shopify-Access-Token": "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",
        },
      })
      .then((response) => {
        // Handle success
        console.log("Data:", response);
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
        setStreamId(response.data._id);
        if (response.data._id != null) {
          const socket = io(host, {
            extraHeaders: {
              "x-authorization": token,
            },
          });
          socket.on("connect", () => {
            const roomId = `livestream_${response.data._id}`; // Thay roomId bằng roomId bạn nhận được từ server
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
            setLivestreamData((prevData) => [...prevData, datas]);
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
        video: formData.cameraInput == "" ? false : true,
        audio: formData.micInput == "" ? false : true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
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
    //   }
    // } catch (err) {
    //   console.error("Error accessing media devices: ", err);
    // }
  }

  function stopMedia() {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
      setLivestreamData([]);
      setLike(null);
      setStreamId(null);
    }
  }
  // Kết nối tới máy chủ

  // useEffect(() => {
  //   if (streamId != null) {
  //     socket.once("connect", () => {
  //       const roomId = `livestream_${streamId}`; // Thay roomId bằng roomId bạn nhận được từ server
  //       console.log("roomId: ", roomId);
  //       console.log("host: ", host);
  //       console.log("token: ", token);
  //       socket.emit("joinRoom", roomId);

  //       console.log("Connected to server");
  //     });

  //     socket.on("livestreamToClient", (datas) => {
  //       setData1(datas);
  //       console.log("🚀 ~ socket.on ~ datas:", datas);
  //       setLivestreamData((prevData) => [...prevData, datas]);
  //     });

  //     socket.on("emojiToClient", (datass) => {
  //       setLike(JSON.parse(datass));
  //     });
  //   }
  //   // No dependency array, cleanup will run on unmount
  //   return () => {
  //     // Disconnection logic here
  //     socket.disconnect();
  //   };
  // }, []);

  useEffect(() => {
    if (!shop_domain || !token) {
      // Chuyển hướng đến trang đăng nhập nếu token hoặc userId không tồn tại
      navigate("/auth");
    }
  }, [navigate]);
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
    <LiveStreamStyle>
      <div>
        <div className="container">
          <div className="container_main">
            <div className="container_main_left">
              <button
                style={{ position: "absolute", zIndex: 999 }}
                onClick={stream ? stopMedia : startMedia}
              >
                {stream ? "Stop" : "Start"} Live
              </button>
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

              <video
                style={{ objectFit: "cover", width: "100%", height: "95%" }}
                ref={videoRef}
                autoPlay
                playsInline
              />
              <ShoppingCartOutlined
                onClick={showModal1}
                style={{ fontSize: 25 }}
              />
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
                    <div onClick={showModal2} className="modal_container_left">
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
                    <div className="product_containers">
                      <Checkbox>
                        <div className="product_container_item">
                          <img
                            onClick={() => handleLike()}
                            src="https://media.tenor.com/_e4JAx0iHS0AAAAi/facebook-emoji.gif"
                            alt="External GIF"
                            width={31}
                          />
                          <span>Nghĩa</span>
                          <PushpinOutlined />
                        </div>
                      </Checkbox>
                    </div>
                    <div className="product_containers">
                      <Checkbox>
                        <div className="product_container_item">
                          <img
                            onClick={() => handleLike()}
                            src="https://media.tenor.com/_e4JAx0iHS0AAAAi/facebook-emoji.gif"
                            alt="External GIF"
                            width={31}
                          />
                          <span>Nghĩa</span>
                          <PushpinOutlined />
                        </div>
                      </Checkbox>
                    </div>
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
              <div className="container_main_right_top">
                <div className="container_main_right_top_top">
                  <span style={{ fontSize: 27, fontWeight: 600 }}>
                    Statistic
                  </span>
                </div>
                <div className="container_main_right_top_bottom">
                  <div className="container_main_right_top_bottom_item">
                    <div className="container_main_right_top_bottom_item_top">
                      99,999
                    </div>
                    <div className="container_main_right_top_bottom_item_bottom">
                      Soid
                    </div>
                  </div>
                  <div className="container_main_right_top_bottom_item">
                    <div className="container_main_right_top_bottom_item_top">
                      $9,999
                    </div>
                    <div className="container_main_right_top_bottom_item_bottom">
                      Stream revenue
                    </div>
                  </div>
                </div>
              </div>
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
                            avatar={<Avatar src={item.createBy.user_avatar} />}
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
        </div>
      </div>
    </LiveStreamStyle>
  );
};

export default LiveStream;

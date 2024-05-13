import React, { useEffect, useRef, useState } from "react";
import { LiveStreamStyle, ModalStyle } from "./style";
import { Avatar, List, message, Input, Modal } from "antd";
import { SendOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import VirtualList from "rc-virtual-list";
import { io } from "socket.io-client";
import axios from "axios";

const fakeDataUrl =
  "https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo";
const ContainerHeight = 296;
const host = "https://socket.api.windoo.vn/socket";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDcxMDY4MTcsImRhdGEiOnsiX2lkIjoiNjYzZGZkOWM4NWUxNGE0MmM2NDkxMTBhIiwia2V5IjoiOWExYWEzYTcwZWNkMWZlNzQ3ZDhkZDhhOTdiY2U4MjYiLCJzaWduYXR1cmUiOiI4ZTdhOTkwZmYwOWM5MGUxYjEwZjI2YTQ1N2UxM2IzOCIsInNlc3Npb24iOiI2NjQxODg4MTQyZmQ4ZjJhMGJhZTk5NzIifSwiaWF0IjoxNzE1NTcwODE3fQ.Tw30oMbUSpW8owQRmmEmvnRXPTuPnjv3yuoR1dihzaY";

const LiveStream = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [livestreamData, setLivestreamData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isSocketListening, setIsSocketListening] = useState(false);
  const [data1, setData1] = useState(null);

  // const dataObject = JSON.parse(livestreamData);

  // const idArray = livestreamData.map((item) => item._id);
  // console.log(idArray);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const appendData = () => {
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((body) => {
        setData(data.concat(body.results));
        message.success(`${body.results.length} more items loaded!`);
      });
  };
  useEffect(() => {
    appendData();
  }, []);
  const onScroll = (e) => {
    // Refer to: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#problems_and_solutions
    if (
      Math.abs(
        e.currentTarget.scrollHeight -
          e.currentTarget.scrollTop -
          ContainerHeight
      ) <= 1
    ) {
      appendData();
    }
  };
  async function startMedia() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing media devices: ", err);
    }
  }

  function stopMedia() {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
    }
  }
  // Kết nối tới máy chủ

  useEffect(() => {
    console.log(new Date());
    const socket = io(host, {
      extraHeaders: {
        "x-authorization": token,
      },
    });
    socket.once("connect", () => {
      const roomId = "livestream_664175a1e9ccd5d0e257549a"; // Thay roomId bằng roomId bạn nhận được từ server
      socket.emit("joinRoom", roomId);
      console.log(new Date());
      console.log("Connected to server");
    });
    // socket.on("disconnect", () => {
    //   console.log("Disconnected from server");
    // });
    socket.on("livestreamToClient", (datas) => {
      // console.log("Received livestream data:", data);
      // Xử lý dữ liệu nhận được ở đây
      console.log(new Date());
      console.log("data:", datas);
      setData1(datas);
      setLivestreamData((prevData) => [...prevData, datas]);
    });
  }, []);
  // console.log("data1", data1);

  // useEffect(() => {
  //   socket.on("livestreamToClient", (datas) => {
  //     // console.log("Received livestream data:", data);
  //     // Xử lý dữ liệu nhận được ở đây
  //     console.log("data:", datas);

  //     setLivestreamData((prevData) => [...prevData, datas]);
  //   });
  // }, []);
  const handleEnter = (e) => {
    console.log(e.target.value); // Log giá trị khi nhấn Enter
    setInputValue("");
    const jsonArray = livestreamData.map((jsonString) =>
      JSON.parse(jsonString)
    );
    console.log("list comment: ", jsonArray);
  };
  const handleChange = (e) => {
    setInputValue(e.target.value); // Cập nhật giá trị trong biến state khi người dùng nhập vào Input
  };
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
              <video
                style={{ objectFit: "cover", width: "100%", height: "95%" }}
                ref={videoRef}
                autoPlay
                playsInline
              />
              <ShoppingCartOutlined
                onClick={showModal}
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
                    <div className="modal_container_left">
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
                    <div className="modal_container_right">ádsd</div>
                  </div>
                </ModalStyle>
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
                            // avatar={<Avatar src={item.picture.large} />}
                            title={
                              <a href="https://ant.design">
                                {item.chat_content}
                              </a>
                            }
                            // description={item.email}
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
                    suffix={<SendOutlined />}
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

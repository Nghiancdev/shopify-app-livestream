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
  Button,
  DatePicker
} from "antd";
import { WHIPClient } from "@eyevinn/whip-web-client";
import ImgCrop from "antd-img-crop";
import {
  SendOutlined,
  ShoppingCartOutlined,
  SmileOutlined,
  PushpinOutlined,
  SearchOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  PlusOutlined,
  UploadOutlined
} from "@ant-design/icons";
import VirtualList from "rc-virtual-list";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Menus from "../../components/Menus";
import Container from "../../components/Container";
import moment from 'moment';
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const ContainerHeight = 320;
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
const PreRecorded = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [like, setLike] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [livestreamData, setLivestreamData] = useState([]);
  console.log("🚀 ~ PreRecorded ~ livestreamData:", livestreamData)

  const [inputValue, setInputValue] = useState("");
  const [data1, setData1] = useState(null);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [isModalOpen4, setIsModalOpen4] = useState(false);

  const [fileList, setFileList] = useState([]);
  const [videoFileList, setVideoFileList] = useState([]);
  const [streamId, setStreamId] = useState(null);
  const [streamData, setStreamData] = useState(null);

  const [listProduct, setListProduct] = useState([]);
  const [listProductFormat, setListProductFormat] = useState([]);
  const [listDiscountFormat, setListDiscountFormat] = useState([]);
  const [listDiscount, setListDiscount] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [view, setView] = useState(null);
  const liveId = sessionStorage.getItem("liveId");
  const user_name = sessionStorage.getItem("user_name");
  const user_avatar = sessionStorage.getItem("user_avatar");
  const [listSchedule, setlistSchedule] = useState([]);

  const handleCheckboxChange = (product) => {
    setSelectedProducts((prevSelectedProducts) => {
      if (prevSelectedProducts.some((p) => p.id === product.id)) {
        return prevSelectedProducts.filter((p) => p.id !== product.id);
      } else {
        return [...prevSelectedProducts, product];
      }
    });
  };

  //pin product
  const handlePinClick = (product) => {
    const updatedProducts = selectedProducts.map((p) =>
      p.id === product.id ? { ...p, status_pin: true } : p
    );
    setSelectedProducts(updatedProducts);
    const updatedProductsFormat = listProductFormat.map((p) =>
      p.id === product.id ? { ...p, status_pin: true } : p
    );
    setListProductFormat(updatedProductsFormat);
  };

  const handlePinClickOff = (product) => {
    const updatedProducts = selectedProducts.map((p) =>
      p.id === product.id ? { ...p, status_pin: false } : p
    );
    setSelectedProducts(updatedProducts);
    const updatedProductsFormat = listProductFormat.map((p) =>
      p.id === product.id ? { ...p, status_pin: false } : p
    );
    setListProductFormat(updatedProductsFormat);
  };

  //pin discount
  const handlePinClick1 = (discount) => {
    const updatedDiscounts = listDiscountFormat
      .map((p) => {
        if (p.id === discount.id) {
          return { ...p, status_pin: true };
        } else {
          return p;
        }
      })
      .filter((p) => p.id === discount.id && p.status_pin === true);

    const formattedDiscounts = updatedDiscounts.map((discount) => ({
      discount_id: discount.id.toString(),
      title: discount.title,
      value: discount.value,

      status_pin: discount.status_pin,
    }));

    const value = {
      livestream_id: liveId,
      discount: formattedDiscounts,
    };
    axios
      .post(`https://api.windoo.vn/api/discount`, value, {
        headers: {
          "X-Authorization": token,
        },
      })
      .then((response) => {
        console.log("Pin discount vào live thành không", response.data.docs);
      })
      .catch((error) => {
        console.error("pin discount lỗi", error);
        // Xử lý lỗi tại đây nếu cần
      });

    const updatedDiscountsFormat = listDiscountFormat.map((p) =>
      p.id === discount.id
        ? { ...p, status_pin: true }
        : { ...p, status_pin: false }
    );

    setListDiscountFormat(updatedDiscountsFormat);
  };

  const handlePinClickOff1 = (discount) => {
    const updatedDiscounts = selectedDiscounts.map((p) =>
      p.id === discount.id ? { ...p, status_pin: false } : p
    );
    setSelectedDiscounts(updatedDiscounts);
    const updatedDiscountsFormat = listDiscountFormat.map((p) =>
      p.id === discount.id ? { ...p, status_pin: false } : p
    );
    setListDiscountFormat(updatedDiscountsFormat);
  };

  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
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

  const onChanges = (value, key) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: value,
    }));
  };
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    console.log('ảnh:    ', newFileList);
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
  const onVideoChange = ({ fileList: newFileList }) => setVideoFileList(newFileList);

  const handleDateChange = (dates, dateStrings) => {
    setFormData({
      ...formData,
      startTime: dates[0].toISOString(),
      endTime: dates[1].toISOString(),
    });
    console.log('startTime:  ', dates[0].toISOString())

    console.log('endTime:  ', dates[1].toISOString())

  };

  const calculateSeconds = (startTime, endTime) => {
    // Chuyển đổi các thời điểm thành đối tượng Date
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    // Tính chênh lệch giây giữa hai thời điểm
    const diffInSeconds = (endDate - startDate) / 1000;

    return diffInSeconds;
  };

  // Hàm định dạng thời gian thành dạng giờ:phút:giây
  const formatTimes = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    // Định dạng thành chuỗi
    const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    return formattedTime;
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

  const showModal4 = () => {
    setIsModalOpen4(true);
  };
  const handleOk4 = () => {
    setIsModalOpen4(false);
  };
  const handleCancel4 = () => {
    setIsModalOpen4(false);
  };
  const showModal3 = () => {
    setIsModalOpen3(true);

  };
  const handleOk3 = () => {
    setIsModalOpen3(false);
  };
  const handleCancel3 = () => {
    setIsModalOpen3(false);
  };
  const showModal1 = () => {
    setIsModalOpen1(true);

  };
  useEffect(() => {
    axios({
      method: "get",
      url: `https://api.windoo.vn/api/product/all-product-shop`,
      headers: {
        Authorization: token,
      },
    })
      .then((response) => {
        console.log(response.data.docs);
        setListProduct(response.data.docs);
        setListProductFormat(
          response.data.docs.products?.map((product) => ({
            ...product,
            status_pin: false,
          }))
        );
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
      });
    axios({
      method: "get",
      url: `https://api.windoo.vn/api/discount/all-discount-shop`,
      headers: {
        Authorization: token,
      },
    })
      .then((response) => {
        setListDiscount(response.data.docs);
        setListDiscountFormat(
          response.data.docs.price_rules?.map((discount) => ({
            ...discount,
            status_pin: false,
          }))
        );
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
      });

    axios
      .get(`https://api.windoo.vn/api/schedule-live`, {
        headers: {
          "X-Authorization": token,
        },
      })
      .then((response) => {
        console.log("list schedule:", response.data.docs);
        setlistSchedule(response.data.docs)
        // setStreamData(response.data.docs);
      })
      .catch((error) => {
        console.error("Error posting comment:", error);
        // Xử lý lỗi tại đây nếu cần
      });



  }, []);
  const handleOk1 = () => {
    setIsModalOpen1(false);
    console.log("list product: ", selectedProducts);
    const formattedProducts = selectedProducts.map((product) => ({
      product_id: product.variants[0].id.toString(), // Chuyển đổi id thành chuỗi
      title: product.title, // Sử dụng tên sản phẩm
      handle: product.handle,
      price: product.variants[0].price,
      image: product.image?.src,
      status_pin: product.status_pin,
      variants_id: product.variants[0].id,
    }));

    const value = {
      livestream_id: liveId,
      list_product: formattedProducts,
    };
    axios
      .post(`https://api.windoo.vn/api/product`, value, {
        headers: {
          "X-Authorization": token,
        },
      })
      .then((response) => {
        console.log("live stream create successfully:", response.data);
        // setStreamId(response.data.docs);
        console.log("thêm sản phẩm vào live thành không", response.data.docs);
      })
      .catch((error) => {
        console.error("thêm sản phẩm lỗi", error);
        // Xử lý lỗi tại đây nếu cần
      });
  };
  const handleCancel1 = () => {
    setIsModalOpen1(false);
  };
  const showModal2 = () => {
    setIsModalOpen(false);
    setIsModalOpen2(true);

  };

  const handleOk2 = async () => {
    // console.log(formData);
    const formDataToSend = new FormData();

    fileList.forEach(file => {
      formDataToSend.append('image', file.originFileObj);
    });
    videoFileList.forEach(file => {
      formDataToSend.append('file', file.originFileObj);
    });
    formDataToSend.append('livestream_status', 'live');
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('schedule_live', 'true');
    formDataToSend.append('scheduled_start_time', formData.startTime);
    formDataToSend.append('scheduled_end_time', formData.endTime);
    axios
      .post(`https://api.windoo.vn/api/livestream/create`, formDataToSend, {
        headers: {
          "X-Authorization": token,
        },
      })
      .then((response) => {
        console.log("live stream create successfully:", response.data);
        axios
          .get(`https://api.windoo.vn/api/schedule-live`, {
            headers: {
              "X-Authorization": token,
            },
          })
          .then((response) => {
            console.log("list schedule:", response.data.docs);
            setlistSchedule(response.data.docs)
            // setStreamData(response.data.docs);
          })
          .catch((error) => {
            console.error("Error posting comment:", error);
            // Xử lý lỗi tại đây nếu cần
          });
      })
      .catch((error) => {
        console.error("Error posting comment:", error);
        // Xử lý lỗi tại đây nếu cần
      });



    setFormData({
      startTime: "",
      endTime: "",
      title: "",
      description: "",
      cameraInput: "",
      micInput: "",
      thumbnail: [],
    });
    setFileList([]);
    setVideoFileList([]);
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
  const connectSocket = (id) => {
    const socket = io(host, {
      extraHeaders: {
        "x-authorization": token,
      },
    });
    socket.on("connect", () => {
      const roomId = `livestream_${id}`; // Thay roomId bằng roomId bạn nhận được từ server
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
      console.log("🚀 ~ socket.on ~ datas:", JSON.parse(datas));
      const convertData = JSON.parse(datas);
      // setLivestreamData((prevData) => [...prevData, datas]);
      setLivestreamData((prevData) => [convertData, ...prevData]);
    });

    socket.on("emojiToClient", (datass) => {
      setLike(JSON.parse(datass));
    });

    socket.on("viewToClient", (datasss) => {
      console.log("🚀 ~ socket.on ~ viewwwwwww:", datasss);
      setView(JSON.parse(datasss));
    });

    axios
      .get(`https://api.windoo.vn/api/livestream/list-comment/${liveId}`, {
        headers: {
          "X-Authorization": token,
        },
      })
      .then((response) => {
        console.log("list comment", response.data.docs);
        setLivestreamData(response.data.docs);

      })
      .catch((error) => {
        console.error("Error posting comment:", error);
        // Xử lý lỗi tại đây nếu cần
      });

  }
  async function startMedia() {
    showModal();
    const value = {
      title: "Phiên live mới",
      description: "Phiên live mới",
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
        setStreamData(response.data.docs);
        setFormData({
          title: response.data.docs.title,
          description: response.data.docs.description,
        });
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

          socket.on("viewToClient", (datasss) => {
            console.log("🚀 ~ socket.on ~ viewwwwwww:", datasss);
            setView(JSON.parse(datasss));
          });
        }
      })
      .catch((error) => {
        console.error("Error posting comment:", error);
        // Xử lý lỗi tại đây nếu cần
      });
    // try {
    //   const mediaStream = await navigator.mediaDevices.getUserMedia({
    //     video: {
    //       width: { ideal: 1280 },
    //       height: { ideal: 720 },
    //     },
    //     audio: true,
    //   });
    //   setStream(mediaStream);
    //   if (videoRef.current) {
    //     videoRef.current.srcObject = mediaStream;
    //     // startWebRTC();
    //     // setTimeout(() => {
    //     //   console.log(
    //     //     "🚀 ~ handleOk2 ~ client:",
    //     //     sessionStorage.getItem("liveId")
    //     //   );
    //     // }, 3000);

    //     // const client = new WHIPClient({
    //     //   endpoint: `${streamData?.livestream_data?.whip_url}`,
    //     //   opts: {
    //     //     debug: true,
    //     //     iceServers: [{ urls: "stun:stun.l.google.com:19320" }],
    //     //   },
    //     // });
    //     // await client.setIceServersFromEndpoint();
    //     // await client.ingest(mediaStream);
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

      const value = {
        livestream_status: "end",
        _id: liveId,
      };
      axios
        .patch(`https://api.windoo.vn/api/livestream/update`, value, {
          headers: {
            "X-Authorization": token,
          },
        })
        .then((response) => {
          console.log("live stream create successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error posting comment:", error);
          // Xử lý lỗi tại đây nếu cần
        });
      setStream(null);

      setLivestreamData([]);
      setLike(null);
      setView(null);
      setStreamId(null);
    }
  }

  useEffect(() => {
    if (!shop_domain || !token) {
      // Chuyển hướng đến trang đăng nhập nếu token hoặc userId không tồn tại
      // navigate("/auth");
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
    <Container>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <Menus />
        </div>

        <LiveStreamStyle>
          <div className="container">
            <div className="container_top">Pre-recorded Stream</div>
            <div className="container_main">
              <div className="container_main_left">
                {stream ? (
                  <>
                    <svg
                      onClick={() => showModal()}
                      style={{
                        position: "absolute",
                        zIndex: 999,
                        marginLeft: 110,
                      }}
                      width="60"
                      height="40"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g filter="url(#filter0_iiii_323_812)">
                        <path
                          d="M0 8C0 3.58172 3.58172 0 8 0H24C28.4183 0 32 3.58172 32 8V24C32 28.4183 28.4183 32 24 32H8C3.58172 32 0 28.4183 0 24V8Z"
                          fill="white"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M18.5 16C18.5 17.3807 17.3807 18.5 16 18.5C14.6193 18.5 13.5 17.3807 13.5 16C13.5 14.6193 14.6193 13.5 16 13.5C17.3807 13.5 18.5 14.6193 18.5 16ZM17 16C17 16.5523 16.5523 17 16 17C15.4477 17 15 16.5523 15 16C15 15.4477 15.4477 15 16 15C16.5523 15 17 15.4477 17 16Z"
                          fill="#4A4A4A"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M15.3766 8.5C14.451 8.5 13.7006 9.25038 13.7006 10.176V10.8637C13.7006 10.9202 13.6584 11.0341 13.5034 11.115C13.3495 11.1954 13.2001 11.283 13.0555 11.3772C12.9078 11.4735 12.7865 11.4534 12.7371 11.4249L12.1373 11.0786C11.3357 10.6157 10.3107 10.8904 9.84786 11.692L9.22458 12.7716C8.76176 13.5732 9.03642 14.5982 9.83804 15.061L10.4855 15.4349C10.5342 15.463 10.6104 15.5547 10.6049 15.7258C10.603 15.7843 10.6021 15.843 10.6021 15.9019C10.6021 15.9984 10.6046 16.0943 10.6096 16.1896C10.6189 16.3654 10.5409 16.4604 10.4914 16.4889L9.83805 16.8661C9.03642 17.329 8.76177 18.354 9.22459 19.1556L9.84786 20.2352C10.3107 21.0368 11.3357 21.3114 12.1373 20.8486L12.8378 20.4442C12.8863 20.4162 13.004 20.3959 13.1499 20.4868C13.2649 20.5584 13.3828 20.6258 13.5034 20.6888C13.6584 20.7698 13.7006 20.8837 13.7006 20.9401V21.7512C13.7006 22.6768 14.451 23.4272 15.3766 23.4272H16.6232C17.5488 23.4272 18.2992 22.6768 18.2992 21.7512V20.9402C18.2992 20.8837 18.3414 20.7699 18.4964 20.6889C18.617 20.6259 18.7349 20.5585 18.8499 20.4868C18.9958 20.396 19.1135 20.4163 19.162 20.4443L19.8624 20.8486C20.664 21.3114 21.6891 21.0368 22.1519 20.2352L22.7752 19.1556C23.238 18.354 22.9633 17.329 22.1617 16.8661L21.5085 16.489C21.459 16.4604 21.381 16.3655 21.3903 16.1897C21.3953 16.0944 21.3978 15.9984 21.3978 15.9019C21.3978 15.843 21.3969 15.7843 21.395 15.7257C21.3895 15.5546 21.4657 15.4629 21.5144 15.4348L22.1617 15.061C22.9633 14.5982 23.238 13.5732 22.7752 12.7716L22.1519 11.692C21.6891 10.8904 20.6641 10.6157 19.8624 11.0786L19.2627 11.4248C19.2133 11.4533 19.0921 11.4735 18.9444 11.3772C18.7997 11.2829 18.6503 11.1953 18.4964 11.115C18.3414 11.034 18.2992 10.9201 18.2992 10.8636V10.176C18.2992 9.25038 17.5488 8.5 16.6232 8.5H15.3766ZM15.2006 10.176C15.2006 10.0788 15.2794 10 15.3766 10H16.6232C16.7204 10 16.7992 10.0788 16.7992 10.176V10.8636C16.7992 11.5921 17.2611 12.162 17.8018 12.4445C17.9128 12.5024 18.0207 12.5657 18.1252 12.6338C18.6422 12.9708 19.375 13.092 20.0127 12.7239L20.6124 12.3776C20.6966 12.329 20.8043 12.3578 20.8529 12.442L21.4761 13.5216C21.5247 13.6058 21.4959 13.7134 21.4117 13.762L20.7644 14.1357C20.1412 14.4956 19.8763 15.1696 19.8958 15.7739C19.8971 15.8164 19.8978 15.8591 19.8978 15.9019C19.8978 15.9721 19.896 16.0417 19.8923 16.1109C19.8599 16.7264 20.1217 17.4204 20.7585 17.788L21.4117 18.1652C21.4959 18.2138 21.5247 18.3214 21.4761 18.4056L20.8529 19.4852C20.8043 19.5693 20.6966 19.5982 20.6124 19.5496L19.912 19.1452C19.2877 18.7848 18.5706 18.8937 18.057 19.2136C17.974 19.2653 17.8888 19.3139 17.8018 19.3594C17.2611 19.6419 16.7992 20.2117 16.7992 20.9402V21.7512C16.7992 21.8484 16.7204 21.9272 16.6232 21.9272H15.3766C15.2794 21.9272 15.2006 21.8484 15.2006 21.7512V20.9401C15.2006 20.2117 14.7387 19.6419 14.198 19.3593C14.111 19.3139 14.0259 19.2652 13.9429 19.2135C13.4293 18.8937 12.7121 18.7847 12.0878 19.1452L11.3873 19.5496C11.3032 19.5982 11.1955 19.5693 11.1469 19.4852L10.5236 18.4056C10.475 18.3214 10.5039 18.2138 10.588 18.1652L11.2414 17.788C11.8782 17.4203 12.14 16.7263 12.1076 16.1108C12.1039 16.0417 12.1021 15.9721 12.1021 15.9019C12.1021 15.8591 12.1028 15.8164 12.1041 15.774C12.1236 15.1697 11.8587 14.4956 11.2355 14.1358L10.588 13.762C10.5039 13.7134 10.475 13.6058 10.5236 13.5216L11.1469 12.442C11.1955 12.3578 11.3031 12.329 11.3873 12.3776L11.9871 12.7239C12.6249 13.0921 13.3577 12.9708 13.8746 12.6338C13.9791 12.5657 14.087 12.5025 14.198 12.4445C14.7387 12.162 15.2006 11.5921 15.2006 10.8637V10.176Z"
                          fill="#4A4A4A"
                        />
                      </g>
                      <defs>
                        <filter
                          id="filter0_iiii_323_812"
                          x="0"
                          y="0"
                          width="32"
                          height="32"
                          filterUnits="userSpaceOnUse"
                          color-interpolation-filters="sRGB"
                        >
                          <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset dy="1" />
                          <feComposite
                            in2="hardAlpha"
                            operator="arithmetic"
                            k2="-1"
                            k3="1"
                          />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0.890196 0 0 0 0 0.890196 0 0 0 0 0.890196 0 0 0 1 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="shape"
                            result="effect1_innerShadow_323_812"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset dx="1" />
                          <feComposite
                            in2="hardAlpha"
                            operator="arithmetic"
                            k2="-1"
                            k3="1"
                          />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0.890196 0 0 0 0 0.890196 0 0 0 0 0.890196 0 0 0 1 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="effect1_innerShadow_323_812"
                            result="effect2_innerShadow_323_812"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset dx="-1" />
                          <feComposite
                            in2="hardAlpha"
                            operator="arithmetic"
                            k2="-1"
                            k3="1"
                          />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0.890196 0 0 0 0 0.890196 0 0 0 0 0.890196 0 0 0 1 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="effect2_innerShadow_323_812"
                            result="effect3_innerShadow_323_812"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset dy="-1" />
                          <feComposite
                            in2="hardAlpha"
                            operator="arithmetic"
                            k2="-1"
                            k3="1"
                          />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0.709804 0 0 0 0 0.709804 0 0 0 0 0.709804 0 0 0 1 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="effect3_innerShadow_323_812"
                            result="effect4_innerShadow_323_812"
                          />
                        </filter>
                      </defs>
                    </svg>

                    <button
                      style={{
                        position: "absolute",
                        zIndex: 999,

                        background: "#E51C00",
                        height: "40px",
                        width: "110px",
                        borderRadius: 10,
                        color: "white",
                        fontSize: 15,
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
                      Stop Live
                    </button>
                  </>
                ) : null}
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
                      left: 468,
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
                {view == null ? null : (
                  <div
                    style={{
                      width: 50,

                      position: "absolute",
                      zIndex: 999,
                      left: 398,
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
                      class="fa-regular fa-eye"
                    ></i>
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {view?.livestream_id?.view_number}
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
                    controls
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
                        onClick={showModal4}
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
                      <div
                        onClick={showModal2}
                        className="modal_container_left"
                      >
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

                      {listProductFormat?.map((item, index) => (
                        <div key={index} className="product_container_item">
                          <img
                            src={item.image?.src}
                            style={{
                              marginTop: 7,
                              borderRadius: 15,
                              height: 70,
                              border: "0.5px solid #E5E5E4",
                              marginLeft: 10,
                              width: 70,
                            }}
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
                              {item.title}
                            </div>
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: 450,
                                color: "#616161",
                              }}
                            >
                              {item.variants[0].price}đ
                            </div>
                            <div
                              style={{
                                borderRadius: 10,
                                background: "#FFF1E3",
                                padding: 5,
                                width: "45%",
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
                          <div
                            style={{
                              textAlign: "end",
                              paddingRight: 10,
                            }}
                          >
                            {item.status_pin === true ? (
                              <div onClick={() => handlePinClickOff(item)}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="25"
                                  height="20"
                                  viewBox="0 0 12 20"
                                  fill="none"
                                >
                                  <path
                                    d="M6.5 5.2746V4.25C6.5 3.55964 7.05964 3 7.75 3H12.25C12.9404 3 13.5 3.55964 13.5 4.25V5.2746C13.5 5.72317 13.2596 6.13735 12.8702 6.3599L12.4401 6.60563L13.3056 10.5H14C14.6904 10.5 15.25 11.0596 15.25 11.75V12.75C15.25 13.4404 14.6904 14 14 14H11.2187L10.7398 16.8733C10.6795 17.2349 10.3666 17.5 10 17.5C9.63338 17.5 9.32048 17.2349 9.26021 16.8733L8.78133 14H6C5.30964 14 4.75 13.4404 4.75 12.75V11.75C4.75 11.0596 5.30964 10.5 6 10.5H6.69444L7.55986 6.60563L7.12983 6.3599C6.74036 6.13735 6.5 5.72317 6.5 5.2746Z"
                                    fill="#E51C00"
                                  />
                                </svg>
                              </div>
                            ) : (
                              <div onClick={() => handlePinClick(item)}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="25"
                                  height="20"
                                  viewBox="0 0 12 20"
                                  fill="none"
                                >
                                  <path
                                    d="M6.5 5.2746V4.25C6.5 3.55964 7.05964 3 7.75 3H12.25C12.9404 3 13.5 3.55964 13.5 4.25V5.2746C13.5 5.72317 13.2596 6.13735 12.8702 6.3599L12.4401 6.60563L13.3056 10.5H14C14.6904 10.5 15.25 11.0596 15.25 11.75V12.75C15.25 13.4404 14.6904 14 14 14H11.2187L10.7398 16.8733C10.6795 17.2349 10.3666 17.5 10 17.5C9.63338 17.5 9.32048 17.2349 9.26021 16.8733L8.78133 14H6C5.30964 14 4.75 13.4404 4.75 12.75V11.75C4.75 11.0596 5.30964 10.5 6 10.5H6.69444L7.55986 6.60563L7.12983 6.3599C6.74036 6.13735 6.5 5.72317 6.5 5.2746Z"
                                    fill="black"
                                  />
                                </svg>
                              </div>
                            )}

                            <div>
                              <Checkbox
                                onChange={() => handleCheckboxChange(item)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ProductStyle>
                </Modal>
                <Modal
                  title="Discount"
                  open={isModalOpen3}
                  onOk={handleOk3}
                  onCancel={handleCancel3}
                >
                  <ProductStyle>
                    <div className="product_container">
                      <Input
                        placeholder="Search for discount"
                        prefix={<SearchOutlined />}
                      />

                      {listDiscountFormat?.map((item, index) => (
                        <div key={index} className="product_container_item">
                          <div></div>
                          <div>
                            <div
                              style={{
                                fontSize: 18,
                                fontStyle: "normal",
                                fontWeight: 600,
                              }}
                            >
                              {item.title}
                            </div>
                          </div>
                          <div
                            style={{
                              textAlign: "end",
                              paddingRight: 10,
                            }}
                          >
                            {item.status_pin === true ? (
                              <div onClick={() => handlePinClickOff1(item)}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="25"
                                  height="20"
                                  viewBox="0 0 12 20"
                                  fill="none"
                                >
                                  <path
                                    d="M6.5 5.2746V4.25C6.5 3.55964 7.05964 3 7.75 3H12.25C12.9404 3 13.5 3.55964 13.5 4.25V5.2746C13.5 5.72317 13.2596 6.13735 12.8702 6.3599L12.4401 6.60563L13.3056 10.5H14C14.6904 10.5 15.25 11.0596 15.25 11.75V12.75C15.25 13.4404 14.6904 14 14 14H11.2187L10.7398 16.8733C10.6795 17.2349 10.3666 17.5 10 17.5C9.63338 17.5 9.32048 17.2349 9.26021 16.8733L8.78133 14H6C5.30964 14 4.75 13.4404 4.75 12.75V11.75C4.75 11.0596 5.30964 10.5 6 10.5H6.69444L7.55986 6.60563L7.12983 6.3599C6.74036 6.13735 6.5 5.72317 6.5 5.2746Z"
                                    fill="#E51C00"
                                  />
                                </svg>
                              </div>
                            ) : (
                              <div onClick={() => handlePinClick1(item)}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="25"
                                  height="20"
                                  viewBox="0 0 12 20"
                                  fill="none"
                                >
                                  <path
                                    d="M6.5 5.2746V4.25C6.5 3.55964 7.05964 3 7.75 3H12.25C12.9404 3 13.5 3.55964 13.5 4.25V5.2746C13.5 5.72317 13.2596 6.13735 12.8702 6.3599L12.4401 6.60563L13.3056 10.5H14C14.6904 10.5 15.25 11.0596 15.25 11.75V12.75C15.25 13.4404 14.6904 14 14 14H11.2187L10.7398 16.8733C10.6795 17.2349 10.3666 17.5 10 17.5C9.63338 17.5 9.32048 17.2349 9.26021 16.8733L8.78133 14H6C5.30964 14 4.75 13.4404 4.75 12.75V11.75C4.75 11.0596 5.30964 10.5 6 10.5H6.69444L7.55986 6.60563L7.12983 6.3599C6.74036 6.13735 6.5 5.72317 6.5 5.2746Z"
                                    fill="black"
                                  />
                                </svg>
                              </div>
                            )}
                            <div></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ProductStyle>
                </Modal>

                <Modal
                  title="Create Pre-record"
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
                    <Typography.Title level={5}>Choose time</Typography.Title>

                    <RangePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      onChange={handleDateChange}
                      value={formData.startTime && formData.endTime ? [moment(formData.startTime), moment(formData.endTime)] : []}
                    />
                    <Typography.Title level={5}>
                      Choose a thumbnail
                    </Typography.Title>
                    <ImgCrop rotationSlider>
                      <Upload
                        // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                        listType="picture-card"
                        fileList={fileList}
                        onChange={onChange}
                        onPreview={onPreview}
                        beforeUpload={() => false}
                      >
                        {fileList.length < 5 && "+ Upload"}
                      </Upload>
                    </ImgCrop>
                    <Typography.Title level={5}>Upload Video</Typography.Title>
                    <Upload
                      // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                      listType="text"
                      fileList={videoFileList}
                      onChange={onVideoChange}
                      beforeUpload={() => false}
                    >
                      <Button icon={<UploadOutlined />}>Select Video</Button>
                    </Upload>
                  </div>
                </Modal>

                <Modal
                  title="Custom RTMP"
                  open={isModalOpen4}
                  onOk={handleOk4}
                  onCancel={handleCancel4}
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
                    <Typography.Title level={5}>URL</Typography.Title>
                    <Input
                      placeholder="Title of stream..."
                      value={streamData?.livestream_data?.rtmp_url}
                      onChange={(e) => onChanges(e.target.value, "title")}
                      disabled={true}
                    />
                    <Typography.Title level={5}>Stream Key</Typography.Title>
                    <Input
                      // iconRender={(visible) =>
                      //   visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      // }
                      placeholder="Title of stream..."
                      value={streamData?.livestream_data?.stream_key}
                      onChange={(e) => onChanges(e.target.value, "title")}
                      disabled={true}
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
                    <span style={{fontWeight:700}}>Title</span>
                    <Input
                      placeholder="Title of stream..."
                      // value={formData.title}
                      // onChange={(e) => onChanges(e.target.value, "title")}
                    />
                    <span style={{fontWeight:700}}>Description</span>
                    <TextArea
                      
                      maxLength={100}
                      placeholder="disable resize"
                      style={{ height: 120, resize: "none" }}
                      // value={formData.description}
                      // onChange={(e) => onChanges(e.target.value, "description")}
                    />
                    <div style={{marginTop:10}} >
                    <Checkbox>Loop</Checkbox>
                    <Button style={{marginLeft:"40%",backgroundColor:'black'}} type="primary">Confirm</Button>
                    </div>
                </div>
                <div className="container_main_right_bottom">
                  <div className="container_main_right_bottom_top">
                    <span style={{ fontSize: 27, fontWeight: 600 }}>Chat</span>
                  </div>
                  <div className="container_main_right_bottom_bottom">
                    <List>
                      <VirtualList
                        data={livestreamData}
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
                  style={{ fontSize: 17 }}
                />
                Product list
              </div>
              <div
                onClick={showModal3}
                style={{
                  backgroundColor: "white",
                  padding: 8,
                  borderRadius: 12,
                  cursor: "pointer",
                  marginLeft: 10,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="17"
                  viewBox="0 0 20 18"
                  fill="none"
                >
                  <path
                    d="M12.7803 8.28033C13.0732 7.98744 13.0732 7.51256 12.7803 7.21967C12.4874 6.92678 12.0126 6.92678 11.7197 7.21967L7.21967 11.7197C6.92678 12.0126 6.92678 12.4874 7.21967 12.7803C7.51256 13.0732 7.98744 13.0732 8.28033 12.7803L12.7803 8.28033Z"
                    fill="#4A4A4A"
                  />
                  <path
                    d="M9 8C9 8.55228 8.55228 9 8 9C7.44772 9 7 8.55228 7 8C7 7.44772 7.44772 7 8 7C8.55228 7 9 7.44772 9 8Z"
                    fill="#4A4A4A"
                  />
                  <path
                    d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                    fill="#4A4A4A"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.0943 3.51441C11.2723 1.72371 8.72775 1.72371 7.90568 3.51441C7.73011 3.89684 7.28948 4.07936 6.89491 3.93308C5.04741 3.24816 3.24816 5.04741 3.93308 6.89491C4.07936 7.28948 3.89684 7.73011 3.51441 7.90568C1.72371 8.72775 1.72371 11.2723 3.51441 12.0943C3.89684 12.2699 4.07936 12.7105 3.93308 13.1051C3.24816 14.9526 5.04741 16.7519 6.89491 16.0669C7.28948 15.9207 7.73011 16.1032 7.90568 16.4856C8.72775 18.2763 11.2723 18.2763 12.0943 16.4856C12.2699 16.1032 12.7105 15.9207 13.1051 16.0669C14.9526 16.7519 16.7519 14.9526 16.0669 13.1051C15.9207 12.7105 16.1032 12.2699 16.4856 12.0943C18.2763 11.2723 18.2763 8.72775 16.4856 7.90568C16.1032 7.73011 15.9207 7.28948 16.0669 6.89491C16.7519 5.04741 14.9526 3.24816 13.1051 3.93308C12.7105 4.07936 12.2699 3.89684 12.0943 3.51441ZM9.26889 4.14023C9.55587 3.51511 10.4441 3.51511 10.7311 4.14023C11.2341 5.23573 12.4963 5.75856 13.6265 5.33954C14.2715 5.10044 14.8996 5.72855 14.6605 6.3735C14.2415 7.50376 14.7643 8.76597 15.8598 9.26889C16.4849 9.55587 16.4849 10.4441 15.8598 10.7311C14.7643 11.2341 14.2415 12.4963 14.6605 13.6265C14.8996 14.2715 14.2715 14.8996 13.6265 14.6605C12.4963 14.2415 11.2341 14.7643 10.7311 15.8598C10.4441 16.4849 9.55587 16.4849 9.26889 15.8598C8.76597 14.7643 7.50376 14.2415 6.3735 14.6605C5.72855 14.8996 5.10044 14.2715 5.33954 13.6265C5.75856 12.4963 5.23573 11.2341 4.14023 10.7311C3.51511 10.4441 3.51511 9.55587 4.14023 9.26889C5.23573 8.76597 5.75856 7.50376 5.33954 6.3735C5.10044 5.72855 5.72855 5.10044 6.3735 5.33954C7.50376 5.75856 8.76597 5.23573 9.26889 4.14023Z"
                    fill="#4A4A4A"
                  />
                </svg>
                Discount list
              </div>
            </div>

            <div className="container_center">
              {listSchedule?.map((item, index) => (
                <div
                  onClick={() => {
                    setStreamData(item);
                    sessionStorage.setItem("liveId", item?.livestream_id?._id);
                    setStreamId(item?.livestream_id?._id);
                    connectSocket(item?.livestream_id?._id);
                  }}
                  key={index} className="container_center_item">
                  <img

                    src={item?.livestream_id?.thumbnail
                    }
                    style={{ cursor: 'pointer', width: "280px", borderRadius: 15, height: '100%' }}
                    alt=""
                  />
                  <div className="container_center_item_time">
                    <svg width="20" height="20" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M15.375 8.48419C16.5417 9.15776 16.5417 10.8417 15.375 11.5153L7.875 15.8454C6.70833 16.519 5.25 15.677 5.25 14.3299L5.25 5.6696C5.25 4.32245 6.70833 3.48048 7.875 4.15406L15.375 8.48419ZM14.625 10.2162C14.7917 10.12 14.7917 9.87945 14.625 9.78322L7.125 5.4531C6.95833 5.35687 6.75 5.47715 6.75 5.6696L6.75 14.3299C6.75 14.5223 6.95833 14.6426 7.125 14.5464L14.625 10.2162Z" fill="white" />
                    </svg>

                    2:36


                  </div>
                </div>
              ))}

              <div className="container_center_items">
                <Button
                  onClick={() => { showModal2() }}
                  style={{
                    width: '85px',
                    height: '85px'
                  }} icon={<PlusOutlined style={{ fontSize: 40 }} />} />
              </div>
            </div>



            <div className="container_bottom">
              <div className="container_bottom_left">
                <div className="container_bottom_left_title">
                  {streamData?.livestream_id?.title}
                </div>
                <div className="container_bottom_left_info">
                  <img
                    src={user_avatar}
                    style={{ width: 64, borderRadius: 100 }}
                    alt=""
                  />
                  <div className="container_bottom_left_info_name">
                    {user_name}
                  </div>
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
                    {selectedProducts?.map((item, index) =>
                      item.status_pin === true ? (
                        <div
                          key={index}
                          className="container_bottom_left_pin_product_item"
                        >
                          <img
                            src={item.image?.src}
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
                              {item.title}
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
                      ) : null
                    )}
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

                    {listDiscountFormat?.map((item, index) =>
                      item.status_pin === true ? (
                        <div
                          key={index}
                          className="container_bottom_left_pin_product_item"
                        >
                          <div>
                            <div
                              style={{
                                fontSize: 18,
                                fontStyle: "normal",
                                fontWeight: 600,
                              }}
                            >
                              {item.title}
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
                                  {item.value}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              </div>
              <div className="container_bottom_right"></div>
            </div>
          </div>
        </LiveStreamStyle>
      </div>
    </Container>
  );
};

export default PreRecorded;

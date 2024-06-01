import React, { useEffect, useState } from "react"; import Container from "../../components/Container";
import Menus from "../../components/Menus";
import { AnalyticStyle } from "./style";
import axios from "axios";
import { Column } from '@ant-design/plots';

const Analytic = () => {
  const token = sessionStorage.getItem("token");
  const [analytic, setAnalytic] = useState(null);
  const [listAnalytic, setListAnalytic] = useState(null);
  const MoneyFormatter = ({ amount }) => {
    // Định dạng tiền tệ
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });

    return <span>{formatter.format(amount)}</span>;
  };
  const calculateSeconds = (startTime, endTime) => {
    // Chuyển đổi các thời điểm thành đối tượng Date
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    // Tính chênh lệch giây giữa hai thời điểm
    const diffInSeconds = (endDate.getTime() - startDate.getTime()) / 1000;

    return diffInSeconds;
  }

  // Hàm định dạng thời gian thành dạng giờ:phút:giây
  const formatTimes = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    // Định dạng thành chuỗi
    const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    return formattedTime;
  }
  // Hàm định dạng thời gian
  const formatTime = (totalTime) => {
    const totalTimeInSeconds = Math.floor(totalTime / 1000);
    const hours = Math.floor(totalTimeInSeconds / 3600);
    const minutes = Math.floor((totalTimeInSeconds % 3600) / 60);
    const seconds = totalTimeInSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };
  useEffect(() => {

    axios({
      method: "get",
      url: `https://api.windoo.vn/api/analytics`,
      headers: {
        Authorization: token,
      },
    })
      .then((response) => {
        console.log(response.data.docs);
        setAnalytic(response.data.docs);
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
      });

    axios({
      method: "get",
      url: `https://api.windoo.vn/api/analytics/previous-stream`,
      headers: {
        Authorization: token,
      },
    })
      .then((response) => {
        console.log(response.data.docs);
        setListAnalytic(response.data.docs);
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
      });
  }, []);

  const config = {
    data: [
      {
        "month": "January",
        "money": 5300000
      },
      {
        "month": "February",
        "money": 4750000
      },
      {
        "month": "March",
        "money": 6200000
      },
      {
        "month": "April",
        "money": 3950000
      },
      {
        "month": "May",
        "money": 5800000
      },
      {
        "month": "June",
        "money": 4100000
      },
      {
        "month": "July",
        "money": 6500000
      },
      {
        "month": "August",
        "money": 5200000
      },
      {
        "month": "September",
        "money": 4900000
      },
      {
        "month": "October",
        "money": 6750000
      },
      {
        "month": "November",
        "money": 5450000
      },
      {
        "month": "December",
        "money": 7300000
      }
    ],

    xField: 'month',
    yField: 'money',
    label: false,
    axis: {
      y: {
        labelFormatter: (value) => `${value} VND`,
      },
    },
    style: {
      // 圆角样式
      radiusTopLeft: 10,
      radiusTopRight: 10,
      fill: '#EF4D2F'
    },
  };

  return (
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 7fr" }}>
        <Menus />

        <AnalyticStyle>
          <div className="container">
            <div className="container_top">Analytic</div>
            <div className="container_item1">
              <div className="container_item1_top">Revenue from stream</div>
              <div className="container_item1_center"><MoneyFormatter amount={analytic?.totalRevenues} /></div>
              <div className="container_item1_bottom">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.6004 6.6857V12.1713C21.6004 12.3532 21.5281 12.5276 21.3996 12.6562C21.271 12.7848 21.0965 12.857 20.9147 12.857C20.7328 12.857 20.5584 12.7848 20.4298 12.6562C20.3012 12.5276 20.229 12.3532 20.229 12.1713V8.34081L13.1714 15.3992C13.1077 15.463 13.0321 15.5136 12.9489 15.5481C12.8656 15.5826 12.7764 15.6003 12.6863 15.6003C12.5962 15.6003 12.5069 15.5826 12.4237 15.5481C12.3405 15.5136 12.2648 15.463 12.2011 15.3992L9.25778 12.455L3.57161 18.142C3.44294 18.2707 3.26843 18.343 3.08647 18.343C2.90451 18.343 2.73 18.2707 2.60134 18.142C2.47267 18.0134 2.40039 17.8389 2.40039 17.6569C2.40039 17.475 2.47267 17.3004 2.60134 17.1718L8.77264 11.0005C8.83633 10.9367 8.91195 10.8861 8.9952 10.8516C9.07844 10.8171 9.16767 10.7994 9.25778 10.7994C9.34789 10.7994 9.43712 10.8171 9.52036 10.8516C9.6036 10.8861 9.67923 10.9367 9.74291 11.0005L12.6863 13.9447L19.2596 7.3714H15.4291C15.2472 7.3714 15.0728 7.29916 14.9442 7.17056C14.8156 7.04197 14.7434 6.86756 14.7434 6.6857C14.7434 6.50384 14.8156 6.32943 14.9442 6.20084C15.0728 6.07224 15.2472 6 15.4291 6H20.9147C21.0965 6 21.271 6.07224 21.3996 6.20084C21.5281 6.32943 21.6004 6.50384 21.6004 6.6857Z"
                    fill="#29845A"
                  />
                </svg>
                25% from previous livestream
              </div>
            </div>
            <div className="container_item2">
              <div className="container_item2_center">
                <div className="container_item2_center_top">Number of view</div>
                <div className="container_item2_center_center">
                  {analytic?.totalViews}
                  <svg
                    width="69"
                    height="50"
                    viewBox="0 0 69 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_232_5042)">
                      <path
                        opacity="0.2"
                        d="M-33.1274 16.8907C-42.7504 23.3541 -60.83 28.3236 -68.667 30.0004V52.5H224.398V7.43945C180.11 7.43945 179.564 46.159 154.413 46.159C129.261 46.159 128.168 24.2077 115.592 24.2077C103.017 24.2077 106.297 36.098 77.3189 34.726C48.3404 33.3541 34.1245 19.787 16.6281 7.43945C-0.774117 -4.84163 -20.8808 8.66443 -32.9324 16.7597L-33.1274 16.8907Z"
                        fill="url(#paint0_linear_232_5042)"
                      />
                      <path
                        d="M-67.667 29.8158C-59.83 28.1667 -41.7504 23.2797 -32.1274 16.9235C-20.0986 8.9782 0.131679 -4.51374 17.6281 7.629C35.1245 19.7718 49.3404 33.1138 78.3189 34.463C107.297 35.8122 104.017 24.1192 116.592 24.1192C129.168 24.1192 130.261 45.7063 155.413 45.7063C180.564 45.7063 181.11 7.629 225.398 7.629"
                        stroke="#EF4D2F"
                        stroke-width="3"
                      />
                    </g>
                    <defs>
                      <linearGradient
                        id="paint0_linear_232_5042"
                        x1="-40.3337"
                        y1="32.7083"
                        x2="-40.3337"
                        y2="53.5417"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#EF4D2F" />
                        <stop offset="0.195" stop-color="#F48470" />
                        <stop offset="0.68" stop-color="#FAC8BF" />
                        <stop offset="1" stop-color="white" />
                      </linearGradient>
                      <clipPath id="clip0_232_5042">
                        <rect
                          width="68"
                          height="50"
                          fill="white"
                          transform="translate(0.333008)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div className="container_item2_center_bottom">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 10.1431V14.7144C18 14.866 17.9398 15.0113 17.8326 15.1185C17.7255 15.2256 17.5801 15.2858 17.4286 15.2858H12.8572C12.7057 15.2858 12.5604 15.2256 12.4532 15.1185C12.346 15.0113 12.2858 14.866 12.2858 14.7144C12.2858 14.5629 12.346 14.4175 12.4532 14.3104C12.5604 14.2032 12.7057 14.143 12.8572 14.143H16.0493L10.5716 8.66524L8.11877 11.1188C8.0657 11.1719 8.00268 11.214 7.93331 11.2428C7.86394 11.2716 7.78958 11.2864 7.71449 11.2864C7.6394 11.2864 7.56504 11.2716 7.49567 11.2428C7.4263 11.214 7.36328 11.1719 7.31021 11.1188L2.16746 5.97601C2.06024 5.86879 2 5.72337 2 5.57173C2 5.4201 2.06024 5.27468 2.16746 5.16746C2.27468 5.06024 2.4201 5 2.57173 5C2.72337 5 2.86879 5.06024 2.97601 5.16746L7.71449 9.90665L10.1673 7.45313C10.2204 7.4 10.2834 7.35785 10.3528 7.32909C10.4221 7.30034 10.4965 7.28554 10.5716 7.28554C10.6467 7.28554 10.721 7.30034 10.7904 7.32909C10.8598 7.35785 10.9228 7.4 10.9759 7.45313L16.8572 13.3352V10.1431C16.8572 9.99152 16.9174 9.84618 17.0245 9.73902C17.1317 9.63186 17.277 9.57166 17.4286 9.57166C17.5801 9.57166 17.7255 9.63186 17.8326 9.73902C17.9398 9.84618 18 9.99152 18 10.1431Z"
                      fill="#EF4D2F"
                    />
                  </svg>
                  10% from previous livestream{" "}
                </div>
              </div>
              <div className="container_item2_center">
                <div className="container_item2_center_top">Total Sales</div>
                <div className="container_item2_center_center">
                  {analytic?.totalSales}
                  <svg
                    width="69"
                    height="50"
                    viewBox="0 0 69 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_232_5042)">
                      <path
                        opacity="0.2"
                        d="M-33.1274 16.8907C-42.7504 23.3541 -60.83 28.3236 -68.667 30.0004V52.5H224.398V7.43945C180.11 7.43945 179.564 46.159 154.413 46.159C129.261 46.159 128.168 24.2077 115.592 24.2077C103.017 24.2077 106.297 36.098 77.3189 34.726C48.3404 33.3541 34.1245 19.787 16.6281 7.43945C-0.774117 -4.84163 -20.8808 8.66443 -32.9324 16.7597L-33.1274 16.8907Z"
                        fill="url(#paint0_linear_232_5042)"
                      />
                      <path
                        d="M-67.667 29.8158C-59.83 28.1667 -41.7504 23.2797 -32.1274 16.9235C-20.0986 8.9782 0.131679 -4.51374 17.6281 7.629C35.1245 19.7718 49.3404 33.1138 78.3189 34.463C107.297 35.8122 104.017 24.1192 116.592 24.1192C129.168 24.1192 130.261 45.7063 155.413 45.7063C180.564 45.7063 181.11 7.629 225.398 7.629"
                        stroke="#EF4D2F"
                        stroke-width="3"
                      />
                    </g>
                    <defs>
                      <linearGradient
                        id="paint0_linear_232_5042"
                        x1="-40.3337"
                        y1="32.7083"
                        x2="-40.3337"
                        y2="53.5417"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#EF4D2F" />
                        <stop offset="0.195" stop-color="#F48470" />
                        <stop offset="0.68" stop-color="#FAC8BF" />
                        <stop offset="1" stop-color="white" />
                      </linearGradient>
                      <clipPath id="clip0_232_5042">
                        <rect
                          width="68"
                          height="50"
                          fill="white"
                          transform="translate(0.333008)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div className="container_item2_center_bottom">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 10.1431V14.7144C18 14.866 17.9398 15.0113 17.8326 15.1185C17.7255 15.2256 17.5801 15.2858 17.4286 15.2858H12.8572C12.7057 15.2858 12.5604 15.2256 12.4532 15.1185C12.346 15.0113 12.2858 14.866 12.2858 14.7144C12.2858 14.5629 12.346 14.4175 12.4532 14.3104C12.5604 14.2032 12.7057 14.143 12.8572 14.143H16.0493L10.5716 8.66524L8.11877 11.1188C8.0657 11.1719 8.00268 11.214 7.93331 11.2428C7.86394 11.2716 7.78958 11.2864 7.71449 11.2864C7.6394 11.2864 7.56504 11.2716 7.49567 11.2428C7.4263 11.214 7.36328 11.1719 7.31021 11.1188L2.16746 5.97601C2.06024 5.86879 2 5.72337 2 5.57173C2 5.4201 2.06024 5.27468 2.16746 5.16746C2.27468 5.06024 2.4201 5 2.57173 5C2.72337 5 2.86879 5.06024 2.97601 5.16746L7.71449 9.90665L10.1673 7.45313C10.2204 7.4 10.2834 7.35785 10.3528 7.32909C10.4221 7.30034 10.4965 7.28554 10.5716 7.28554C10.6467 7.28554 10.721 7.30034 10.7904 7.32909C10.8598 7.35785 10.9228 7.4 10.9759 7.45313L16.8572 13.3352V10.1431C16.8572 9.99152 16.9174 9.84618 17.0245 9.73902C17.1317 9.63186 17.277 9.57166 17.4286 9.57166C17.5801 9.57166 17.7255 9.63186 17.8326 9.73902C17.9398 9.84618 18 9.99152 18 10.1431Z"
                      fill="#EF4D2F"
                    />
                  </svg>
                  10% from previous livestream{" "}
                </div>
              </div>
              <div className="container_item2_center">
                <div className="container_item2_center_top">Total Time</div>
                <div className="container_item2_center_center">
                  {formatTime(analytic?.totalTime)}

                  <svg
                    width="69"
                    height="50"
                    viewBox="0 0 69 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_232_5042)">
                      <path
                        opacity="0.2"
                        d="M-33.1274 16.8907C-42.7504 23.3541 -60.83 28.3236 -68.667 30.0004V52.5H224.398V7.43945C180.11 7.43945 179.564 46.159 154.413 46.159C129.261 46.159 128.168 24.2077 115.592 24.2077C103.017 24.2077 106.297 36.098 77.3189 34.726C48.3404 33.3541 34.1245 19.787 16.6281 7.43945C-0.774117 -4.84163 -20.8808 8.66443 -32.9324 16.7597L-33.1274 16.8907Z"
                        fill="url(#paint0_linear_232_5042)"
                      />
                      <path
                        d="M-67.667 29.8158C-59.83 28.1667 -41.7504 23.2797 -32.1274 16.9235C-20.0986 8.9782 0.131679 -4.51374 17.6281 7.629C35.1245 19.7718 49.3404 33.1138 78.3189 34.463C107.297 35.8122 104.017 24.1192 116.592 24.1192C129.168 24.1192 130.261 45.7063 155.413 45.7063C180.564 45.7063 181.11 7.629 225.398 7.629"
                        stroke="#EF4D2F"
                        stroke-width="3"
                      />
                    </g>
                    <defs>
                      <linearGradient
                        id="paint0_linear_232_5042"
                        x1="-40.3337"
                        y1="32.7083"
                        x2="-40.3337"
                        y2="53.5417"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#EF4D2F" />
                        <stop offset="0.195" stop-color="#F48470" />
                        <stop offset="0.68" stop-color="#FAC8BF" />
                        <stop offset="1" stop-color="white" />
                      </linearGradient>
                      <clipPath id="clip0_232_5042">
                        <rect
                          width="68"
                          height="50"
                          fill="white"
                          transform="translate(0.333008)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div className="container_item2_center_bottom">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 10.1431V14.7144C18 14.866 17.9398 15.0113 17.8326 15.1185C17.7255 15.2256 17.5801 15.2858 17.4286 15.2858H12.8572C12.7057 15.2858 12.5604 15.2256 12.4532 15.1185C12.346 15.0113 12.2858 14.866 12.2858 14.7144C12.2858 14.5629 12.346 14.4175 12.4532 14.3104C12.5604 14.2032 12.7057 14.143 12.8572 14.143H16.0493L10.5716 8.66524L8.11877 11.1188C8.0657 11.1719 8.00268 11.214 7.93331 11.2428C7.86394 11.2716 7.78958 11.2864 7.71449 11.2864C7.6394 11.2864 7.56504 11.2716 7.49567 11.2428C7.4263 11.214 7.36328 11.1719 7.31021 11.1188L2.16746 5.97601C2.06024 5.86879 2 5.72337 2 5.57173C2 5.4201 2.06024 5.27468 2.16746 5.16746C2.27468 5.06024 2.4201 5 2.57173 5C2.72337 5 2.86879 5.06024 2.97601 5.16746L7.71449 9.90665L10.1673 7.45313C10.2204 7.4 10.2834 7.35785 10.3528 7.32909C10.4221 7.30034 10.4965 7.28554 10.5716 7.28554C10.6467 7.28554 10.721 7.30034 10.7904 7.32909C10.8598 7.35785 10.9228 7.4 10.9759 7.45313L16.8572 13.3352V10.1431C16.8572 9.99152 16.9174 9.84618 17.0245 9.73902C17.1317 9.63186 17.277 9.57166 17.4286 9.57166C17.5801 9.57166 17.7255 9.63186 17.8326 9.73902C17.9398 9.84618 18 9.99152 18 10.1431Z"
                      fill="#EF4D2F"
                    />
                  </svg>
                  10% from previous livestream{" "}
                </div>
              </div>
            </div>
            <div className="container_item3">
              <div className="container_item3_left">
                <Column {...config} />
              </div>
              <div className="container_item3_right">
                <div style={{ fontWeight: 650, fontSize: 20, paddingTop: 10, paddingBottom: 10 }}>Previous Streams</div>
                <div className="container_item3_right_content">
                  {listAnalytic?.map(list => (
                    <div className="container_item3_right_content_item">
                      <div className="container_item3_right_content_item_image">
                        <img
                          src="https://i.vnbusiness.vn/2023/11/20/-6511-1700450245_1200x0.jpg"
                          style={{ width: "100%", borderEndStartRadius: 10, borderTopLeftRadius: 10, height: '100%' }}
                          alt=""
                        />
                        <div className="container_item3_right_content_item_image_time">
                          <svg width="20" height="20" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.375 8.48419C16.5417 9.15776 16.5417 10.8417 15.375 11.5153L7.875 15.8454C6.70833 16.519 5.25 15.677 5.25 14.3299L5.25 5.6696C5.25 4.32245 6.70833 3.48048 7.875 4.15406L15.375 8.48419ZM14.625 10.2162C14.7917 10.12 14.7917 9.87945 14.625 9.78322L7.125 5.4531C6.95833 5.35687 6.75 5.47715 6.75 5.6696L6.75 14.3299C6.75 14.5223 6.95833 14.6426 7.125 14.5464L14.625 10.2162Z" fill="white" />
                          </svg>

                          {formatTimes(calculateSeconds(list?.start_time, list?.end_time))}
                        </div>
                      </div>
                      <div className="container_item3_right_content_item_text">
                        <div style={{ fontWeight: 600, fontSize: 18, color: "#303030" }}>{list.title}</div>
                        <div style={{ marginTop: 5, fontWeight: 450, fontSize: 14, color: "#616161" }}>{list.description
                        }</div>
                        <div style={{ marginTop: 5, fontWeight: 450, fontSize: 14, color: "#616161", display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
                          <span style={{ width: "100%", display: 'flex' }}>
                            <svg style={{ marginRight: 10 }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M15.4212 3.3335H7.35699C6.91773 3.33348 6.53871 3.33347 6.22659 3.35897C5.89713 3.38589 5.56945 3.44532 5.25413 3.60598C4.78373 3.84567 4.40128 4.22812 4.16159 4.69852C4.00093 5.01384 3.9415 5.34152 3.91458 5.67098C3.89734 5.88201 3.89176 6.12359 3.88996 6.39371C3.7308 6.39726 3.58358 6.40352 3.44881 6.41453C3.11935 6.44145 2.79167 6.50088 2.47635 6.66154C2.00595 6.90122 1.6235 7.28367 1.38381 7.75408C1.22315 8.06939 1.16372 8.39708 1.1368 8.72653C1.1113 9.03867 1.11131 9.41763 1.11133 9.85691V13.199C1.11131 13.6382 1.1113 14.0172 1.1368 14.3294C1.16372 14.6588 1.22315 14.9865 1.38381 15.3018C1.6235 15.7722 2.00595 16.1547 2.47635 16.3943C2.79167 16.555 3.11935 16.6144 3.44881 16.6414C3.76095 16.6669 4.13991 16.6668 4.57919 16.6668H12.6435C13.0828 16.6668 13.4617 16.6669 13.7739 16.6414C14.1033 16.6144 14.431 16.555 14.7463 16.3943C15.2167 16.1547 15.5992 15.7722 15.8388 15.3018C15.9995 14.9865 16.0589 14.6588 16.0859 14.3294C16.1031 14.1183 16.1087 13.8767 16.1105 13.6066C16.2696 13.6031 16.4169 13.5968 16.5516 13.5858C16.8811 13.5589 17.2088 13.4995 17.5241 13.3388C17.9945 13.0991 18.3769 12.7167 18.6166 12.2463C18.7773 11.9309 18.8367 11.6033 18.8636 11.2738C18.8891 10.9617 18.8891 10.5827 18.8891 10.1434V6.80136C18.8891 6.36208 18.8891 5.98311 18.8636 5.67098C18.8367 5.34152 18.7773 5.01384 18.6166 4.69852C18.3769 4.22812 17.9945 3.84567 17.5241 3.60598C17.2088 3.44532 16.8811 3.38589 16.5516 3.35897C16.2395 3.33347 15.8605 3.33348 15.4212 3.3335ZM11.3029 15.0002H12.6113C13.0918 15.0002 13.402 14.9995 13.6381 14.9802C13.8645 14.9617 13.9485 14.9303 13.9897 14.9093C14.1465 14.8294 14.2739 14.702 14.3538 14.5452C14.3748 14.504 14.4062 14.42 14.4247 14.1936C14.444 13.9575 14.4447 13.6473 14.4447 13.1668V9.88905C14.4447 9.40859 14.444 9.09836 14.4247 8.86225C14.4062 8.63586 14.3748 8.55193 14.3538 8.51073C14.2739 8.35393 14.1465 8.22644 13.9897 8.14655C13.9485 8.12555 13.8645 8.09416 13.6381 8.07566C13.402 8.05637 13.0918 8.05572 12.6113 8.05572H11.109C11.7952 8.96586 12.2224 10.2473 12.2224 11.6668C12.2224 12.9474 11.8747 14.1156 11.3029 15.0002ZM6.11365 8.05572C5.42748 8.96586 5.00022 10.2473 5.00022 11.6668C5.00022 12.9474 5.34791 14.1156 5.91972 15.0002H4.61133C4.13087 15.0002 3.82064 14.9995 3.58453 14.9802C3.35814 14.9617 3.27421 14.9303 3.23301 14.9093C3.0762 14.8294 2.94872 14.702 2.86882 14.5452C2.84783 14.504 2.81643 14.42 2.79794 14.1936C2.77864 13.9575 2.778 13.6473 2.778 13.1668V9.88905C2.778 9.40859 2.77864 9.09836 2.79794 8.86225C2.81643 8.63586 2.84783 8.55193 2.86882 8.51073C2.94872 8.35393 3.0762 8.22644 3.23301 8.14655C3.27421 8.12555 3.35814 8.09416 3.58453 8.07566C3.82064 8.05637 4.13087 8.05572 4.61133 8.05572H6.11365ZM12.6435 6.38905H5.55677C5.55849 6.14577 5.56315 5.96051 5.57571 5.8067C5.59421 5.58031 5.62561 5.49638 5.6466 5.45517C5.7265 5.29837 5.85398 5.17089 6.01078 5.09099C6.05199 5.07 6.13592 5.0386 6.36231 5.02011C6.59842 5.00081 6.90865 5.00017 7.38911 5.00017H15.3891C15.8696 5.00017 16.1798 5.00081 16.4159 5.02011C16.6423 5.0386 16.7262 5.07 16.7674 5.09099C16.9242 5.17089 17.0517 5.29837 17.1316 5.45517C17.1526 5.49638 17.184 5.58031 17.2025 5.8067C17.2218 6.04281 17.2224 6.35304 17.2224 6.8335V10.1113C17.2224 10.5917 17.2218 10.902 17.2025 11.1381C17.184 11.3645 17.1526 11.4484 17.1316 11.4896C17.0517 11.6464 16.9242 11.7739 16.7674 11.8538C16.7262 11.8748 16.6423 11.9062 16.4159 11.9247C16.3267 11.932 16.2269 11.9366 16.1113 11.9395V9.85692C16.1113 9.41763 16.1114 9.03867 16.0859 8.72653C16.0589 8.39708 15.9995 8.06939 15.8388 7.75408C15.5992 7.28367 15.2167 6.90122 14.7463 6.66154C14.431 6.50088 14.1033 6.44145 13.7739 6.41453C13.4617 6.38902 13.0827 6.38904 12.6435 6.38905ZM10.5558 11.6668C10.5558 12.7361 10.2403 13.6358 9.81364 14.2265C9.38538 14.8195 8.93877 15.0002 8.61133 15.0002C8.28389 15.0002 7.83728 14.8195 7.40902 14.2265C6.98235 13.6358 6.66688 12.7361 6.66688 11.6668C6.66688 10.5975 6.98235 9.69788 7.40902 9.10711C7.83728 8.51414 8.28389 8.3335 8.61133 8.3335C8.93877 8.3335 9.38538 8.51414 9.81364 9.10711C10.2403 9.69788 10.5558 10.5975 10.5558 11.6668Z" fill="#4A4A4A" />
                            </svg>

                            < MoneyFormatter amount={list?.revenues} />
                          </span>
                          <span style={{ width: "100%", display: 'flex' }}>
                            <svg style={{ marginRight: 10 }} width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0007 10.0002C14.0007 11.8411 12.5083 13.3335 10.6673 13.3335C8.82637 13.3335 7.33398 11.8411 7.33398 10.0002C7.33398 8.15921 8.82637 6.66683 10.6673 6.66683C12.5083 6.66683 14.0007 8.15921 14.0007 10.0002ZM12.334 10.0002C12.334 10.9206 11.5878 11.6668 10.6673 11.6668C9.74684 11.6668 9.00065 10.9206 9.00065 10.0002C9.00065 9.07969 9.74684 8.3335 10.6673 8.3335C11.5878 8.3335 12.334 9.07969 12.334 10.0002Z" fill="#4A4A4A" />
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M10.6673 3.3335C7.91568 3.3335 5.83568 4.6999 4.47026 6.14701C3.78674 6.87142 3.26751 7.63021 2.91541 8.28291C2.73941 8.60918 2.60035 8.91784 2.50315 9.19093C2.41335 9.44321 2.33398 9.73371 2.33398 10.0002C2.33398 10.2666 2.41335 10.5571 2.50315 10.8094C2.60035 11.0825 2.73941 11.3911 2.91541 11.7174C3.26751 12.3701 3.78674 13.1289 4.47026 13.8533C5.83568 15.3004 7.91568 16.6668 10.6673 16.6668C13.419 16.6668 15.499 15.3004 16.8644 13.8533C17.5479 13.1289 18.0671 12.3701 18.4192 11.7174C18.5952 11.3911 18.7343 11.0825 18.8315 10.8094C18.9213 10.5571 19.0007 10.2666 19.0007 10.0002C19.0007 9.73371 18.9213 9.44321 18.8315 9.19093C18.7343 8.91784 18.5952 8.60918 18.4192 8.28291C18.0671 7.63021 17.5479 6.87142 16.8644 6.14701C15.499 4.6999 13.419 3.3335 10.6673 3.3335ZM4.00222 10.0025L4.00179 10.0002L4.00222 9.99786C4.0063 9.97586 4.02095 9.89692 4.07331 9.74982C4.13697 9.57098 4.23867 9.34037 4.38226 9.07419C4.66935 8.54199 5.10465 7.90321 5.68248 7.29081C6.83976 6.06431 8.50975 5.00016 10.6673 5.00016C12.8249 5.00016 14.4949 6.06431 15.6522 7.29081C16.23 7.90321 16.6653 8.54199 16.9524 9.07419C17.096 9.34037 17.1977 9.57098 17.2613 9.74982C17.3137 9.89692 17.3283 9.97586 17.3324 9.99786L17.3328 10.0002L17.3324 10.0025C17.3283 10.0245 17.3137 10.1034 17.2613 10.2505C17.1977 10.4293 17.096 10.66 16.9524 10.9261C16.6653 11.4583 16.23 12.0971 15.6522 12.7095C14.4949 13.936 12.8249 15.0002 10.6673 15.0002C8.50975 15.0002 6.83976 13.936 5.68248 12.7095C5.10465 12.0971 4.66935 11.4583 4.38226 10.9261C4.23867 10.66 4.13697 10.4293 4.07331 10.2505C4.02095 10.1034 4.0063 10.0245 4.00222 10.0025Z" fill="#4A4A4A" />
                            </svg>
                            {list?.total_views}</span>
                          <span style={{ width: "100%", display: 'flex' }}>
                            <svg style={{ marginRight: 10 }} width="21" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M2 3.0555C2 2.59526 2.3731 2.22217 2.83333 2.22217H4.62443C5.59325 2.22217 6.41156 2.93473 6.54894 3.88883H17.2778C17.5099 3.88883 17.7315 3.98565 17.8892 4.15596C18.0469 4.32627 18.1265 4.55465 18.1087 4.78608L17.7109 9.95652C17.5885 11.5485 16.261 12.7777 14.6644 12.7777H7.60774L7.71085 13.6439C7.72749 13.7836 7.84597 13.8888 7.98668 13.8888H15.0556C15.5158 13.8888 15.8889 14.2619 15.8889 14.7222C15.8889 15.1824 15.5158 15.5555 15.0556 15.5555H7.98668C7.0017 15.5555 6.17231 14.819 6.05587 13.8409L4.90026 4.13378C4.88363 3.99405 4.76514 3.88883 4.62443 3.88883H2.83333C2.3731 3.88883 2 3.51574 2 3.0555ZM7.40932 11.1111H14.6644C15.3901 11.1111 15.9935 10.5523 16.0492 9.82869L16.3779 5.5555H6.74795L7.40932 11.1111Z" fill="#4A4A4A" />
                              <path d="M10.3333 17.7777C10.3333 18.3914 9.83587 18.8888 9.22222 18.8888C8.60857 18.8888 8.11111 18.3914 8.11111 17.7777C8.11111 17.1641 8.60857 16.6666 9.22222 16.6666C9.83587 16.6666 10.3333 17.1641 10.3333 17.7777Z" fill="#4A4A4A" />
                              <path d="M15.8889 17.7777C15.8889 18.3914 15.3914 18.8888 14.7778 18.8888C14.1641 18.8888 13.6667 18.3914 13.6667 17.7777C13.6667 17.1641 14.1641 16.6666 14.7778 16.6666C15.3914 16.6666 15.8889 17.1641 15.8889 17.7777Z" fill="#4A4A4A" />
                            </svg>

                            {list?.total_sales}</span>
                        </div>
                        <div style={{ marginTop: 5, fontWeight: 450, fontSize: 14, color: "#616161" }}>Body contenr</div>
                        <div style={{ marginTop: 5, fontWeight: 450, fontSize: 14, color: "#616161" }}>Body contenr</div>
                      </div>
                    </div>
                  ))}


                </div>
              </div>
            </div>
          </div>
        </AnalyticStyle>
      </div>
    </Container>
  );
};

export default Analytic;
import styled from "styled-components";
export const LiveStreamStyle = styled.div`
  .container {
    flex: 1;
    .container_top {
      color: var(--p-color-text);
      font-feature-settings: "clig" off, "liga" off;
      /* Heading/heading-2xl */
      /* font-family: Inter; */
      padding-left: 10px;
      font-size: 30px;
      font-style: normal;
      font-weight: 700;
      line-height: 40px; /* 133.333% */
      letter-spacing: -0.3px;
    }
    .container_main {
      padding: 10px;

      display: grid;
      grid-template-columns: 2.9fr 1fr;
      .container_main_left {
        border: 1px solid black;
        height: 100%;
        display: inline-block;
        border-radius: 10px;
        justify-content: center;

        .container_main_left_video {
          height: 100%;
        }
      }

      .container_main_right {
        margin-left: 10px;

        .container_main_right_bottom {
          background-color: #ffffff;
          border-radius: 10px;
          height: 100%;
          .container_main_right_bottom_top {
            border-bottom: 1px solid gray;
          }
          .container_main_right_bottom_bottom {
          }
        }
      }
    }
    .container_bottom {
      display: grid;
      grid-template-columns: 1fr 1fr;
      .container_bottom_left {
        .container_bottom_left_title {
          color: var(--p-color-text);
          font-feature-settings: "clig" off, "liga" off;
          /* Heading/heading-xl */
          /* font-family: Inter; */
          font-size: 24px;
          font-style: normal;
          font-weight: 700;
          line-height: 32px; /* 133.333% */
          letter-spacing: -0.2px;
        }
        .container_bottom_left_info {
          margin-top: 20px;
          display: flex;
          grid-template-columns: 1fr 1fr;
          .container_bottom_left_info_name {
            padding-left: 10px;
            color: #303030;
            font-size: 18px;
            font-style: normal;
            font-weight: 600;
            flex: 1;
            align-content: center;
          }
        }
        .container_bottom_left_pin {
          margin-top: 20px;

          display: grid;
          grid-template-columns: 1fr 1fr;
          .container_bottom_left_pin_product {
            .container_bottom_left_pin_product_item {
              margin-top: 10px;
              display: flex;
              grid-template-columns: 1fr 1fr;
              background-color: #ffffff;
              border-radius: 15px;
              margin-right: 30px;
              padding-top: 5px;
              padding-left: 6px;
              padding-bottom: 5px;
            }
          }
        }
      }
    }
  }
`;
export const ModalStyle = styled.div`
  .modal_container {
    border-top: 1px solid #e5e5e4;

    display: grid;
    grid-template-columns: 1fr 1fr;
    .modal_container_left {
      border: 0.5px solid #e5e5e4;
      text-align: center;
      margin-right: 10px;
      margin-left: 10px;
      margin-top: 12px;
      border-radius: 30px;
    }
  }
`;
export const ProductStyle = styled.div`
  .product_container {
    .product_container_item {
      margin-top: 10px;
      display: grid;
      grid-template-columns: 1fr 3fr 1fr;
      box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.75);
      border-radius: 10px;
      padding: 5px;
    }
  }
`;

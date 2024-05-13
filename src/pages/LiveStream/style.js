import styled from "styled-components";
export const LiveStreamStyle = styled.div`
  .container {
    .container_main {
      padding: 10px;
      border: 1px solid black;
      display: grid;
      grid-template-columns: 3fr 1fr;
      .container_main_left {
        border: 1px solid black;
        height: 600px;
        display: inline-block;
      }
      .container_main_right {
        margin-left: 10px;
        .container_main_right_top {
          border: 2px solid black;
          border-radius: 10px;
          .container_main_right_top_top {
            padding: 10px;

            border-bottom: 1px solid gray;
          }
          .container_main_right_top_bottom {
            display: grid;
            grid-template-columns: 1fr 1fr;
            justify-items: center;
            .container_main_right_top_bottom_item {
              text-align: center;
              .container_main_right_top_bottom_item_top {
                border-bottom: 1px solid black;
                padding: 20px;
              }
              .container_main_right_top_bottom_item_bottom {
                padding: 20px;
              }
            }
          }
        }
        .container_main_right_bottom {
          border: 2px solid black;
          border-radius: 10px;
          margin-top: 10px;
          height: 67%;
          .container_main_right_bottom_top {
            padding: 10px;

            border-bottom: 1px solid gray;
          }
        }
      }
    }
  }
`;
export const ModalStyle = styled.div`
  .modal_container {
    border: 1px solid black;
    display: grid;
    grid-template-columns: 1fr 1fr;
    .modal_container_left {
      border: 1px solid black;
      text-align: center;
    }
  }
`;

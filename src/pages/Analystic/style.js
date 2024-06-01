import styled from "styled-components";
export const AnalyticStyle = styled.div`
  .container {
    
    height: 960px;
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
    .container_item1 {
      background-color: white;
      border-radius: 15px;
      padding: 10px;
      margin-left: 10px;
      margin-right: 10px;
      margin-bottom: 10px;
      /* width: 1260px; */
      .container_item1_center {
        font-size: 64px;
        font-weight: 700;
        text-align: center;
        color: #616161;
      }
      .container_item1_bottom {
        display: flex;
        justify-content: center;
      }
    }
    .container_item2 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      .container_item2_center {
        border-radius: 15px;
        margin-left: 10px;
        margin-top: 10px;
        margin-right: 10px;
        background-color: white;
        padding: 10px;
        .container_item2_center_center {
          font-size: 30px;
          font-weight: 700;
          color: #616161;
          display: flex;
          justify-content: space-between;
        }
      }
    }
    .container_item3 {
      margin-top: 10px;
      width: 100%;
     
      display: grid;
      grid-template-columns: 1fr 1fr;
      .container_item3_left {
        /* border: 1px solid; */
      }
      .container_item3_right {
        margin: 15px;
        border-radius:10px;
        background-color: white;
        .container_item3_right_content {
          border-top: 2px solid #E3E3E3;
          overflow: scroll;
    height: 400px;
          padding: 10px;
          .container_item3_right_content_item {
            margin-top: 10px;
            background-color: white;
             display: grid;
              border-radius: 10px;
              grid-template-columns: 1fr 2fr;
               border: 1px solid #E3E3E3;
            .container_item3_right_content_item_image {
              
              .container_item3_right_content_item_image_time {
                position: relative;
                  margin-top: -43px;
                   margin-left: 8px;
                  background-color: #434446;
                   color: white;
                     padding: 2px;
                   width: 65px;
                     border-radius: 8px;
                 height: 27px;
                 display: flex;
               justify-content: space-around;
               padding-right: 3px;
               padding-top: 2px;
                }

              }
            .container_item3_right_content_item_text{
              padding-left: 12px;
            }
            }
          }
        }
      }
    }
  }
`;

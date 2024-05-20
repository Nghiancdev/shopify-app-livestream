import React from "react";
import styled from "styled-components";
const ContainerStyle = styled.div`
  .container {
    background-color: #f1f1f1;
  }
`;
const HeaderStyle = styled.div`
  .container {
    height: 56px;
    background-color: #1a1a1a;
    display: grid;
    grid-template-columns: 1fr 1fr;
    .container_right {
      .container_right_shopname {
        font-family: Inter;
        font-size: 30px;
        font-style: normal;
        font-weight: 700;
        line-height: 55px; /* 133.333% */
        letter-spacing: -0.3px;
        color: #e3e3e3;
        font-feature-settings: "clig" off, "liga" off;
      }
    }
    .container_left {
      display: flex;
      justify-content: flex-end;

      .container_left_ring {
        display: flex;
        width: 60px;

        justify-content: center;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
        align-self: stretch;
      }
      .container_left_avatar {
        display: flex;
        width: 60px;
        justify-content: center;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
        align-self: stretch;
      }
    }
  }
`;
const Container = ({ children }) => {
  return (
    <ContainerStyle>
      <HeaderStyle>
        <div className="container">
          <div className="container_right">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M11.1111 5.55555C10.4975 5.55555 9.99999 6.05301 9.99999 6.66666V13.3333C9.99999 13.947 10.4975 14.4444 11.1111 14.4444H13.3333C13.947 14.4444 14.4444 13.947 14.4444 13.3333V6.66666C14.4444 6.05301 13.947 5.55555 13.3333 5.55555H11.1111Z"
                fill="#E3E3E3"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.94444 2.77777C4.64325 2.77777 2.77777 4.64325 2.77777 6.94444V13.0555C2.77777 15.3567 4.64325 17.2222 6.94444 17.2222H13.0555C15.3567 17.2222 17.2222 15.3567 17.2222 13.0555V6.94444C17.2222 4.64325 15.3567 2.77777 13.0555 2.77777H6.94444ZM4.44444 6.94444C4.44444 5.56373 5.56373 4.44444 6.94444 4.44444H13.0555C14.4363 4.44444 15.5555 5.56373 15.5555 6.94444V13.0555C15.5555 14.4363 14.4363 15.5555 13.0555 15.5555H6.94444C5.56373 15.5555 4.44444 14.4363 4.44444 13.0555V6.94444Z"
                fill="#E3E3E3"
              />
            </svg>
            <span className="container_right_shopname">Windoo</span>
          </div>
          <div className="container_left">
            <div className="container_left_ring">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M7.25203 14.4239L4.8061 14.1427C2.95144 13.9295 2.42542 11.4844 4.02838 10.5274L4.0933 10.4886C4.966 9.96761 5.50045 9.02609 5.50045 8.00969V7.5C5.50045 5.01472 7.51517 3 10.0005 3C12.4857 3 14.5005 5.01472 14.5005 7.5V8.00969C14.5005 9.02609 15.0349 9.96761 15.9076 10.4886L15.9725 10.5274C17.5755 11.4844 17.0495 13.9295 15.1948 14.1427L12.652 14.435V14.8C12.652 16.2912 11.4432 17.5 9.95203 17.5C8.46086 17.5 7.25203 16.2912 7.25203 14.8V14.4239ZM11.152 14.5H8.75203V14.8C8.75203 15.4627 9.28929 16 9.95203 16C10.6148 16 11.152 15.4627 11.152 14.8V14.5ZM8.00045 13H12.0005L15.0235 12.6525C15.453 12.6032 15.5748 12.0369 15.2036 11.8153L15.1387 11.7766C15.0591 11.7291 14.9815 11.6793 14.9057 11.6273C14.7506 11.521 14.6036 11.4055 14.4651 11.2818C14.4405 11.2598 14.4162 11.2377 14.3922 11.2152C13.5144 10.395 13.0005 9.23833 13.0005 8.00969V7.5C13.0005 5.84315 11.6573 4.5 10.0005 4.5C8.3436 4.5 7.00045 5.84315 7.00045 7.5V8.00969C7.00045 9.23833 6.48651 10.395 5.60871 11.2152C5.58469 11.2377 5.56039 11.2598 5.53583 11.2818C5.39734 11.4055 5.25029 11.521 5.09523 11.6273C5.01945 11.6793 4.94176 11.7291 4.86222 11.7766L4.79729 11.8153C4.4261 12.0369 4.5479 12.6032 4.97739 12.6525L8.00045 13Z"
                  fill="#E3E3E3"
                />
              </svg>
            </div>
            <div className="container_left_avatar">
              <img style={{ borderRadius: 7 }} src="/portrait06.png" alt="" />
            </div>
          </div>
        </div>
      </HeaderStyle>
      <div className="container">{children}</div>
    </ContainerStyle>
  );
};

export default Container;

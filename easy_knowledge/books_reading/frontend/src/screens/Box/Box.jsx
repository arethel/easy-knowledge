import React from "react";
import styled from "styled-components";

const StyledBox = styled.div`
  height: 140px;
  width: 1715px;

  & .top-bar {
    height: 140px;
    left: 0;
    position: fixed;
    top: 0;
    width: 1715px;
  }

  & .overlap {
    height: 140px;
    position: relative;
  }

  & .BG {
    background-color: var(--collection-1-blocks);
    border-radius: 5px;
    height: 51px;
    left: 0;
    position: absolute;
    top: 0;
    width: 1715px;
  }

  & .page {
    border-radius: 12px;
    height: 34px;
    left: 8px;
    overflow: hidden;
    position: absolute;
    top: 8px;
    width: 192px;
  }

  & .text-wrapper {
    color: #ffffff;
    font-family: var(--main-font-font-family);
    font-size: var(--main-font-font-size);
    font-style: var(--main-font-font-style);
    font-weight: var(--main-font-font-weight);
    left: 64px;
    letter-spacing: var(--main-font-letter-spacing);
    line-height: var(--main-font-line-height);
    position: absolute;
    top: 3px;
  }

  & .icon-horizontal {
    height: 5px;
    left: 11px;
    position: absolute;
    top: 15px;
    width: 17px;
  }

  & .icon-cross {
    height: 15px;
    left: 168px;
    position: absolute;
    top: 10px;
    width: 15px;
  }

  & .div {
    background-color: var(--collection-1-bg);
    border-radius: 12px;
    height: 34px;
    left: 211px;
    overflow: hidden;
    position: absolute;
    top: 8px;
    width: 192px;
  }

  & .page-2 {
    background-color: var(--collection-1-block2);
    border-radius: 12px;
    height: 132px;
    left: 414px;
    overflow: hidden;
    position: absolute;
    top: 8px;
    width: 192px;
  }

  & .img {
    height: 5px;
    left: 13px;
    position: absolute;
    top: 17px;
    width: 17px;
  }

  & .icon-cross-2 {
    height: 15px;
    left: 169px;
    position: absolute;
    top: 12px;
    width: 15px;
  }

  & .props {
    height: 92px;
    left: 5px;
    overflow: hidden;
    position: absolute;
    top: 35px;
    width: 183px;
  }

  & .text-wrapper-2 {
    color: var(--collection-1-font-1);
    font-family: var(--smaller-font-font-family);
    font-size: var(--smaller-font-font-size);
    font-style: var(--smaller-font-font-style);
    font-weight: var(--smaller-font-font-weight);
    left: 61px;
    letter-spacing: var(--smaller-font-letter-spacing);
    line-height: var(--smaller-font-line-height);
    position: absolute;
    top: 67px;
    white-space: nowrap;
  }

  & .text-wrapper-3 {
    color: var(--collection-1-font-1);
    font-family: var(--smaller-font-font-family);
    font-size: var(--smaller-font-font-size);
    font-style: var(--smaller-font-font-style);
    font-weight: var(--smaller-font-font-weight);
    left: 64px;
    letter-spacing: var(--smaller-font-letter-spacing);
    line-height: var(--smaller-font-line-height);
    position: absolute;
    top: 38px;
    white-space: nowrap;
  }

  & .chapters {
    height: 31px;
    left: 0;
    position: absolute;
    top: 7px;
    width: 185px;
  }

  & .overlap-group {
    background-color: var(--collection-1-bg);
    border-radius: 12px;
    height: 31px;
    position: relative;
    width: 183px;
  }

  & .text-wrapper-4 {
    color: var(--collection-1-font-1);
    font-family: var(--smaller-font-font-family);
    font-size: var(--smaller-font-font-size);
    font-style: var(--smaller-font-font-style);
    font-weight: var(--smaller-font-font-weight);
    left: 48px;
    letter-spacing: var(--smaller-font-letter-spacing);
    line-height: var(--smaller-font-line-height);
    position: absolute;
    top: 3px;
    white-space: nowrap;
  }
`;

export const Box = () => {
  return (
    <StyledBox>
      <div className="top-bar">
        <div className="overlap">
          <div className="BG" />
          <div className="page">
            <div className="text-wrapper">Page1</div>
            <img className="icon-horizontal" alt="Icon horizontal" src="/img/icon-horizontal-ellipsis-2.png" />
            <img className="icon-cross" alt="Icon cross" src="/img/icon-cross-2.png" />
          </div>
          <div className="div">
            <div className="text-wrapper">Page2</div>
            <img className="icon-horizontal" alt="Icon horizontal" src="/img/icon-horizontal-ellipsis-2.png" />
            <img className="icon-cross" alt="Icon cross" src="/img/icon-cross-2.png" />
          </div>
          <div className="page-2">
            <div className="text-wrapper">Page3</div>
            <img className="img" alt="Icon horizontal" src="/img/icon-horizontal-ellipsis-2.png" />
            <img className="icon-cross-2" alt="Icon cross" src="/img/icon-cross-2.png" />
            <div className="props">
              <div className="text-wrapper-2">Delete</div>
              <div className="text-wrapper-3">Share</div>
              <div className="chapters">
                <div className="overlap-group">
                  <div className="text-wrapper-4">Chapters</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledBox>
  );
};

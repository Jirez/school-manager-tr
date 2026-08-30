import styled from "styled-components";

export const BoxWrapper = styled.div`
  padding-bottom: 10px;
  width: 100%;
  height: auto;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0 2px 2px #ccc;
  box-sizing: border-box;
  margin-bottom: 30px;
  
  .dark-layout & {
    background-color: #283046;
    box-shadow: 0 2px 2px #161d31;
  }
`

export const BoxMiniWrapper = styled.div`
  /*padding-bottom: 10px;*/
  width: 100%;
  height: auto;
  background-color: #ffffff;
  border-radius: 2px;
  box-shadow: 0 2px 2px #ccc;
  box-sizing: border-box;
  margin-bottom: 20px;
`

export const BoxInfo = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 24px 30px;
  border-bottom: 2px solid #F5F5F5;
  background-color: #FBFBFB;
  border-radius: 5px 5px 0 0;

  .dark-layout & {
    background-color: #283046;
    border-bottom: 2px solid rgba(22, 29, 49, 0.71);
  }
`

export const BoxMiniInfo = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 15px 15px;
  border-bottom: 2px solid #F5F5F5;
  background-color: #FBFBFB;
  border-radius: 5px 5px 0 0;
`

export const BoxHead = styled.div`
  font-size: 20px;
  line-height: 24px;
  font-weight: 500;
  margin-bottom: 6px;
`

export const BoxMiniHead = styled.div`
  font-size: 16px;
  /*line-height: 24px;*/
  font-weight: 600;
  /*margin-bottom: 6px;*/
`

export const BoxDescription = styled.div`
  font-size: 13px;
  line-height: 20px;
  color: #333333;

  .dark-layout & {
    color: #b4b7bd;
  }

  @media screen and (max-width: 768px) {
    font-size: 13px;
  }
`

export const BoxContent = styled.div`
  padding: 30px 20px;
`

export const BoxMiniContent = styled.div`
  padding: 10px 15px;
`
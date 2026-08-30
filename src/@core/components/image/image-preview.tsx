import React from 'react'
import styled from 'styled-components'
import { X } from 'react-feather'
// import { useImage } from "react-image";

// import Image from './Image';

const config = await fetch('/configuration.json').then((res) => res.json())

const DeleteButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  //transform: translate(-50%, -50%);
  //-ms-transform: translate(-50%, -50%);
  //background-color: #ffffff;
  //color: white;
  //font-size: 16px;

  cursor: pointer;
  //border-radius: 5px;
  padding: 0.6rem;
  box-shadow: 0 5px 20px 0 rgb(34 41 47 / 10%);
  border-radius: 0.357rem;
  background-color: #ffffff;
  opacity: 1;
  transition: all 0.23s ease 0.1s;
  //position: relative;
  transform: translate(18px, -10px);

  &:hover {
    transform: translate(0, -1px);
    transition: all 0.23s ease 0.1s;
    box-shadow: 0 1px 2px 0 rgb(34 41 47 / 10%);
  }

  .dark-layout & {
    background-color: #161d31;
  }
`

interface Props {
  url: string
  deleteAction: () => void
}

const ImagePreview: React.FC<Props> = ({ url, deleteAction }) => {
  // const { src } = useImage({ srcList: `${config?.pictureServer}/${url}` });

  return (
    <div className="border-1 dark:border-primary rounded-sm relative shadow-sm flex flex-row justify-center bg-white dark:bg-black max-h-96 md:max-h-80">
      {/* <Image
                url={`${config.pictureServer}/${url}`}
            /> */}
      <img src={`${config?.pictureServer}/${url}`} alt="Student picture" />
      <DeleteButton onClick={deleteAction}>
        <X size={20} />
      </DeleteButton>
    </div>
  )
}

export default ImagePreview

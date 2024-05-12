import React, { useCallback, useMemo, useState } from "react";
import { useWeb3 } from "../../context/useWeb3";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import Dropzone, { useDropzone } from "react-dropzone";
import cuid from "cuid";
import ImageGrid from "../../Components/AddAuction/ImageGrid";
import "./AddAuction.css";
import { uploadImageToAuctionItem } from "../../firebase";
import { useNavigate } from "react-router-dom";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const AddAuction = () => {
  const navigate = useNavigate();
  const { web3, accounts, contracts, deployAuction } = useWeb3();
  const { auctionCreator, auctions } = contracts;
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.map((file) => {
      const reader = new FileReader();

      reader.onload = function (e) {
        setImages((prevState) => [
          ...prevState,
          { id: cuid(), src: e.target.result, file: file },
        ]);
      };

      reader.readAsDataURL(file);
      return file;
    });
  }, []);

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({ onDrop, accept: { "image/*": [] } });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const clickHandler = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        console.error("No accounts found.");
        return;
      }

      let id = await auctionCreator.methods.auctionsCount().call();

      let urls = [];
      for (let { file } of images) {
        let url = await uploadImageToAuctionItem(id, file);
        urls.push(url);
      }
      try {
        await deployAuction(id, title, description, urls);
      } catch (e) {
      }
      navigate("/auctions");
    } catch (error) {
      console.error("Error adding property:", error);
    }
  };

  return (
    <Flex w={"100%"}>
      {web3 && auctionCreator && (
        <Box w="55%" mx="auto" p="4">
          <Box mb="4">
            <Heading size="lg" mb="2" textAlign={"center"}>
              Auction new object
            </Heading>
            <Divider />
            <FormControl mt="5">
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Name"
                mb="2"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                mb="2"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Image</FormLabel>
              <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>
              <ImageGrid images={images} />
            </FormControl>

            <Flex m="5" alignItems={"center"} justifyContent={"center"}>
              <Button
                size="lg"
                colorScheme="orange"
                onClick={() => clickHandler()}
              >
                Auction me
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </Flex>
  );
};

export default AddAuction;

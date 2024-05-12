import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWeb3 } from "../../context/useWeb3";
import { Button, Flex, Grid, Heading, Image, Text } from "@chakra-ui/react";
import ChakraCarousel from "../../Components/ViewAuction/Carousel";
import BidsComponent from "../../Components/ViewAuction/BidsComponent";

const ViewAuction = () => {
  let { id } = useParams();
  const { web3, accounts, contracts } = useWeb3();
  const { auctions } = contracts;
  const [auctionDetails, setAuctionDetails] = useState({ imageUrl: [] });
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (auctions && auctions[id]) {
      getAuctionDetails();
    }
  }, [auctions]);

  const getAuctionDetails = async () => {
    let auction = await auctions[id].methods.getAuctionDetails().call();
    setAuctionDetails(auction);
    console.log(auction);
    debugger;
  };

  const placeBid = async (ammount) => {
    try {
      const bidAmountWei = web3.utils.toWei(ammount.toString(), "ether");
      await auctions[id].methods.placeBid().send({
        from: accounts[0],
        value: bidAmountWei,
      });
      console.log("Bid placed successfully");
    } catch (error) {
      console.error("Error placing bid:", error);
    }
  };

  const cancelAuction = async () => {
    try {
      await auctions[id].methods.cancelAuction().send({
        from: accounts[0],
      });
    } catch (error) {
      console.error("Error placing bid:", error);
    }
  };

  const finishAuction = async () => {
    try {
      await auctions[id].methods.finalizeAuction().send({
        from: accounts[0],
      });
    } catch (error) {
      console.error("Error placing bid:", error);
    }
  };

  return (
    <Flex flexDir="row" w="100%" h="100%">
      {auctionDetails && (
        <>
          <Flex flexDir={"column"} w="70%" alignItems={"center"}>
            <Flex dir="row">
              <Heading fontWeight={"300"}>Auction for:</Heading>
              <Heading fontWeight={"bold"} ml="3">
                {auctionDetails.title}
              </Heading>
            </Flex>
            <Text
              mt={3}
              color="gray.500"
            >{`"${auctionDetails.description}"`}</Text>

            {auctionDetails.imageUrls &&
              auctionDetails.imageUrls.length > 0 && (
                <ChakraCarousel gap={15}>
                  {auctionDetails.imageUrls.map((url) => (
                    <Image src={url} alt="url"></Image>
                  ))}
                </ChakraCarousel>
              )}
          </Flex>
          <BidsComponent
            endBlock={auctionDetails.endBlock}
            highestBiddingBid={auctionDetails.highestBiddingBid}
            placeBid={placeBid}
            owner={auctionDetails.owner}
            cancelAuction={cancelAuction}
            finishAuction={finishAuction}
            state={auctionDetails.auctionState}
          />
        </>
      )}
    </Flex>
  );
};

export default ViewAuction;

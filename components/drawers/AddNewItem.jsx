/* eslint-disable react-hooks/exhaustive-deps */
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Button, Radio } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import EnterQty from "./EnterQty";

const DrawerAddNewItem = ({ token, handleAddNew = {} }) => {
  const { data: session } = useSession();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const [checked, setChecked] = useState("");
  const [filterProd, setFilterProd] = useState("");
  const [listProd, setListProd] = useState([]);

  const AddNewItem = (qty) => {
    const q = parseFloat(qty);
    if (q <= 0) {
      toast({
        title: "Message Warning!",
        description: "Please enter qty!",
        status: "error",
        duration: 3500,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (checked.length > 0) {
      const prod = listProd.filter((i) => i.fcskid === checked);
      prod.qty = parseFloat(qty);
      handleAddNew(prod);
      onClose();
      return;
    }

    toast({
      title: "Message Warning!",
      description: "Please select Product!",
      status: "warning",
      duration: 3500,
      isClosable: true,
      position: "top",
    });
  };

  const FetchProduct = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    // 1,2,5
    const res = await fetch(
      `${process.env.API_HOST}/product?offset=1&limit=10&type=1,2,4,5&whs=${session?.user.whs.name}&filterNo=${filterProd}`,
      requestOptions
    );

    if (res.ok) {
      const data = await res.json();
      setListProd(data.data);
      // console.dir(data.data);
      return;
    }

    if (!res.ok) {
      toast({
        title: "Message Error!",
        description: res.statusText,
        status: "error",
        duration: 3500,
        isClosable: true,
        position: "top",
      });
      return;
    }
  };

  useEffect(() => {
    if (filterProd.length > 3) {
      FetchProduct();
    }

    if (filterProd.length <= 0) {
      setListProd([]);
    }
  }, [filterProd]);

  useEffect(() => {
    if (isOpen) {
      setFilterProd("");
      setChecked("");
      setListProd([]);
    }
  }, [isOpen]);

  return (
    <>
      <Button auto color={`primary`} size={`sm`} ripple onPress={onOpen}>
        Add Product
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size={"sm"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Select Product Item</DrawerHeader>

          <DrawerBody>
            <div className="form-control">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search…"
                  className="input input-bordered input-sm w-96"
                  value={filterProd}
                  onChange={(e) => setFilterProd(e.target.value)}
                />
                <button
                  className="btn btn-square btn-sm"
                  onClick={FetchProduct}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {listProd.length > 0 ? (
              <>
                <div className="divider" />
                <div className="mt-4">
                  <Radio.Group
                    label="Product List"
                    value={checked}
                    onChange={setChecked}
                  >
                    {listProd.map((i, x) => (
                      <Radio
                        key={i.fcskid}
                        size="sm"
                        value={i.fcskid}
                        description={i.fcname}
                      >
                        {i.fccode}
                      </Radio>
                    ))}
                  </Radio.Group>
                </div>
              </>
            ) : (
              <></>
            )}
          </DrawerBody>

          <DrawerFooter>
            <div className="flex justify-center items-center space-x-4">
              <Button auto color={"error"} onPress={onClose}>
                Cancel
              </Button>
              <EnterQty isVisible={checked.length > 0} isConfirm={AddNewItem} />
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DrawerAddNewItem;

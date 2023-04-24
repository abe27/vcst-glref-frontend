/* eslint-disable react-hooks/exhaustive-deps */
import { DrawerAddNewItem } from "@/components";
import InputQty from "@/components/drawers/InputQty";
import MainLayout from "@/components/layout";
import { DateOnly, DateTime, DateTimePostman } from "@/hooks";
import { useToast } from "@chakra-ui/react";
import { Button, Container, Dropdown, Input, Table } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

const AddNewAdjustPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const toast = useToast();
  const [selected, setSelected] = useState(new Set(["text"]));
  const [receiveType, setReceiveType] = useState([]);
  const [recBook, setRecBook] = useState({});
  const [recWhs, setRecWhs] = useState({});
  const [refData, setRefData] = useState([]);
  const [recQty, setRecQty] = useState(0);
  const [remark, setRemark] = useState("-");
  const [recDate, setRecDate] = useState(null);

  const selectedValue = useMemo(() => {
    const id = Array.from(selected).join(", ").replaceAll("_", " ");
    const obj = receiveType.filter((i) => i.fcskid === id);
    if (obj.length > 0) {
      setRecBook(obj[0]);
      setRecWhs(obj[0].whouse);
      return `${obj[0].fccode}-${obj[0].fcname}`;
    }
    return "-";
  }, [selected]);

  const fetchReceiveType = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const res = await fetch(
      `${process.env.API_HOST}/book?fctype=FR&whs=VCST&limit=100&offer=1`,
      requestOptions
    );

    if (res.ok) {
      const data = await res.json();
      // console.dir(data.data);
      setReceiveType(data.data);
      return;
    }

    if (!res.ok) {
      toast({
        title: "Message Error!",
        description: res.statusText,
        status: "error",
        duration: 3500,
        position: "top",
        isClosable: true,
      });
      return;
    }
  };

  const handleAddNew = (obj) => {
    // console.dir(obj);
    let doc = {
      seq: refData.length,
      id: obj[0].fcskid,
      fnqty: obj.qty,
      unit: obj[0].product_unit,
      ftlastupd: new Date(),
      prod: obj[0],
    };

    if (refData.length > 0) {
      const data = refData.filter((x) => x.id === obj[0].fcskid);
      if (data.length > 0) {
        setRefData((prevState) => {
          const x = [...prevState];
          x[data[0].seq].fnqty = x[data[0].seq].fnqty + obj.qty;
          return x;
        });
      } else {
        setRefData([doc, ...refData]);
      }
    } else {
      setRefData([doc, ...refData]);
    }
  };

  const RemoveProduct = (seq) => {
    let doc = [];
    refData.map((i) => {
      if (i.seq !== seq) {
        doc.push(i);
      }
    });
    setRefData(doc);
  };

  const updateQty = (obj) => {
    setRefData((prevState) => {
      const x = [...prevState];
      x.map((i) => {
        if (i.id === obj.id) {
          i.fnqty = obj.fnqty;
          i.ftlastupd = new Date();
        }
      });
      return x;
    });
  };

  const handlerSaveData = async () => {
    if (selectedValue === "-") {
      toast({
        title: "Message Error!",
        description: "Please select receive type!",
        status: "error",
        duration: 3500,
        position: "top",
        isClosable: true,
      });
      return;
    }

    if (refData.length <= 0) {
      toast({
        title: "Message Error!",
        description: "Item is empty!",
        status: "error",
        duration: 3500,
        position: "top",
        isClosable: true,
      });
      return;
    }

    let prod = [];
    refData.map((i) => {
      prod.push({
        fccode: i.prod.fccode,
        pack: 1,
        qty: i.fnqty,
      });
    });

    let doc = {
      fcbook: recBook.fccode,
      fcbranch: "00000",
      fcwhouse: recWhs.fccode,
      fcreftype: recBook.fcreftype,
      fcrftype: recBook.fcreftype.substring(0, 1),
      fcstep: "I",
      fcremark: remark,
      fddate: DateTimePostman(recDate),
      ref_prod: prod,
    };

    // // console.dir(recBook);
    // console.dir(doc);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", session?.user.accessToken);

    var raw = JSON.stringify(doc);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const res = await fetch(
      `${process.env.API_HOST}/gl/ref?whs=VCST`,
      requestOptions
    );

    if (res.ok) {
      toast({
        title: "System Message",
        description: "Save data is successfully.",
        status: "success",
        duration: 3500,
        position: "top",
        isClosable: true,
      });
      router.back();
      return;
    }

    if (!res.ok) {
      toast({
        title: "Message Error!",
        description: res.statusText,
        status: "error",
        duration: 3500,
        position: "top",
        isClosable: true,
      });
      return;
    }
  };

  useEffect(() => {
    let q = 0;
    refData.map((i) => {
      q = q + i.fnqty;
    });
    setRecQty(q);
  }, [refData]);

  useEffect(() => {
    // console.dir(recWhs);
    let dte = new Date();
    setRecDate(DateOnly(dte));
    if (session?.user) {
      fetchReceiveType();
    }
  }, [session]);

  return (
    <MainLayout>
      <div className="lg:my-12 container px-6 mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-gray-300">
        <div>
          <div className="flex justify-start w-80">
            <h4 className="mt-3 text-sm font-bold leading-tight text-gray-800">
              REC. DATE:&nbsp;&nbsp;
            </h4>
            <Input
              color="primary"
              type="date"
              size="xs"
              placeholder="0"
              value={recDate}
              onChange={(e) => setRecDate(e.target.value)}
            />
          </div>
          <div className="flex justify-start space-x-4">
            <div className="flex w-80">
              <Container gap={0} css={{ d: "flex", flexWrap: "nowrap" }}>
                <div className="mt-3 text-sm font-bold leading-tight text-gray-800">
                  REC. TYPE:
                </div>
                <Dropdown>
                  <Dropdown.Button color={"primary"} light>
                    {selectedValue}
                  </Dropdown.Button>
                  <Dropdown.Menu
                    aria-label="Static Actions"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={selected}
                    onSelectionChange={setSelected}
                  >
                    {receiveType.map((i, x) => (
                      <Dropdown.Item key={i.fcskid} description={i.fcname}>
                        {i.fccode}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Container>
            </div>
            {/* <h4 className="mt-3 text-sm font-bold leading-tight text-gray-800">
              FROM:&nbsp;&nbsp;
              <span className="text-blue-600">{`${recWhs.fccode}-${recWhs.fcname}`}</span>
            </h4> */}
            <div className="flex w-80">
              <h4 className="mt-3 text-sm font-bold leading-tight text-gray-800">
                TO:&nbsp;&nbsp;
              </h4>
              <h4 className="mt-3 text-sm font-bold leading-tight text-blue-400">
                {recWhs !== null && recWhs.fccode !== undefined
                  ? `${recWhs.fccode}-${recWhs.fcname}`
                  : "-"}
              </h4>
            </div>
          </div>
          <div className="mt-2 flex justify-start space-x-4">
            <h4 className="text-sm font-bold leading-tight text-gray-800">
              TOTAL:&nbsp;&nbsp;
              <Input
                readOnly
                type="number"
                size="xs"
                placeholder="0"
                value={refData.length}
              />
            </h4>
            <h4 className="text-sm font-bold leading-tight text-gray-800">
              QTY.:&nbsp;&nbsp;
              <Input
                readOnly
                size="xs"
                placeholder="0"
                value={recQty.toLocaleString()}
              />
            </h4>
            <h4 className="text-sm font-bold leading-tight text-gray-800">
              REMARK:&nbsp;&nbsp;
              <Input
                clearable
                size="xs"
                placeholder="remark"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </h4>
          </div>
        </div>
        <div className="flex space-x-2 mt-6 lg:mt-0">
          <Button
            auto
            light
            color={`default`}
            size={`sm`}
            ripple
            onPress={() => router.back()}
          >
            Back
          </Button>
          <Button
            auto
            color={`success`}
            size={`sm`}
            ripple
            onPress={handlerSaveData}
          >
            Save
          </Button>
        </div>
      </div>
      <div className="flex justify-end pr-8">
        <DrawerAddNewItem
          token={session?.user.accessToken}
          handleAddNew={handleAddNew}
        />
      </div>
      <div className="mt-4 pl-8 pr-8">
        <Table
          shadow={false}
          aria-label="Example pagination  table"
          css={{
            height: "auto",
            minWidth: "100%",
          }}
          // selectionMode="multiple"
        >
          <Table.Header>
            <Table.Column>#</Table.Column>
            <Table.Column>FCCODE</Table.Column>
            <Table.Column>FCNAME</Table.Column>
            <Table.Column>QTY</Table.Column>
            <Table.Column>UNIT</Table.Column>
            <Table.Column></Table.Column>
            <Table.Column></Table.Column>
          </Table.Header>
          <Table.Body>
            {refData.map((i, x) => (
              <Table.Row key={x}>
                <Table.Cell>{("000" + (x + 1)).slice(-3)}</Table.Cell>
                <Table.Cell>{i.prod.fccode}</Table.Cell>
                <Table.Cell>{i.prod.fcname}</Table.Cell>
                <Table.Cell>
                  <InputQty obj={i} isConfirm={updateQty} />
                </Table.Cell>
                <Table.Cell>{i.unit.fcname}</Table.Cell>
                <Table.Cell>{DateTime(i.ftlastupd)}</Table.Cell>
                <Table.Cell>
                  <Button
                    light
                    color="error"
                    auto
                    size={"xs"}
                    rounded
                    onPress={() => RemoveProduct(i.seq)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </MainLayout>
  );
};

export default AddNewAdjustPage;

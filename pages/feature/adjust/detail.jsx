/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import MainLayout from "@/components/layout";
import { Button, Table, Tooltip } from "@nextui-org/react";
import { DateOnly, DateTime } from "@/hooks";
import Swal from "sweetalert2/dist/sweetalert2.js";
import withReactContent from "sweetalert2-react-content";
import { SkeletonLoading } from "@/components";

const MySwal = withReactContent(Swal);

const FeatureAdjustDetailPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [refData, setRefData] = useState([]);
  const [orderHeader, setOrderHeader] = useState([]);
  // const [whs, setWhs] = useState("");
  const [limit, setLimit] = useState(100);
  const [offer, setOffer] = useState(1);

  const fetchData = async (id) => {
    console.dir(session?.user);
    const whs = session?.user.whs.name;
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const res = await fetch(
      `${process.env.API_HOST}/gl/prod?whs=${whs}&limit=${limit}&offer=${offer}&glref_id=${id}`,
      requestOptions
    );

    if (res.ok) {
      const data = await res.json();
      console.dir(data.data);
      setRefData(data.data);
    }
  };

  const SumQty = (obj) => {
    let q = 0;
    obj.map((i) => (q += i.fnqty));
    return q.toLocaleString();
  };

  const handleSuccess = async (invNo) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", session?.user.accessToken);
    var raw = JSON.stringify({
      fcrefno: invNo,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const res = await fetch(
      `${process.env.API_HOST}/gl/transfer/${router.query.id}?whs=${session?.user.whs.name}`,
      requestOptions
    );

    if (res.ok) {
      // const data = await res.json();
      MySwal.fire({
        text: `Save data is successfully.`,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#19B5FE",
        preConfirm: () => fetchData(router.query.id),
      });
    }

    if (!res.ok) {
      const data = await res.json();
      MySwal.fire({
        text: data.message,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#CF3A24",
        preConfirm: () => fetchData(router.query.id),
      });
    }
  };

  const filterPo = async (invoiceNo) => {
    setOrderHeader([]);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    // const res = await fetch(
    //   `${process.env.API_HOST}/order/head?book=${refData[0].glref.fcbook}&whs=${session?.user.whs.name}&limit=1&offer=1&filterOrderNo=${invoiceNo}&fcreftype=PO`,
    //   requestOptions
    // );

    const res = await fetch(
      `${process.env.API_HOST}/order/head?whs=${session?.user.whs.name}&limit=1&offer=1&filterOrderNo=${invoiceNo}&fcreftype=PO&fcstep=P`,
      requestOptions
    );

    if (res.ok) {
      const data = await res.json();
      return data.data;
    }

    if (!res.ok) {
      return false;
    }
  };

  const handlerInputInvoice = async () => {
    const { value: invoiceNo } = await MySwal.fire({
      title: "Please enter Invoice No.?",
      input: "text",
      inputPlaceholder: "Enter Invoice No",
      // showCancelButton: true,
    });

    if (invoiceNo) {
      const invData = await filterPo(invoiceNo);
      if (invData.length > 0) {
        console.dir(invData);
      }
      setOrderHeader(invData);
      // MySwal.fire({
      //   text: `Would you like transfer data to ${invoiceNo.toUpperCase()}?`,
      //   icon: "warning",
      //   showCancelButton: true,
      //   cancelButtonText: "Cancel",
      //   confirmButtonText: "OK",
      //   confirmButtonColor: "#19B5FE",
      //   cancelButtonColor: "#CF3A24",
      //   preConfirm: () => handleSuccess(invoiceNo.toUpperCase()),
      // });
    }
  };

  const isConfirm = () => {
    MySwal.fire({
      text: `Would you like to confirm received data?`,
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "OK",
      confirmButtonColor: "#19B5FE",
      preConfirm: () => handlerInputInvoice(),
    });
  };

  const handlerConfirmDeleteItem = (obj) => {
    console.dir(obj);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "http://127.0.0.1:4040/api/v1/gl/prod/xxxxx?whs=VCST",
      requestOptions
    );
  };

  const DeleteItem = (obj) => {
    // console.dir(obj);
    MySwal.fire({
      text: `Would you like to confirm delete ${obj.prod.fccode}?`,
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "OK",
      confirmButtonColor: "#19B5FE",
      preConfirm: () => handlerConfirmDeleteItem(obj),
    });
  };

  useEffect(() => {
    if (session?.user) {
      setRefData([]);
      fetchData(router.query.id);
    }
  }, [router]);
  return (
    <MainLayout>
      {refData <= 0 ? (
        <SkeletonLoading />
      ) : (
        <>
          <div className="lg:my-12 container px-6 mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-gray-300">
            <div>
              {refData.length > 0 ? (
                <>
                  <div className="flex justify-start space-x-4">
                    <h4 className="text-sm font-bold leading-tight">
                      FCCODE:{" "}
                      <span className="text-blue-500">
                        {refData[0].glref.fccode}
                      </span>
                    </h4>
                    <h4 className="text-sm font-bold leading-tight">
                      REFNO.:{" "}
                      <span className="text-blue-500">
                        {refData[0].glref.fcrefno}
                      </span>
                    </h4>
                    <h4 className="text-sm font-bold leading-tight">
                      REC. DATE:{" "}
                      <span className="text-blue-500">
                        {DateOnly(refData[0].glref.fddate)}
                      </span>
                    </h4>
                    <h4 className="text-sm font-bold leading-tight flex space-x-4">
                      <div>REC. STATUS:</div>
                      <span
                        className={
                          refData[0].glref.fcstatus
                            ? `text-blue-500`
                            : `text-rose-500`
                        }
                      >
                        {refData[0].glref.fcstatus ? `Completed` : `In Process`}
                      </span>
                    </h4>
                  </div>
                  <div className="flex justify-start space-x-4">
                    <h4 className="text-sm font-bold leading-tight text-gray-800">
                      TYPE:{" "}
                      <span className="text-blue-500">{`${refData[0].glref.book?.fccode}-${refData[0].glref.book?.fcname}`}</span>
                    </h4>
                    <h4 className="text-sm font-bold leading-tight text-gray-800">
                      FROM:{" "}
                      <span className="text-blue-500">{`${refData[0].glref.from?.fccode}-${refData[0].glref.from?.fcname}`}</span>
                    </h4>
                    <h4 className="text-sm font-bold leading-tight text-gray-800">
                      TO:{" "}
                      <span className="text-blue-500">{`${refData[0].glref.to?.fccode}-${refData[0].glref.to?.fcname}`}</span>
                    </h4>
                  </div>
                  <div className="flex justify-start space-x-4">
                    <h4 className="text-sm font-bold leading-tight text-gray-800">
                      TOTAL:{" "}
                      <span className="text-blue-500">{refData.length}</span>
                    </h4>
                    <h4 className="text-sm font-bold leading-tight text-gray-800">
                      QTY.:{" "}
                      <span className="text-blue-500">{SumQty(refData)}</span>
                    </h4>
                    <h4 className="text-sm font-bold leading-tight text-gray-800">
                      REMARK:{" "}
                      <span className="text-blue-500">
                        {refData[0].glref.fmmemdata}
                      </span>
                    </h4>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
            <div className="flex space-x-3 mt-6 lg:mt-0">
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
              {!refData[0].glref.fcstatus ? (
                <Button
                  auto
                  color={`primary`}
                  size={`sm`}
                  ripple
                  onPress={isConfirm}
                >
                  Confirm Invoice
                </Button>
              ) : (
                <></>
              )}
            </div>
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
                {/* <Table.Column>Staus</Table.Column> */}
                <Table.Column></Table.Column>
              </Table.Header>
              <Table.Body>
                {refData.map((i, x) => (
                  <Table.Row key={x}>
                    <Table.Cell>{i.fcseq}</Table.Cell>
                    <Table.Cell>{i.prod.fccode}</Table.Cell>
                    <Table.Cell>{i.prod.fcname}</Table.Cell>
                    <Table.Cell>{i?.fnqty.toLocaleString()}</Table.Cell>
                    <Table.Cell>{i.unit.fcname}</Table.Cell>
                    {/* <Table.Cell></Table.Cell> */}
                    <Table.Cell>
                      <div className="flex justify-start space-x-4">
                        <div>{DateTime(i.ftlastupd)}</div>
                        {/* {i.glref.fcstatus ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4 text-green-600"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        ) : (
                          <Button
                            auto
                            light
                            size={"xs"}
                            onPress={() => DeleteItem(i)}
                          >
                            <Tooltip content={`Delete ${i.prod.fccode}?`}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4 text-rose-600"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </Tooltip>
                          </Button>
                        )} */}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default FeatureAdjustDetailPage;

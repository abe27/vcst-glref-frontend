/* eslint-disable react-hooks/exhaustive-deps */
import { DateOnly, DateString, DateTime, SubDateTime } from "@/hooks";
import { Button, Input, Loading, Table, Tooltip } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { MainLayout } from "@/components";
import Link from "next/link";
import { useRouter } from "next/router";

const AdjustmentPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [reloading, setReloading] = useState(false);
  const [glRefData, setGlRefData] = useState([]);
  const [limit, setLimit] = useState(100);
  const [offer, setOffer] = useState(1);
  const [filterGlrefNo, setFilterGlrefNo] = useState("");
  const [fddate, setFdDate] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchData = async () => {
    setReloading(true);
    setGlRefData([]);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const res = await fetch(
      `${process.env.API_HOST}/gl/ref?whs=${session?.user.whs.name}&limit=${limit}&offer=${offer}&fddate=${fddate}&filterGlrefNo=${filterGlrefNo}&fcreftype=AJ`,
      requestOptions
    );

    if (res.ok) {
      const data = await res.json();
      if (data.data) {
        setGlRefData(data.data);
      }
      setReloading(false);
      return;
    }

    if (!res.ok) {
      console.dir(res.statusText);
      setReloading(false);
      return;
    }
  };

  useEffect(() => {
    if (session?.user) {
      if (fddate.length > 0) {
        fetchData();
      }
    }
  }, [fddate, filterGlrefNo]);

  useEffect(() => {
    let d = new Date();
    setFdDate(DateOnly(d));
  }, []);
  return (
    <MainLayout title="Adjustment Page" description="จัดการข้อมูลการรับสินค้า">
      <div className="lg:my-12 container px-6 mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-gray-300">
        <div>
          <h4 className="text-2xl font-bold leading-tight text-gray-800">
            Receive Invoice Adjust
          </h4>
          <ul className="flex flex-col md:flex-row items-start md:items-center text-gray-600 text-sm mt-3">
            <li className="flex items-center mr-3 mt-3 md:mt-0">
              <span className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-paperclip"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                  />
                </svg>
              </span>
              <span>
                Activity(
                <span className="text-blue-500">
                  {glRefData ? glRefData.length : "0"}
                </span>
                )
              </span>
            </li>
            <li className="flex items-center mr-3 mt-3 md:mt-0">
              <span className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-trending-up"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </span>
              <span>
                Invalid(<span className="text-rose-500">0</span>)
              </span>
            </li>
            <li className="flex items-center mt-3 md:mt-0">
              <span className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-plane-departure"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              <span>
                Updated on{" "}
                <span className="text-green-500">{DateString(fddate)}</span>
              </span>
            </li>
          </ul>
        </div>
        <div className="flex space-x-3 mt-6 lg:mt-0">
          {reloading ? (
            <Loading />
          ) : (
            <Button
              auto
              flat
              color={`default`}
              size={`sm`}
              ripple
              onPress={fetchData}
            >
              Reload
            </Button>
          )}
          <Button
            auto
            color={`error`}
            size={`sm`}
            ripple
            onPress={() => router.push("/feature/adjust/add")}
          >
            Add New
          </Button>
        </div>
      </div>
      <div>
        <div className="mb-4 flex justify-between">
          <div className="flex justify-start space-x-4 w-full">
            <div className="flex justify-start space-x-2">
              <span className="mt-1 text-sm font-bold text-gray-600">
                REC. DATE:
              </span>
              <Input
                clearable
                size="sm"
                shadow={false}
                status="default"
                type="date"
                value={fddate}
                onChange={(e) => setFdDate(e.target.value)}
              />
            </div>
            <div className="flex justify-start space-x-2">
              <span className="mt-1 text-sm font-bold text-gray-600">
                REF. No.:
              </span>
              <Input
                clearable
                size="sm"
                shadow={false}
                status="default"
                value={filterGlrefNo}
                placeholder="REF.NO"
                onChange={(e) => setFilterGlrefNo(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 w-full">
            <div className="flex justify-start space-x-2">
              {/* <Button
                auto
                color={"success"}
                size={"sm"}
                icon={
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
                      d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
                    />
                  </svg>
                }
              >
                Export
              </Button> */}
            </div>
          </div>
        </div>
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
            <Table.Column>Date</Table.Column>
            {/* <Table.Column>I/O</Table.Column> */}
            <Table.Column>BOOK</Table.Column>
            <Table.Column>FCCODE.</Table.Column>
            <Table.Column>REFNO.</Table.Column>
            <Table.Column>QTY.</Table.Column>
            <Table.Column>Out</Table.Column>
            <Table.Column>In</Table.Column>
            <Table.Column>REMARK</Table.Column>
            <Table.Column>STATUS.</Table.Column>
            <Table.Column></Table.Column>
          </Table.Header>
          <Table.Body>
            {glRefData &&
              glRefData.map((i, x) => (
                <Table.Row key={x}>
                  <Table.Cell>{x + 1}</Table.Cell>
                  <Table.Cell>{DateOnly(i.fddate)}</Table.Cell>
                  {/* <Table.Cell>{i.fcstep === "I" ? "In" : "Out"}</Table.Cell> */}
                  <Table.Cell>
                    {
                      <Tooltip content={i.book.fcname}>
                        {i.book.fcname.length > 20
                          ? `${i.book.fccode}-${i.book.fcname.substring(
                              0,
                              5
                            )}.....`
                          : i.book.fcname}
                      </Tooltip>
                    }
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-indigo-400">{i.fccode}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link href={`/feature/adjust/detail?id=${i.fcskid}`}>
                      <span className="hover:text-indigo-600">{i.fcrefno}</span>
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className={
                        i.fnamt > 0 ? `text-blue-600` : "text-rose-600"
                      }
                    >
                      {i.fnamt.toLocaleString()}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    {i.from?.fccode !== undefined
                      ? `${i.from?.fccode}-${i.from?.fcname}`
                      : ``}
                  </Table.Cell>
                  <Table.Cell>
                    {i.to?.fccode !== undefined
                      ? `${i.to?.fccode}-${i.to?.fcname}`
                      : ""}
                  </Table.Cell>
                  <Table.Cell>
                    <Tooltip content={i.fmmemdata}>
                      {i.fmmemdata.length > 50
                        ? `${i.fmmemdata.substring(0, 20)}.....`
                        : i.fmmemdata}
                    </Tooltip>
                  </Table.Cell>
                  <Table.Cell>
                    <Button auto light size={"xs"}>
                      {i.fcstatus ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 text-green-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 text-rose-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </Button>
                  </Table.Cell>
                  <Table.Cell>{SubDateTime(i.ftlastupd)}</Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
          {glRefData ? (
            <Table.Pagination
              shadow
              noMargin
              align="center"
              rowsPerPage={rowsPerPage}
              onPageChange={(page) => console.log(page)}
            />
          ) : (
            <></>
          )}
        </Table>
      </div>
    </MainLayout>
  );
};

export default AdjustmentPage;

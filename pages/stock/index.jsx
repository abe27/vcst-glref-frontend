/* eslint-disable react-hooks/exhaustive-deps */
import MainLayout from "@/components/layout";
import { useToast } from "@chakra-ui/react";
import { Button, Table, useAsyncList } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

let onPage = 0;
const StockPage = () => {
  const toast = useToast();
  const { data: session } = useSession();
  const [stockData, setStockData] = useState([]);

  const fetchData = async (page = 1) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const res = await fetch(
      `${process.env.API_HOST}/stock?offset=${page}&limit=10&whs=VCST`,
      requestOptions
    );

    if (res.ok) {
      const data = await res.json();
      console.log(`fetch data on page: ${page}`);
      console.dir(data.data);
      setStockData(data.data);
      return;
    }

    if (!res.ok) {
      toast({
        title: "Error fetching stock",
        description: res.statusText,
        status: "error",
        duration: 3500,
        isClosable: true,
        position: "top",
      });
      return;
    }
  };

  const columns = [
    { name: "#", uid: "name" },
    { name: "No", uid: "height" },
    { name: "Description", uid: "mass" },
    { name: "Description", uid: "birth_year" },
  ];

  const load = async ({ signal, cursor }) => {
    console.log(signal);
    onPage++;
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
      signal: signal,
    };

    // const res = await fetch(
    //   cursor || "https://swapi.py4e.com/api/people/?search=",
    //   requestOptions,
    //   { signal }
    // );
    console.log(
      `${process.env.API_HOST}/stock?offset=${page}&limit=10&whs=VCST`
    );
    console.dir(cursor);
    const res = await fetch(
      cursor ||
        `${process.env.API_HOST}/stock?offset=${page}&limit=10&whs=VCST`,
      requestOptions
    );

    console.dir(res);
    const json = await res.json();
    console.dir(json);
    // onPage++;
    // if (session?.user) {
    //   fetchData(onPage);
    // }
    return {
      items: json.results,
      cursor: json.next,
    };
  };
  const list = useAsyncList({ load });

  // useEffect(() => {
  //   if (session?.user) {
  //     fetchData(onPage);
  //   }
  // }, [session]);
  return (
    <MainLayout title="รายการสินค้าคงคลัง">
      <div className="lg:my-12 container px-6 mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-gray-300">
        <div>
          <h4 className="text-2xl font-bold leading-tight text-gray-800">
            รายการสินค้า
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
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <path d="M15 7l-6.5 6.5a1.5 1.5 0 0 0 3 3l6.5 -6.5a3 3 0 0 0 -6 -6l-6.5 6.5a4.5 4.5 0 0 0 9 9 l6.5 -6.5" />
                </svg>
              </span>
              <span>Active</span>
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
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <polyline points="3 17 9 11 13 15 21 7" />
                  <polyline points="14 7 21 7 21 14" />
                </svg>
              </span>
              <span> Trending</span>
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
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <path
                    d="M15 12h5a2 2 0 0 1 0 4h-15l-3 -6h3l2 2h3l-2 -7h3z"
                    transform="rotate(-15 12 12) translate(0 -1)"
                  />
                  <line x1={3} y1={21} x2={21} y2={21} />
                </svg>
              </span>
              <span>Started on 29 Jan 2020</span>
            </li>
          </ul>
        </div>
        <div className="mt-6 lg:mt-0">
          <div className="flex justify-start">
            <div></div>
            <div className="flex justify-end">
              <Button size={"sm"} auto color={"secondary"}>
                Reload
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6">
        <Table
          bordered
          shadow={false}
          aria-label="Example table with dynamic content & infinity pagination"
          css={{ minWidth: "100%", height: "calc($space$14 * 10)" }}
          color="secondary"
        >
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column key={column.uid}>{column.name}</Table.Column>
            )}
          </Table.Header>
          <Table.Body
            items={list.items}
            loadingState={list.loadingState}
            onLoadMore={list.loadMore}
          >
            {(item) => (
              <Table.Row key={item.name}>
                {(key) => <Table.Cell>{item[key]}</Table.Cell>}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </MainLayout>
  );
};

export default StockPage;

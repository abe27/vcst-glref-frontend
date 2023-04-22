/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import MainLayout from "@/components/layout";
import { Button, Input, Table } from "@nextui-org/react";
import { DateTime } from "@/hooks";
import { DrawerAddNewItem } from "@/components";

const AddNewAdjustPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [refData, setRefData] = useState([]);

  return (
    <MainLayout>
      <div className="lg:my-12 container px-6 mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-gray-300">
        <div>
          <div className="flex justify-start space-x-4">
            <h4 className="text-sm font-bold leading-tight text-gray-800">
              TYPE:&nbsp;&nbsp;
              <Input disabled clearable size="xs" placeholder="MRRP" />
            </h4>
            <h4 className="text-sm font-bold leading-tight text-gray-800">
              FROM:&nbsp;&nbsp;
              <Input disabled clearable size="xs" placeholder="qty" />
            </h4>
            <h4 className="text-sm font-bold leading-tight text-gray-800">
              TO:&nbsp;&nbsp;
              <Input disabled clearable size="xs" placeholder="qty" />
            </h4>
          </div>
          <div className="flex justify-start space-x-4">
            <h4 className="text-sm font-bold leading-tight text-gray-800">
              TOTAL:&nbsp;&nbsp;
              <Input
                disabled
                clearable
                type="number"
                size="xs"
                placeholder="qty"
              />
            </h4>
            <h4 className="text-sm font-bold leading-tight text-gray-800">
              QTY.:&nbsp;&nbsp;
              <Input
                disabled
                clearable
                type="number"
                size="xs"
                placeholder="qty"
              />
            </h4>
            <h4 className="text-sm font-bold leading-tight text-gray-800">
              REMARK:&nbsp;&nbsp;
              <Input clearable size="xs" placeholder="remark" />
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
          <DrawerAddNewItem />
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
            <Table.Column>Staus</Table.Column>
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
                <Table.Cell></Table.Cell>
                <Table.Cell>{DateTime(i.ftlastupd)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </MainLayout>
  );
};

export default AddNewAdjustPage;

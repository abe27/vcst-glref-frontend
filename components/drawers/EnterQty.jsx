/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useMemo } from "react";

const { Button, Modal, Text, Input, Dropdown } = require("@nextui-org/react");

const EnterQty = ({
  isVisible = false,
  isConfirm = {},
  session = null,
  whsName = null,
  umID = null,
}) => {
  const [qty, setQty] = useState(0);
  const [selected, setSelected] = useState(new Set(["text"]));
  const [umData, setUmData] = useState([]);
  const [visible, setVisible] = useState(false);

  const closeHandler = () => {
    const id = Array.from(selected).join(", ").replaceAll("_", " ");
    if (selected !== "-") {
      setVisible(false);
      const obj = umData.filter((i) => i.fcskid === id);
      isConfirm({
        qty: qty,
        unit: obj[0],
      });
    }
  };

  const selectedValue = useMemo(() => {
    const id = Array.from(selected).join(", ").replaceAll("_", " ");
    const obj = umData.filter((i) => i.fcskid === id);
    if (obj.length > 0) {
      return `${obj[0].fcname}`;
    }
    return "-";
  }, [selected]);

  const GetUnit = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const res = await fetch(
      `${process.env.API_HOST}/unit?offset=1&limit=100&whs=${whsName}`,
      requestOptions
    );

    if (res.ok) {
      const data = await res.json();
      setUmData(data.data);
    }
  };

  useEffect(() => {
    if (umData.length > 0) {
      // const unit = data.data.filter((i) => i.fcskid === umID);
      setSelected(new Set([umID]));
    }
  }, [umData]);

  useEffect(() => {
    console.log(`Show: ${visible}`);
    if (visible) {
      GetUnit();
    }
  }, [visible]);

  return (
    <>
      <Button auto color={"primary"} onPress={() => setVisible(isVisible)}>
        Add Now
      </Button>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Enter Qty.
          </Text>
        </Modal.Header>
        <Modal.Body>
          <div className="flex justify-between">
            <div className="flex justify-start w-full">
              <Input
                clearable
                bordered
                fullWidth
                color="primary"
                size="sm"
                placeholder="Qty"
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Dropdown>
                <Dropdown.Button light>{selectedValue}</Dropdown.Button>
                <Dropdown.Menu
                  aria-label="Static Actions"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={selected}
                  onSelectionChange={setSelected}
                >
                  {umData.map((i, x) => (
                    <Dropdown.Item key={i.fcskid} description={i.fcname}>
                      {`${i.fccode}`}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onPress={closeHandler}>
            Close
          </Button>
          <Button auto onPress={closeHandler}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EnterQty;
